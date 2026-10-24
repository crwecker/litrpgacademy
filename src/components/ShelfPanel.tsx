import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getShelfState } from '@/lib/shelf'
import { ShelfControls } from './ShelfControls'

// Reads the session, so render it inside <Suspense>.
export async function ShelfPanel({ bookId }: { bookId: string }) {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <Link
        href={`/signin?next=${encodeURIComponent(`/book/${encodeURIComponent(bookId)}`)}`}
        className='block rounded-lg border border-dashed border-line p-4 text-center text-sm text-mist hover:border-copper hover:text-parchment'
      >
        Sign in to rank this book and add it to your shelf
      </Link>
    )
  }
  const state = await getShelfState(user.id, bookId)
  return <ShelfControls bookId={bookId} initial={state} />
}
