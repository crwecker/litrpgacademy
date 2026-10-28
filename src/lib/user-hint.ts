// Display-only info about the signed-in user, stored in a readable cookie. Never used for auth.
export const USER_HINT_COOKIE = 'lrpg_user'

export interface UserHint {
  firstName: string
  username: string
}

// base64url JSON: cookie-safe as-is, so nothing re-encodes it along the way.
export function encodeUserHint(hint: UserHint): string {
  const bytes = new TextEncoder().encode(JSON.stringify(hint))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeUserHint(value: string | undefined): UserHint | null {
  if (!value) return null
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const parsed = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0))))
    return typeof parsed?.firstName === 'string' && typeof parsed?.username === 'string' ? parsed : null
  } catch {
    return null
  }
}
