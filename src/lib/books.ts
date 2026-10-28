import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import { db } from './db'

// Royal Road stats are frozen (the scraper is blocked), so catalog data can be cached for long
// stretches. Community data refreshes immediately through the `book:<id>` tag.
export const PAGE_SIZE = 24

export const SORTS = {
  popular: 'Most followed',
  rating: 'Highest rated',
  community: 'Community ranked',
  pages: 'Longest',
  title: 'Title',
} as const

export type SortKey = keyof typeof SORTS

export function isSortKey(value: string | undefined): value is SortKey {
  return value !== undefined && value in SORTS
}

export interface BookSummary {
  id: string
  title: string
  authorName: string
  coverUrl: string | null
  tags: string[]
  source: 'ROYAL_ROAD' | 'AMAZON'
  rating: number | null
  followers: number | null
  pages: number | null
  communityScore: number
}

export interface BookQuery {
  q?: string
  tags?: string[]
  // A book matches when it has any of these tags (used for realms).
  anyTags?: string[]
  sort?: SortKey
  page?: number
}

// Royal Road returns this relative path when a fiction has no cover.
export function coverOrNull(url: string | null): string | null {
  return url && url.startsWith('http') ? url : null
}

// Tier weights used for community ranking: SSS=9 down to F=1.
const TIER_SCORE = Prisma.sql`CASE tier
  WHEN 'SSS' THEN 9 WHEN 'SS' THEN 8 WHEN 'S' THEN 7 WHEN 'A' THEN 6 WHEN 'B' THEN 5
  WHEN 'C' THEN 4 WHEN 'D' THEN 3 WHEN 'E' THEN 2 WHEN 'F' THEN 1 ELSE 0 END`

const ORDER_BY: Record<SortKey, Prisma.Sql> = {
  popular: Prisma.sql`l.followers DESC NULLS LAST`,
  // Books without Royal Road stats (Amazon) have NULL here and must not float to the top.
  rating: Prisma.sql`COALESCE(l.ratings_count >= 50, false) DESC, l.rating DESC NULLS LAST`,
  community: Prisma.sql`community_score DESC, l.followers DESC NULLS LAST`,
  pages: Prisma.sql`l.pages DESC NULLS LAST`,
  title: Prisma.sql`b.title ASC`,
}

const LATEST_STATS = Prisma.sql`
  SELECT DISTINCT ON ("bookId") "bookId", rating, followers, pages, views, favorites, ratings_count
  FROM "BookStats"
  ORDER BY "bookId", "createdAt" DESC`

const COMMUNITY = Prisma.sql`
  SELECT "bookId", SUM(${TIER_SCORE})::int AS score
  FROM "BookTier"
  WHERE tier IS NOT NULL
  GROUP BY "bookId"`

type SummaryRow = Omit<BookSummary, 'communityScore'> & { community_score: number; total: number }

function toSummary(row: SummaryRow): BookSummary {
  return {
    id: row.id,
    title: row.title,
    authorName: row.authorName,
    coverUrl: coverOrNull(row.coverUrl),
    tags: row.tags,
    source: row.source,
    rating: row.rating,
    followers: row.followers,
    pages: row.pages,
    communityScore: row.community_score,
  }
}

