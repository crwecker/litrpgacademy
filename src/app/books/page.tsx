import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookBrowser, BookGridSkeleton, parseBrowseParams } from '@/components/BookBrowser'
import { getTopTags } from '@/lib/books'

export const metadata: Metadata = {
  title: 'Browse LitRPG books',
  description: 'Search and filter thousands of LitRPG, GameLit, progression, and cultivation books by tag, rating, and popularity.',
  alternates: { canonical: '/books' },
}

async function Results({ searchParams }: { searchParams: PageProps<'/books'>['searchParams'] }) {
  const [raw, topTags] = await Promise.all([searchParams, getTopTags(20)])
  return <BookBrowser basePath='/books' params={parseBrowseParams(raw)} suggestedTags={topTags.map(t => t.tag)} />
}

export default function BooksPage(props: PageProps<'/books'>) {
  return (
    <div className='pt-8'>
      <h1 className='font-serif text-3xl font-bold'>Browse the library</h1>
      <p className='mt-2 max-w-2xl text-mist'>Every book we track, from Royal Road serials to published series.</p>
      <div className='mt-6'>
        <Suspense fallback={<BookGridSkeleton />}>
          <Results searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
