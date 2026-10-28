'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { TIERS, type Tier } from '@/lib/books'
import { db } from '@/lib/db'
import { getSessionUserId } from '@/lib/session'
import { getShelfState, TIER_LIMITS, type ShelfState } from '@/lib/shelf'
import type { ReadingStatus } from '@/generated/prisma/client'

export type ShelfResult = { ok: true } | { ok: false; error: string }

const STATUSES: ReadingStatus[] = ['WANT_TO_READ', 'READING', 'FINISHED']

// Null when the session is missing or expired.
export async function getMyShelfState(bookId: string): Promise<ShelfState | null> {
  const userId = await getSessionUserId()
  return userId ? getShelfState(userId, bookId) : null
}

async function requireUser(): Promise<string> {
  const userId = await getSessionUserId()
  if (!userId) throw new Error('Not signed in')
  return userId
}

function refresh(userId: string, bookId: string) {
  updateTag(`user:${userId}`)
  updateTag(`book:${bookId}`)
}

function today(): Date {
  return new Date(new Date().toISOString().slice(0, 10))
}

// One diary entry per book per day: same-day changes update it instead of stacking up.
async function logReading(userId: string, bookId: string, status: ReadingStatus, tier: Tier | null) {
  const loggedOn = today()
  const existing = await db.readingLog.findFirst({ where: { userId, bookId, loggedOn }, select: { id: true } })
  if (existing) await db.readingLog.update({ where: { id: existing.id }, data: { status, tier } })
  else await db.readingLog.create({ data: { userId, bookId, status, tier, loggedOn } })
}

export async function setReadingStatus(bookId: string, status: ReadingStatus | null): Promise<ShelfResult> {
  const userId = await requireUser()
  if (status !== null && !STATUSES.includes(status)) return { ok: false, error: 'Unknown status.' }

  const key = { userId_bookId: { userId, bookId } }
  if (status === null) {
    await db.bookTier.deleteMany({ where: { userId, bookId } })
  } else {
    const existing = await db.bookTier.findUnique({ where: key, select: { readingStatus: true, tier: true } })
    // Want-to-read books aren't ranked yet, so moving there clears the tier.
    const tier = status === 'WANT_TO_READ' ? null : (existing?.tier ?? null)
    await db.bookTier.upsert({
      where: key,
      create: { userId, bookId, readingStatus: status, tier },
      update: { readingStatus: status, tier },
    })
    if (existing?.readingStatus !== status && status !== 'WANT_TO_READ') {
      await logReading(userId, bookId, status, tier)
    }
  }
  refresh(userId, bookId)
  return { ok: true }
}

export async function setTier(bookId: string, tier: Tier | null): Promise<ShelfResult> {
  const userId = await requireUser()
  if (tier !== null && !TIERS.includes(tier)) return { ok: false, error: 'Unknown tier.' }

  const key = { userId_bookId: { userId, bookId } }
  const existing = await db.bookTier.findUnique({ where: key, select: { readingStatus: true, tier: true } })
  if (existing?.tier === tier) return { ok: true }

  const limit = tier ? TIER_LIMITS[tier] : undefined
  if (tier && limit) {
    const used = await db.bookTier.count({ where: { userId, tier } })
    if (used >= limit) {
      return { ok: false, error: `${tier} holds ${limit} ${limit === 1 ? 'book' : 'books'}. Move one out on your tier list first.` }
    }
  }

  // Ranking a book you haven't started implies you've read it.
  const status = !existing || existing.readingStatus === 'WANT_TO_READ' ? 'FINISHED' : existing.readingStatus
  await db.bookTier.upsert({
    where: key,
    create: { userId, bookId, tier, readingStatus: status },
    update: { tier, readingStatus: status },
  })
  if (tier) await logReading(userId, bookId, status, tier)
  refresh(userId, bookId)
  // Community-ranked lists refresh in the background rather than on every ranking.
  revalidateTag('community', 'max')
  return { ok: true }
}

export async function saveReview(bookId: string, text: string): Promise<ShelfResult> {
  const userId = await requireUser()
  const review = text.trim()
  if (review.length > 5000) return { ok: false, error: 'Reviews are limited to 5,000 characters.' }

  if (review) {
    await db.bookReview.upsert({
      where: { userId_bookId: { userId, bookId } },
      create: { userId, bookId, review },
      update: { review },
    })
  } else {
    await db.bookReview.deleteMany({ where: { userId, bookId } })
  }
  refresh(userId, bookId)
  return { ok: true }
}
