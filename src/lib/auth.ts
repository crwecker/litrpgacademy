import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { cache } from 'react'
import { db } from './db'
import { getSessionUserId } from './session'

export interface CurrentUser {
  id: string
  firstName: string
  username: string
}

// Reads the session cookie, so callers must sit behind a <Suspense> boundary.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const userId = await getSessionUserId()
  if (!userId) return null
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, username: true },
  })
  if (!user) return null
  return { id: user.id, firstName: user.firstName, username: user.username ?? (await assignUsername(user.id, user.firstName)) }
})

export function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'reader'
}

async function assignUsername(userId: string, firstName: string): Promise<string> {
  const username = `${slugifyName(firstName)}-${userId.slice(-4)}`
  await db.user.update({ where: { id: userId }, data: { username } })
  return username
}

const MAGIC_LINK_MINUTES = 15

// Only the hash is stored, so a database leak can't be replayed as sign-in links.
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createMagicLink(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  await db.magicLink.create({
    data: { token: hashToken(token), userId, expiresAt: new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000) },
  })
  return token
}

// Marks the link used and returns its user, or null if it's unknown, used, or expired.
export async function consumeMagicLink(token: string): Promise<string | null> {
  const { count } = await db.magicLink.updateMany({
    where: { token: hashToken(token), usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  })
  if (count !== 1) return null
  const link = await db.magicLink.findUnique({ where: { token: hashToken(token) }, select: { userId: true } })
  return link?.userId ?? null
}

export async function sendMagicLinkEmail(email: string, url: string, isNewUser: boolean): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  const action = isNewUser ? 'Join the Academy' : 'Sign in'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL ?? 'LitRPG Academy <onboarding@resend.dev>',
      to: [email],
      subject: isNewUser ? 'Welcome to LitRPG Academy' : 'Your LitRPG Academy sign-in link',
      text: `${action}: ${url}\n\nThis link expires in ${MAGIC_LINK_MINUTES} minutes. If you didn't ask for it, ignore this email.`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a2333">
        <h1 style="font-size:22px">${isNewUser ? 'Welcome to LitRPG Academy' : 'Welcome back'}</h1>
        <p>Click below to ${isNewUser ? 'finish creating your account' : 'sign in'}. The link expires in ${MAGIC_LINK_MINUTES} minutes.</p>
        <p style="margin:28px 0"><a href="${url}" style="background:#c98c4f;color:#030e2f;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600">${action}</a></p>
        <p style="font-size:13px;color:#6f7a9a">Or paste this link into your browser:<br>${url}</p>
      </div>`,
    }),
  })
  if (!response.ok) throw new Error(`Resend returned ${response.status}`)
}
