import Link from 'next/link'
import { PAGE_SIZE, SORTS, searchBooks, type BookQuery, type SortKey } from '@/lib/books'
import { BookGrid } from './BookCard'

export interface BrowseParams {
  q?: string
  tag?: string[]
  sort?: SortKey
  page?: number
}

type SearchParamValue = string | string[] | undefined

export function parseBrowseParams(raw: Record<string, SearchParamValue>): BrowseParams {
  const first = (value: SearchParamValue) => (Array.isArray(value) ? value[0] : value)
  const sort = first(raw.sort)
  const page = Number(first(raw.page))
  const tag = raw.tag === undefined ? [] : Array.isArray(raw.tag) ? raw.tag : [raw.tag]
  return {
    q: first(raw.q)?.slice(0, 100) || undefined,
    tag: tag.slice(0, 5),
    sort: sort && sort in SORTS ? (sort as SortKey) : undefined,
    page: Number.isInteger(page) && page > 1 ? Math.min(page, 400) : undefined,
  }
}

function browseHref(basePath: string, params: BrowseParams): string {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  for (const tag of params.tag ?? []) search.append('tag', tag)
  if (params.sort) search.set('sort', params.sort)
  if (params.page && params.page > 1) search.set('page', String(params.page))
  const query = search.toString()
  return query ? `${basePath}?${query}` : basePath
}

interface BookBrowserProps {
  basePath: string
  params: BrowseParams
  anyTags?: string[]
  suggestedTags: string[]
}

export async function BookBrowser({ basePath, params, anyTags, suggestedTags }: BookBrowserProps) {
  const query: BookQuery = {
    q: params.q,
    tags: params.tag,
    anyTags,
    sort: params.sort,
    page: params.page,
  }
  const { books, total } = await searchBooks(query)
  const page = params.page ?? 1
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const activeSort = params.sort ?? 'popular'
  const activeTags = params.tag ?? []

  return (
    <div>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='mr-1 text-sm text-dim'>Sort</span>
        {(Object.keys(SORTS) as SortKey[]).map(sort => (
          <Link
            key={sort}
            href={browseHref(basePath, { ...params, sort, page: undefined })}
            className={`rounded-full px-3 py-1 text-sm ${
              sort === activeSort ? 'bg-copper text-night' : 'bg-panel text-mist hover:text-parchment'
            }`}
          >
            {SORTS[sort]}
          </Link>
        ))}
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-2'>
        <span className='mr-1 text-sm text-dim'>Tags</span>
        {activeTags.map(tag => (
          <Link
            key={tag}
            href={browseHref(basePath, { ...params, tag: activeTags.filter(t => t !== tag), page: undefined })}
            className='rounded-full border border-copper bg-copper/15 px-3 py-1 text-sm text-copper-hi'
            aria-label={`Remove tag ${tag}`}
          >
            {tag} ×
          </Link>
        ))}
        {suggestedTags
          .filter(tag => !activeTags.includes(tag))
          .map(tag => (
            <Link
              key={tag}
              href={browseHref(basePath, { ...params, tag: [...activeTags, tag], page: undefined })}
              className='rounded-full border border-line px-3 py-1 text-sm text-mist hover:border-copper hover:text-parchment'
            >
              {tag}
            </Link>
          ))}
      </div>

      <p className='mt-6 mb-4 text-sm text-dim'>
        {total.toLocaleString()} {total === 1 ? 'book' : 'books'}
        {params.q && (
          <>
            {' '}
            matching “<span className='text-parchment'>{params.q}</span>”
          </>
        )}
      </p>

      {books.length ? (
        <BookGrid books={books} />
      ) : (
        <p className='rounded-lg border border-line bg-panel/50 p-8 text-center text-mist'>
          No books match. Try removing a tag or searching for something else.
        </p>
      )}

      {pageCount > 1 && (
        <nav className='mt-10 flex items-center justify-center gap-3 text-sm' aria-label='Pagination'>
          {page > 1 && (
            <Link href={browseHref(basePath, { ...params, page: page - 1 })} className='rounded-md bg-panel px-4 py-2 hover:bg-panel-hi'>
              ← Previous
            </Link>
          )}
          <span className='text-dim'>
            Page {page} of {pageCount}
          </span>
          {page < pageCount && (
            <Link href={browseHref(basePath, { ...params, page: page + 1 })} className='rounded-md bg-panel px-4 py-2 hover:bg-panel-hi'>
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}

export function BookGridSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6' aria-hidden>
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index}>
          <div className='aspect-[2/3] animate-pulse rounded-md bg-panel' />
          <div className='mt-2 h-3 w-3/4 animate-pulse rounded bg-panel' />
          <div className='mt-1 h-3 w-1/2 animate-pulse rounded bg-panel' />
        </div>
      ))}
    </div>
  )
}
