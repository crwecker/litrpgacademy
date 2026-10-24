'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createMagicLink, sendMagicLinkEmail, slugifyName } from '@/lib/auth'
import { db } from '@/lib/db'
import { safeNext } from '@/lib/safe-next'
import { deleteSession } from '@/lib/session'

export type SignInState =
  | { step: 'email'; error?: string }
  | { step: 'name'; email: string; error?: string }
  | { step: 'sent'; email: string; devLink?: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function requestSignIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const firstName = String(formData.get('firstName') ?? '').trim().slice(0, 40)
  const next = safeNext(formData.get('next'))
  if (!EMAIL_PATTERN.test(email)) return { step: 'email', error: 'Enter a valid email address.' }

  let user = await db.user.findUnique({ where: { email }, select: { id: true } })
  const isNewUser = !user
  if (!user) {
    if (!firstName) return { step: 'name', email }
    const suffix = Math.random().toString(36).slice(2, 6)
    user = await db.user.create({
      data: { email, firstName, lastName: '', username: `${slugifyName(firstName)}-${suffix}` },
      select: { id: true },
    })
  }

  const recent = await db.magicLink.count({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
  })
  if (recent >= 3) return { step: 'email', error: 'Too many sign-in links. Check your inbox or try again in a few minutes.' }

  const token = await createMagicLink(user.id)
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  const proto = requestHeaders.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
  const url = `${proto}://${host}/auth/verify?token=${token}&next=${encodeURIComponent(next)}`

  // Local development shows the link on the page instead of sending real email.
  if (process.env.NODE_ENV !== 'production') return { step: 'sent', email, devLink: url }

  try {
    await sendMagicLinkEmail(email, url, isNewUser)
  } catch (error) {
    console.error('Failed to send sign-in email', error)
    return { step: 'email', error: "We couldn't send the email. Try again in a minute." }
  }
  return { step: 'sent', email }
}

export async function signOut(): Promise<void> {
  await deleteSession()
  redirect('/')
}