export async function searchBooks(query: BookQuery): Promise<{ books: BookSummary[]; total: number }> {
  'use cache'
  cacheLife('weeks')
  cacheTag('books')

  const { q, tags = [], anyTags = [], sort = 'popular', page = 1 } = query
  if (sort === 'community') cacheTag('community')
  const conditions: Prisma.Sql[] = []
  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`
    conditions.push(Prisma.sql`(b.title ILIKE ${pattern} OR b."authorName" ILIKE ${pattern})`)
  }
  if (tags.length) conditions.push(Prisma.sql`b.tags @> ${tags}::text[]`)
  if (anyTags.length) conditions.push(Prisma.sql`b.tags && ${anyTags}::text[]`)
  const where = conditions.length ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE

  const rows = await db.$queryRaw<SummaryRow[]>`
    WITH l AS (${LATEST_STATS}), c AS (${COMMUNITY})
    SELECT b.id, b.title, b."authorName", b."coverUrl", b.tags, b.source::text AS source,
           l.rating, l.followers, l.pages,
           COALESCE(c.score, 0) AS community_score,
           COUNT(*) OVER()::int AS total
    FROM "Book" b
    LEFT JOIN l ON l."bookId" = b.id
    LEFT JOIN c ON c."bookId" = b.id
    ${where}
    ORDER BY ${ORDER_BY[sort]}, b.id
    LIMIT ${PAGE_SIZE} OFFSET ${offset}`

  return { books: rows.map(toSummary), total: rows[0]?.total ?? 0 }
}

// Books the community has ranked, best first. Falls back to nothing when no one has ranked yet.
export async function getCommunityFavorites(limit = 12): Promise<BookSummary[]> {
  'use cache'
  cacheLife('days')
  cacheTag('books', 'community')
  const { books } = await searchBooks({ sort: 'community' })
  return books.filter(book => book.communityScore > 0).slice(0, limit)
}

export async function getTopTags(limit = 24): Promise<{ tag: string; count: number }[]> {
  'use cache'
  cacheLife('max')
  cacheTag('books')
  return db.$queryRaw<{ tag: string; count: number }[]>`
    SELECT t AS tag, COUNT(*)::int AS count
    FROM "Book", unnest(tags) AS t
    GROUP BY t
    HAVING COUNT(*) >= 50
    ORDER BY count DESC
    LIMIT ${limit}`
}

export const TIERS = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F'] as const
export type Tier = (typeof TIERS)[number]

export interface BookDetail extends BookSummary {
  description: string
  sourceUrl: string
  contentWarnings: string[]
  views: number | null
  favorites: number | null
  ratingsCount: number | null
  scores: { overall: number; style: number; story: number; grammar: number; character: number } | null
  statsUpdatedAt: Date | null
  contributors: { name: string; role: string; url: string | null }[]
  tierCounts: Partial<Record<Tier, number>>
  readerCount: number
  reviews: { id: string; author: string; text: string; updatedAt: Date }[]
}

export async function getBook(id: string): Promise<BookDetail | null> {
  'use cache'
  cacheLife('max')
  cacheTag('books', `book:${id}`)

  const book = await db.book.findUnique({
    where: { id },
    include: {
      stats: { orderBy: { createdAt: 'desc' }, take: 1 },
      bookContributors: { include: { contributor: true } },
      bookReviews: {
        orderBy: { updatedAt: 'desc' },
        include: { user: { select: { firstName: true } } },
      },
    },
  })
  if (!book) return null

  const [tierRows, readerCount] = await Promise.all([
    db.bookTier.groupBy({ by: ['tier'], where: { bookId: id, tier: { not: null } }, _count: true }),
    db.bookTier.count({ where: { bookId: id } }),
  ])
  const tierCounts: Partial<Record<Tier, number>> = {}
  let communityScore = 0
  for (const row of tierRows) {
    if (!row.tier) continue
    tierCounts[row.tier] = row._count
    communityScore += (9 - TIERS.indexOf(row.tier)) * row._count
  }

  const stats = book.stats[0]
  return {
    id: book.id,
    title: book.title,
    authorName: book.authorName,
    coverUrl: coverOrNull(book.coverUrl),
    tags: book.tags,
    source: book.source,
    description: book.description,
    sourceUrl: book.sourceUrl,
    contentWarnings: book.contentWarnings,
    rating: stats?.rating ?? null,
    followers: stats?.followers ?? null,
    pages: stats?.pages ?? null,
    views: stats?.views ?? null,
    favorites: stats?.favorites ?? null,
    ratingsCount: stats?.ratings_count ?? null,
    scores: stats?.overall_score
      ? {
          overall: stats.overall_score,
          style: stats.style_score,
          story: stats.story_score,
          grammar: stats.grammar_score,
          character: stats.character_score,
        }
      : null,
    statsUpdatedAt: stats?.createdAt ?? null,
    communityScore,
    contributors: book.bookContributors.map(bc => ({
      name: bc.contributor.name,
      role: bc.contributorType,
      url: bc.contributor.linkToContributor,
    })),
    tierCounts,
    readerCount,
    reviews: book.bookReviews.map(review => ({
      id: review.id,
      author: review.user.firstName,
      text: review.review,
      updatedAt: review.updatedAt,
    })),
  }
}

// Tags too broad to say much about similarity.
const GENERIC_TAGS = ['Fantasy', 'Adventure', 'Action', 'Magic', 'Male Lead', 'Female Lead', 'Strong Lead']

export async function getSimilarBooks(id: string, tags: string[], limit = 8): Promise<BookSummary[]> {
  'use cache'
  cacheLife('max')
  cacheTag('books')

  const specific = tags.filter(tag => !GENERIC_TAGS.includes(tag))
  if (!specific.length) return []

  const rows = await db.$queryRaw<SummaryRow[]>`
    WITH l AS (${LATEST_STATS})
    SELECT b.id, b.title, b."authorName", b."coverUrl", b.tags, b.source::text AS source,
           l.rating, l.followers, l.pages, 0 AS community_score, 0 AS total
    FROM "Book" b
    JOIN l ON l."bookId" = b.id
    WHERE b.id <> ${id} AND b.tags && ${specific}::text[] AND l.followers >= 500
    ORDER BY cardinality(ARRAY(SELECT unnest(b.tags) INTERSECT SELECT unnest(${specific}::text[]))) DESC,
             l.followers DESC
    LIMIT ${limit}`
  return rows.map(toSummary)
}

// Highest-followed book ids, prerendered at build time.
export async function getTopBookIds(limit: number): Promise<string[]> {
  'use cache'
  cacheLife('weeks')
  const rows = await db.$queryRaw<{ id: string }[]>`
    WITH l AS (${LATEST_STATS})
    SELECT b.id FROM "Book" b JOIN l ON l."bookId" = b.id
    ORDER BY l.followers DESC LIMIT ${limit}`
  return rows.map(row => row.id)
}

export async function getAllBookIds(): Promise<{ id: string; updatedAt: Date }[]> {
  'use cache'
  cacheLife('weeks')
  return db.book.findMany({ select: { id: true, updatedAt: true } })
}
