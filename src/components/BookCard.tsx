import Link from 'next/link'
import type { BookSummary } from '@/lib/books'
import { formatCount, formatRating } from '@/lib/site'
import { BookCover } from './BookCover'

const CARD_SIZES = '(min-width: 1280px) 180px, (min-width: 640px) 22vw, 45vw'

export function BookCard({ book, priority }: { book: BookSummary; priority?: boolean }) {
  return (
    <Link href={`/book/${encodeURIComponent(book.id)}`} className='group block'>
      <div className='transition-transform duration-200 group-hover:-translate-y-1'>
        <BookCover title={book.title} coverUrl={book.coverUrl} sizes={CARD_SIZES} priority={priority} />
      </div>
      <p className='mt-2 line-clamp-2 text-sm leading-snug font-semibold group-hover:text-copper-hi'>{book.title}</p>
      <p className='truncate text-xs text-mist'>{book.authorName}</p>
      {book.source === 'ROYAL_ROAD' && book.followers != null && (
        <p className='mt-1 flex flex-wrap gap-x-3 text-xs whitespace-nowrap text-dim'>
          <span title='Royal Road rating'>★ {formatRating(book.rating)}</span>
          <span title='Royal Road followers'>{formatCount(book.followers)} followers</span>
        </p>
      )}
    </Link>
  )
}

export function BookGrid({ books }: { books: BookSummary[] }) {
  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6'>
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} priority={index < 6} />
      ))}
    </div>
  )
}

export function BookShelf({ title, href, books }: { title: string; href?: string; books: BookSummary[] }) {
  if (!books.length) return null
  return (
    <section className='mt-12'>
      <div className='mb-4 flex items-baseline justify-between'>
        <h2 className='font-serif text-xl font-bold'>{title}</h2>
        {href && (
          <Link href={href} prefetch={href.startsWith('/search') ? false : undefined} className='text-sm text-copper hover:text-copper-hi'>
            See all →
          </Link>
        )}
      </div>
      <div className='no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2'>
        {books.map(book => (
          <div key={book.id} className='w-32 shrink-0 snap-start sm:w-40'>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
