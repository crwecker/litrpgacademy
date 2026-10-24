import { TIERS, type Tier } from '@/lib/books'

const TIER_COLORS: Record<Tier, string> = {
  SSS: 'bg-tier-sss',
  SS: 'bg-tier-ss',
  S: 'bg-tier-s',
  A: 'bg-tier-a',
  B: 'bg-tier-b',
  C: 'bg-tier-c',
  D: 'bg-tier-d',
  E: 'bg-tier-e',
  F: 'bg-tier-f',
}

// One row per tier with a bar sized to that tier's share of rankings.
export function TierBreakdown({ counts }: { counts: Partial<Record<Tier, number>> }) {
  const max = Math.max(0, ...Object.values(counts))
  return (
    <ul className='mt-3 space-y-1.5'>
      {TIERS.map(tier => {
        const count = counts[tier] ?? 0
        return (
          <li key={tier} className='flex items-center gap-3 text-sm'>
            <span className={`w-10 rounded py-0.5 text-center text-xs font-bold text-night ${TIER_COLORS[tier]}`}>{tier}</span>
            <span className='h-2 flex-1 overflow-hidden rounded-full bg-panel'>
              <span
                className={`block h-full rounded-full ${TIER_COLORS[tier]}`}
                style={{ width: max ? `${(count / max) * 100}%` : '0%' }}
              />
            </span>
            <span className='w-6 text-right text-dim tabular-nums'>{count}</span>
          </li>
        )
      })}
    </ul>
  )
}
