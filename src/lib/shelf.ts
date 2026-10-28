import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import type { ReadingStatus } from '@/generated/prisma/client'
import { coverOrNull, TIERS, type BookSummary, type Tier } from './books'
import { db } from './db'

// Premium tiers hold a limited number of books; the rest are unlimited.
export const TIER_LIMITS: Partial<Record<Tier, number>> = { SSS: 1, SS: 3, S: 5 }

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  WANT_TO_READ: 'Want to read',
  READING: 'Reading',
  FINISHED: 'Finished',
}

export interface ShelfState {
  status: ReadingStatus | null
  tier: Tier | null
  review: string | null
}

export async function getShelfState(userId: string, bookId: string): Promise<ShelfState> {
  const [entry, review] = await Promise.all([
    db.bookTier.findUnique({ where: { userId_bookId: { userId, bookId } }, select: { readingStatus: true, tier: true } }),
    db.bookReview.findUnique({ where: { userId_bookId: { userId, bookId } }, select: { review: true } }),
  ])
  return { status: entry?.readingStatus ?? null, tier: entry?.tier ?? null, review: review?.review ?? null }
}

type ShelfBook = Pick<BookSummary, 'id' | 'title' | 'authorName' | 'coverUrl'>

export interface Profile {
  id: string
  firstName: string
  username: string
  joinedAt: Date
  tiers: Record<Tier, ShelfBook[]>
  reading: ShelfBook[]
  wantToRead: ShelfBook[]
  diary: { id: string; loggedOn: Date; status: ReadingStatus; tier: Tier | null; book: ShelfBook }[]
  reviews: { id: string; text: string; updatedAt: Date; book: ShelfBook }[]
}

const BOOK_FIELDS = { id: true, title: true, authorName: true, coverUrl: true } as const

function toShelfBook(book: { id: string; title: string; authorName: string; coverUrl: string | null }): ShelfBook {
  return { ...book, coverUrl: coverOrNull(book.coverUrl) }
}

export async function getProfile(username: string): Promise<Profile | null> {
  'use cache'
  cacheLife('max')

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, firstName: true, username: true, createdAt: true },
  })
  if (!user) return null
  cacheTag(`user:${user.id}`)

  const [entries, logs, reviews] = await Promise.all([
    db.bookTier.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: { tier: true, readingStatus: true, book: { select: BOOK_FIELDS } },
    }),
    db.readingLog.findMany({
      where: { userId: user.id },
      orderBy: [{ loggedOn: 'desc' }, { createdAt: 'desc' }],
      take: 30,
      select: { id: true, loggedOn: true, status: true, tier: true, book: { select: BOOK_FIELDS } },
    }),
    db.bookReview.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, review: true, updatedAt: true, book: { select: BOOK_FIELDS } },
    }),
  ])

  const tiers = Object.fromEntries(TIERS.map(tier => [tier, [] as ShelfBook[]])) as Record<Tier, ShelfBook[]>
  const reading: ShelfBook[] = []
  const wantToRead: ShelfBook[] = []
  for (const entry of entries) {
    const book = toShelfBook(entry.book)
    if (entry.tier) tiers[entry.tier].push(book)
    else if (entry.readingStatus === 'READING') reading.push(book)
    else if (entry.readingStatus === 'WANT_TO_READ') wantToRead.push(book)
  }
  // Ranked books still show under "Reading" when they're in progress.
  for (const entry of entries) {
    if (entry.tier && entry.readingStatus === 'READING') reading.push(toShelfBook(entry.book))
  }

  return {
    id: user.id,
    firstName: user.firstName,
    username: user.username!,
    joinedAt: user.createdAt,
    tiers,
    reading,
    wantToRead,
    diary: logs.map(log => ({ ...log, book: toShelfBook(log.book) })),
    reviews: reviews.map(review => ({ id: review.id, text: review.review, updatedAt: review.updatedAt, book: toShelfBook(review.book) })),
  }
}
