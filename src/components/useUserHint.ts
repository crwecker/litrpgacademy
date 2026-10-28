'use client'

import { useSyncExternalStore } from 'react'
import { USER_HINT_COOKIE, decodeUserHint, type UserHint } from '@/lib/user-hint'

function readCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find(part => part.startsWith(`${USER_HINT_COOKIE}=`))
    ?.slice(USER_HINT_COOKIE.length + 1)
}

// Cookies have no change event; sign-in and sign-out navigate, which re-reads it.
const subscribe = () => () => {}

// Returns null during prerender and for signed-out visitors, so pages stay fully static.
export function useUserHint(): UserHint | null {
  const raw = useSyncExternalStore(subscribe, readCookie, () => undefined)
  return decodeUserHint(raw)
}

export function clearUserHint() {
  document.cookie = `${USER_HINT_COOKIE}=; path=/; max-age=0`
}
