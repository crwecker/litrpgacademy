import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { BookCover } from '@/components/BookCover'
import { TIERS, type BookSummary, type Tier } from '@/lib/books'
import { getProfile, STATUS_LABELS, TIER_LIMITS } from '@/lib/shelf'

type ShelfBook = Pick<BookSummary, 'id' | 'title' | 'authorName' | 'coverUrl'>

const TIER_STYLES: Record<Tier, string> = {
  SSS: 'bg-tier-sss',
  SS: 'bg-tier-ss',
  S: 'bg-tier-s',
  A: 'bg-tier-a',
  B: 'bg-tier-b',
  C: 'bg-tier-c',
  D: 'bg-tier-d',
  E: 'bg-tier-e',
  F: 'bg-tier-f',
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export async function generateMetadata({ params }: PageProps<'/u/[username]'>): Promise<Metadata> {
  const profile = await getProfile((await params).username)
  if (!profile) return { title: 'Reader not found' }
  const ranked = TIERS.reduce((sum, tier) => sum + profile.tiers[tier].length, 0)
  const favorite = profile.tiers.SSS[0]
  return {
    title: `${profile.firstName}'s LitRPG tier list`,
    description: favorite
      ? `${profile.firstName} has ranked ${ranked} books. Their SSS pick: ${favorite.title}.`
      : `${profile.firstName}'s LitRPG reading on LitRPG Academy.`,
    alternates: { canonical: `/u/${profile.username}` },
  }
}

function Cover({ book, size = 'w-16' }: { book: ShelfBook; size?: string }) {
  return (
    <Link href={`/book/${encodeURIComponent(book.id)}`} title={`${book.title} by ${book.authorName}`} className={`${size} shrink-0 transition hover:-translate-y-0.5`}>
      <BookCover title={book.title} coverUrl={book.coverUrl} sizes='96px' />
    </Link>
  )
}

function MiniShelf({ title, books }: { title: string; books: ShelfBook[] }) {
  if (!books.length) return null
  return (
    <section className='mt-10'>
      <h2 className='mb-3 font-serif text-xl font-bold'>{title}</h2>
      <div className='flex flex-wrap gap-3'>
        {books.map(book => (
          <Cover key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

async function ProfileContent({ params }: { params: PageProps<'/u/[username]'>['params'] }) {
  const profile = await getProfile((await params).username)
  if (!profile) notFound()

  const topFour = [...profile.tiers.SSS, ...profile.tiers.SS].slice(0, 4)
  const rankedCount = TIERS.reduce((sum, tier) => sum + profile.tiers[tier].length, 0)

  return (
    <div className='pt-8'>
      <h1 className='font-serif text-3xl font-bold'>{profile.firstName}</h1>
      <p className='mt-1 text-sm text-dim'>
        @{profile.username} · {rankedCount} ranked · joined {dateFormat.format(profile.joinedAt)}
      </p>

      <section className='mt-8'>
        <h2 className='mb-3 font-serif text-xl font-bold'>Top 4</h2>
        <div className='grid max-w-2xl grid-cols-4 gap-3 sm:gap-4'>
          {Array.from({ length: 4 }, (_, index) => {
            const book = topFour[index]
            return book ? (
              <div key={book.id}>
                <Cover book={book} size='w-full' />
                <p className='mt-1.5 line-clamp-2 text-xs text-mist'>{book.title}</p>
              </div>
            ) : (
              <div key={index} className='aspect-[2/3] rounded-md border border-dashed border-line' />
            )
          })}
        </div>
      </section>

      <section className='mt-10'>
        <h2 className='mb-3 font-serif text-xl font-bold'>Tier list</h2>
        <div className='overflow-hidden rounded-lg border border-line'>
          {TIERS.map(tier => {
            const books = profile.tiers[tier]
            const limit = TIER_LIMITS[tier]
            return (
              <div key={tier} className={`flex border-b border-line last:border-b-0 ${books.length ? 'min-h-24' : 'min-h-12'}`}>
                <div className={`flex w-16 shrink-0 flex-col items-center justify-center font-bold text-night ${TIER_STYLES[tier]}`}>
                  <span className='text-lg'>{tier}</span>
                  {limit && (
                    <span className='text-[10px] font-semibold opacity-70'>
                      {books.length}/{limit}
                    </span>
                  )}
                </div>
                <div className='flex flex-1 flex-wrap items-center gap-2 bg-panel/40 p-2'>
                  {books.map(book => (
                    <Cover key={book.id} book={book} size='w-14' />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <MiniShelf title='Currently reading' books={profile.reading} />
      <MiniShelf title='Want to read' books={profile.wantToRead} />

      {profile.diary.length > 0 && (
        <section className='mt-10'>
          <h2 className='mb-3 font-serif text-xl font-bold'>Diary</h2>
          <ul className='divide-y divide-line rounded-lg border border-line'>
            {profile.diary.map(entry => (
              <li key={entry.id} className='flex items-center gap-3 p-3'>
                <span className='w-24 shrink-0 text-xs text-dim tabular-nums'>{dateFormat.format(entry.loggedOn)}</span>
                <Cover book={entry.book} size='w-8' />
                <Link href={`/book/${encodeURIComponent(entry.book.id)}`} className='min-w-0 flex-1 truncate text-sm hover:text-copper-hi'>
                  {entry.book.title}
                </Link>
                <span className='shrink-0 text-xs text-mist'>{STATUS_LABELS[entry.status]}</span>
                {entry.tier && (
                  <span className={`w-9 shrink-0 rounded py-0.5 text-center text-[11px] font-bold text-night ${TIER_STYLES[entry.tier]}`}>
                    {entry.tier}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.reviews.length > 0 && (
        <section className='mt-10'>
          <h2 className='mb-3 font-serif text-xl font-bold'>Reviews</h2>
          <ul className='space-y-3'>
            {profile.reviews.map(review => (
              <li key={review.id} className='flex gap-4 rounded-lg bg-panel/60 p-4'>
                <Cover book={review.book} size='w-12' />
                <div className='min-w-0'>
                  <Link href={`/book/${encodeURIComponent(review.book.id)}`} className='font-semibold hover:text-copper-hi'>
                    {review.book.title}
                  </Link>
                  <p className='mt-1 text-sm leading-relaxed whitespace-pre-line text-parchment/90'>{review.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default function ProfilePage(props: PageProps<'/u/[username]'>) {
  return (
    <Suspense fallback={<div className='h-96 animate-pulse pt-8' />}>
      <ProfileContent params={props.params} />
    </Suspense>
  )
}
