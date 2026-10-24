'use client'

import { useState, useTransition } from 'react'
import { saveReview, setReadingStatus, setTier, type ShelfResult } from '@/app/actions/shelf'
import type { Tier } from '@/lib/books'
import type { ShelfState } from '@/lib/shelf'
import type { ReadingStatus } from '@/generated/prisma/browser'

const TIERS: Tier[] = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F']
const STATUSES: { value: ReadingStatus; label: string }[] = [
  { value: 'WANT_TO_READ', label: 'Want to read' },
  { value: 'READING', label: 'Reading' },
  { value: 'FINISHED', label: 'Finished' },
]

export function ShelfControls({ bookId, initial }: { bookId: string; initial: ShelfState }) {
  const [state, setState] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [reviewDraft, setReviewDraft] = useState(initial.review ?? '')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function run(optimistic: ShelfState, action: () => Promise<ShelfResult>) {
    const previous = state
    setState(optimistic)
    setError(null)
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        setState(previous)
        setError(result.error)
      }
    })
  }

  function chooseStatus(status: ReadingStatus) {
    const next = state.status === status ? null : status
    const tier = next === null || next === 'WANT_TO_READ' ? null : state.tier
    run({ ...state, status: next, tier }, () => setReadingStatus(bookId, next))
  }

  function chooseTier(tier: Tier) {
    const next = state.tier === tier ? null : tier
    const status = next && (!state.status || state.status === 'WANT_TO_READ') ? 'FINISHED' : state.status
    run({ ...state, tier: next, status }, () => setTier(bookId, next))
  }

  function submitReview() {
    const text = reviewDraft.trim()
    run({ ...state, review: text || null }, () => saveReview(bookId, text))
    setReviewOpen(false)
  }

  return (
    <div className='space-y-4 rounded-lg border border-line bg-panel/60 p-4' aria-busy={pending}>
      <div className='grid grid-cols-3 gap-1.5'>
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            type='button'
            onClick={() => chooseStatus(value)}
            aria-pressed={state.status === value}
            className={`rounded-md px-2 py-1.5 text-xs font-semibold ${
              state.status === value ? 'bg-copper text-night' : 'bg-ink text-mist hover:text-parchment'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <p className='mb-1.5 text-xs tracking-wide text-dim uppercase'>Your tier</p>
        <div className='grid grid-cols-9 gap-1'>
          {TIERS.map(tier => (
            <button
              key={tier}
              type='button'
              onClick={() => chooseTier(tier)}
              aria-pressed={state.tier === tier}
              title={`Rank ${tier}`}
              className={`rounded py-1 text-[11px] font-bold ${
                state.tier === tier ? 'bg-copper text-night ring-2 ring-copper-hi' : 'bg-ink text-mist hover:text-parchment'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {reviewOpen ? (
        <div className='space-y-2'>
          <textarea
            value={reviewDraft}
            onChange={event => setReviewDraft(event.target.value)}
            rows={5}
            maxLength={5000}
            placeholder='What did you think?'
            className='w-full rounded-md border border-line bg-ink p-2 text-sm placeholder:text-dim focus:border-copper focus:outline-none'
          />
          <div className='flex gap-2'>
            <button type='button' onClick={submitReview} className='rounded-md bg-copper px-3 py-1.5 text-sm font-semibold text-night'>
              Save review
            </button>
            <button type='button' onClick={() => setReviewOpen(false)} className='px-3 py-1.5 text-sm text-mist'>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type='button' onClick={() => setReviewOpen(true)} className='text-sm text-copper hover:text-copper-hi'>
          {state.review ? 'Edit your review' : 'Write a review'}
        </button>
      )}

      {error && <p className='text-sm text-tier-sss'>{error}</p>}
    </div>
  )
}
