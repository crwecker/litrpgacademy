import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { BookShelf } from '@/components/BookCard'
import { BookCover } from '@/components/BookCover'
import { ShelfPanel } from '@/components/ShelfPanel'
import { TierBreakdown } from '@/components/TierBreakdown'
import { getBook, getSimilarBooks, getTopBookIds, type BookDetail } from '@/lib/books'
import { realmsForTags } from '@/lib/realms'
import { formatCount, formatRating } from '@/lib/site'

export async function generateStaticParams() {
  const ids = await getTopBookIds(50)
  return ids.map(bookId => ({ bookId }))
}

export async function generateMetadata({ params }: PageProps<'/book/[bookId]'>): Promise<Metadata> {
  const book = await getBook(decodeURIComponent((await params).bookId))
  if (!book) return { title: 'Book not found' }
  const description = book.description.replace(/\s+/g, ' ').slice(0, 200)
  return {
    title: `${book.title} by ${book.authorName}`,
    description,
    alternates: { canonical: `/book/${encodeURIComponent(book.id)}` },
    openGraph: {
      type: 'book',
      title: book.title,
      description,
      images: book.coverUrl ? [{ url: book.coverUrl, alt: `Cover of ${book.title}` }] : undefined,
    },
    twitter: { card: book.coverUrl ? 'summary' : 'summary_large_image' },
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg bg-panel/70 px-4 py-3'>
      <p className='text-xs tracking-wide text-dim uppercase'>{label}</p>
      <p className='mt-0.5 text-lg font-semibold'>{value}</p>
    </div>
  )
}

function SourceLink({ book }: { book: BookDetail }) {
  const isAmazon = book.source === 'AMAZON'
  return (
    <a
      href={book.sourceUrl}
      target='_blank'
      rel={isAmazon ? 'noopener sponsored' : 'noopener'}
      className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-copper px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-night hover:bg-copper-hi'
    >
      {isAmazon ? 'Get it on Amazon' : 'Read on Royal Road'} ↗
    </a>
  )
}

function bookJsonLd(book: BookDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: book.authorName },
    description: book.description.slice(0, 500),
    image: book.coverUrl ?? undefined,
    genre: book.tags,
    url: book.sourceUrl,
    // No aggregateRating: Royal Road's ratings aren't ours to mark up. Add one from community tiers later.
  }
}

async function BookContent({ params }: { params: PageProps<'/book/[bookId]'>['params'] }) {
  const book = await getBook(decodeURIComponent((await params).bookId))
  if (!book) notFound()
  const realms = realmsForTags(book.tags)
  const authors = book.contributors.filter(c => c.role === 'AUTHOR')

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd(book)).replace(/</g, '\\u003c') }}
      />
      <div className='grid gap-8 pt-8 md:grid-cols-[240px_1fr] lg:gap-12'>
        <div className='mx-auto w-48 md:w-full'>
          <BookCover title={book.title} coverUrl={book.coverUrl} sizes='240px' priority />
          <div className='mt-4 flex justify-center md:justify-start'>
            <SourceLink book={book} />
          </div>
          <div className='mt-4'>
            <ShelfPanel bookId={book.id} />
          </div>
        </div>

        <div>
          {realms.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {realms.map(realm => (
                <Link
                  key={realm.slug}
                  href={`/realm/${realm.slug}`}
                  className='rounded-full px-3 py-0.5 text-xs font-semibold'
                  style={{ backgroundColor: `${realm.accent}22`, color: realm.accent }}
                >
                  {realm.name} realm
                </Link>
              ))}
            </div>
          )}
          <h1 className='mt-2 font-serif text-3xl leading-tight font-bold sm:text-4xl'>{book.title}</h1>
          <p className='mt-2 text-lg text-mist'>
            by{' '}
            {authors.length && authors[0].url ? (
              <a href={authors[0].url} className='text-parchment hover:text-copper-hi' target='_blank' rel='noopener sponsored'>
                {book.authorName}
              </a>
            ) : (
              <Link href={`/search?q=${encodeURIComponent(book.authorName)}`} rel='nofollow' prefetch={false} className='text-parchment hover:text-copper-hi'>
                {book.authorName}
              </Link>
            )}
          </p>

          {book.source === 'ROYAL_ROAD' && (
            <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
              <Stat label='Rating' value={`★ ${formatRating(book.rating)}`} />
              <Stat label='Followers' value={formatCount(book.followers)} />
              <Stat label='Pages' value={formatCount(book.pages)} />
              <Stat label='Views' value={formatCount(book.views)} />
            </div>
          )}

          <div className='mt-6 max-w-3xl space-y-3 leading-relaxed whitespace-pre-line text-parchment/90'>
            {book.description}
          </div>

          <div className='mt-6 flex flex-wrap gap-2'>
            {book.tags.map(tag => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                rel='nofollow'
                prefetch={false}
                className='rounded-full border border-line px-3 py-1 text-sm text-mist hover:border-copper hover:text-parchment'
              >
                {tag}
              </Link>
            ))}
          </div>

          {book.contentWarnings.length > 0 && (
            <p className='mt-4 text-sm text-dim'>
              <span className='font-semibold text-mist'>Content warnings:</span> {book.contentWarnings.join(', ')}
            </p>
          )}

          <section className='mt-10 grid gap-8 lg:grid-cols-2'>
            <div>
              <h2 className='font-serif text-xl font-bold'>Community tier ranking</h2>
              <TierBreakdown counts={book.tierCounts} />
              <p className='mt-2 text-sm text-dim'>
                {book.readerCount > 0
                  ? `${book.readerCount} ${book.readerCount === 1 ? 'reader has' : 'readers have'} this on their shelf.`
                  : 'No one has ranked this yet. Be the first.'}
              </p>
            </div>
            <div>
              <h2 className='font-serif text-xl font-bold'>Reader reviews</h2>
              {book.reviews.length ? (
                <ul className='mt-3 space-y-3'>
                  {book.reviews.map(review => (
                    <li key={review.id} className='rounded-lg bg-panel/70 p-4'>
                      <p className='leading-relaxed whitespace-pre-line'>{review.text}</p>
                      <p className='mt-2 text-xs text-dim'>{review.author}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='mt-3 text-sm text-dim'>No reviews yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <Suspense>
        <SimilarBooks id={book.id} tags={book.tags} />
      </Suspense>
    </>
  )
}

async function SimilarBooks({ id, tags }: { id: string; tags: string[] }) {
  const books = await getSimilarBooks(id, tags)
  return <BookShelf title='If you like this, try' books={books} />
}

function BookSkeleton() {
  return (
    <div className='grid gap-8 pt-8 md:grid-cols-[240px_1fr]' aria-hidden>
      <div className='mx-auto aspect-[2/3] w-48 animate-pulse rounded-md bg-panel md:w-full' />
      <div className='space-y-3'>
        <div className='h-9 w-2/3 animate-pulse rounded bg-panel' />
        <div className='h-5 w-1/3 animate-pulse rounded bg-panel' />
        <div className='h-32 animate-pulse rounded bg-panel' />
      </div>
    </div>
  )
}

export default function BookPage(props: PageProps<'/book/[bookId]'>) {
  return (
    <Suspense fallback={<BookSkeleton />}>
      <BookContent params={props.params} />
    </Suspense>
  )
}
