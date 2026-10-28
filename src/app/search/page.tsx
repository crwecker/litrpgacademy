import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookBrowser, BookGridSkeleton, parseBrowseParams } from '@/components/BookBrowser'
import { getTopTags } from '@/lib/books'
import { getRealm } from '@/lib/realms'

// Every filter combination is its own URL, so keep this route out of search indexes.
export const metadata: Metadata = {
  title: 'Search books',
  robots: { index: false, follow: false },
}

async function Results({ searchParams }: { searchParams: PageProps<'/search'>['searchParams'] }) {
  const params = parseBrowseParams(await searchParams)
  const realm = params.realm ? getRealm(params.realm) : undefined
  const suggestedTags = realm ? realm.tags : (await getTopTags(20)).map(t => t.tag)
  return (
    <>
      <h1 className='font-serif text-3xl font-bold'>{realm ? `${realm.name} books` : 'Search the library'}</h1>
      <div className='mt-6'>
        <BookBrowser params={params} suggestedTags={suggestedTags} />
      </div>
    </>
  )
}

export default function SearchPage(props: PageProps<'/search'>) {
  return (
    <div className='pt-8'>
      <Suspense fallback={<BookGridSkeleton />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
