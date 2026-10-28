import 'server-only'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { connection } from 'next/server'
import { USER_HINT_COOKIE, encodeUserHint, type UserHint } from './user-hint'

const COOKIE_NAME = 'lrpg_session'
const SESSION_DAYS = 30

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

// The httpOnly session is the only thing trusted for auth. The readable hint cookie just lets
// static pages show the signed-in header in the browser without a server render.
export async function createSession(userId: string, hint: UserHint): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey())
  const options = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  }
  const store = await cookies()
  store.set(COOKIE_NAME, token, { ...options, httpOnly: true })
  store.set(USER_HINT_COOKIE, encodeUserHint(hint), options)
}

export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  // Verifying checks expiry against the clock, which must happen at request time.
  await connection()
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    return payload.sub ?? null
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  store.delete(USER_HINT_COOKIE)
}
