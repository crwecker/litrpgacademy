import type { Metadata } from 'next'
import { BookBrowser } from '@/components/BookBrowser'
import { getTopTags } from '@/lib/books'

export const metadata: Metadata = {
  title: 'Browse LitRPG books',
  description: 'Search and filter thousands of LitRPG, GameLit, progression, and cultivation books by tag, rating, and popularity.',
  alternates: { canonical: '/books' },
}

export default async function BooksPage() {
  const topTags = await getTopTags(20)
  return (
    <div className='pt-8'>
      <h1 className='font-serif text-3xl font-bold'>Browse the library</h1>
      <p className='mt-2 max-w-2xl text-mist'>Every book we track, from Royal Road serials to published series.</p>
      <div className='mt-6'>
        <BookBrowser params={{}} suggestedTags={topTags.map(t => t.tag)} />
      </div>
    </div>
  )
}
