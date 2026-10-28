'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getMyShelfState } from '@/app/actions/shelf'
import type { ShelfState } from '@/lib/shelf'
import { ShelfControls } from './ShelfControls'
import { clearUserHint, useUserHint } from './useUserHint'

// Loads the reader's shelf in the browser so the book page itself stays static. Signed-out
// visitors never call the server here.
export function ShelfPanel({ bookId }: { bookId: string }) {
  const user = useUserHint()
  const username = user?.username
  const [state, setState] = useState<ShelfState | 'signed-out' | null>(null)

  useEffect(() => {
    if (!username) return
    let cancelled = false
    getMyShelfState(bookId).then(result => {
      if (cancelled) return
      if (!result) clearUserHint()
      setState(result ?? 'signed-out')
    })
    return () => {
      cancelled = true
    }
  }, [bookId, username])

  if (!user || state === 'signed-out') {
    return (
      <Link
        href={`/signin?next=${encodeURIComponent(`/book/${encodeURIComponent(bookId)}`)}`}
        prefetch={false}
        className='block rounded-lg border border-dashed border-line p-4 text-center text-sm text-mist hover:border-copper hover:text-parchment'
      >
        Sign in to rank this book and add it to your shelf
      </Link>
    )
  }
  if (!state) return <div className='h-40 animate-pulse rounded-lg bg-panel/60' />
  return <ShelfControls bookId={bookId} initial={state} />
}
