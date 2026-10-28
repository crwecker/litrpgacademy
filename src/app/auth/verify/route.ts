import { type NextRequest, NextResponse } from 'next/server'
import { consumeMagicLink, getUserForSession } from '@/lib/auth'
import { safeNext } from '@/lib/safe-next'
import { createSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const userId = token ? await consumeMagicLink(token) : null
  const user = userId ? await getUserForSession(userId) : null
  if (!user) return NextResponse.redirect(new URL('/signin?error=expired', request.url))

  await createSession(user.id, { firstName: user.firstName, username: user.username })
  return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get('next')), request.url))
}
