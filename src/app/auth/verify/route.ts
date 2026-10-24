import { type NextRequest, NextResponse } from 'next/server'
import { consumeMagicLink } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { safeNext } from '@/lib/safe-next'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const userId = token ? await consumeMagicLink(token) : null
  if (!userId) return NextResponse.redirect(new URL('/signin?error=expired', request.url))

  await createSession(userId)
  return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get('next')), request.url))
}
