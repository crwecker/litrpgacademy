import Link from 'next/link'
import { REALMS } from '@/lib/realms'
import { WRITINATOR_URL } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className='border-t border-line/70 bg-ink/60'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-mist sm:grid-cols-3 sm:px-6'>
        <div>
          <p className='font-serif text-base font-bold text-parchment'>LitRPG Academy</p>
          <p className='mt-2'>Read. Rank. Level up. A home for finding your next LitRPG, progression, and cultivation read.</p>
        </div>
        <div>
          <p className='font-semibold text-parchment'>Realms</p>
          <ul className='mt-2 space-y-1'>
            {REALMS.map(realm => (
              <li key={realm.slug}>
                <Link href={`/realm/${realm.slug}`} className='hover:text-parchment'>
                  {realm.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className='font-semibold text-parchment'>Writing LitRPG?</p>
          <p className='mt-2'>
            <a href={WRITINATOR_URL} className='text-copper hover:text-copper-hi' target='_blank' rel='noopener'>
              Writinator
            </a>{' '}
            is the editor I&apos;m building while writing my own LitRPG. Come write with it.
          </p>
        </div>
      </div>
      <div className='mx-auto max-w-7xl space-y-1 px-4 pb-8 text-xs text-dim sm:px-6'>
        <p>Web serial data and covers courtesy of Royal Road. Stats may lag behind the source.</p>
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
      </div>
    </footer>
  )
}
