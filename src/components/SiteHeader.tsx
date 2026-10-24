import Image from 'next/image'
import Link from 'next/link'
import { REALMS } from '@/lib/realms'
import { WRITINATOR_URL } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-30 border-b border-line/70 bg-night/85 backdrop-blur'>
      <div className='mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6'>
        <Link href='/' className='flex shrink-0 items-center gap-2'>
          <Image src='/images/litrpgacademy.png' alt='' width={36} height={36} className='rounded-md' priority />
          <span className='font-serif text-lg font-bold tracking-tight max-sm:hidden'>LitRPG Academy</span>
        </Link>

        <nav className='flex items-center gap-1 text-sm text-mist max-md:hidden'>
          <Link href='/books' className='rounded-md px-3 py-1.5 hover:bg-panel hover:text-parchment'>
            Browse
          </Link>
          {REALMS.map(realm => (
            <Link
              key={realm.slug}
              href={`/realm/${realm.slug}`}
              className='rounded-md px-3 py-1.5 hover:bg-panel hover:text-parchment'
            >
              {realm.name}
            </Link>
          ))}
        </nav>

        <form action='/books' className='ml-auto w-full max-w-xs'>
          <label className='sr-only' htmlFor='site-search'>
            Search books
          </label>
          <input
            id='site-search'
            name='q'
            type='search'
            placeholder='Search titles or authors'
            className='w-full rounded-md border border-line bg-ink px-3 py-1.5 text-sm placeholder:text-dim focus:border-copper focus:outline-none'
          />
        </form>

        <a
          href={WRITINATOR_URL}
          className='shrink-0 text-sm text-copper hover:text-copper-hi max-lg:hidden'
          target='_blank'
          rel='noopener'
        >
          Write LitRPG ↗
        </a>
      </div>
      <nav className='no-scrollbar flex gap-1 overflow-x-auto px-4 pb-2 text-sm text-mist md:hidden'>
        <Link href='/books' className='shrink-0 rounded-md bg-panel px-3 py-1'>
          Browse
        </Link>
        {REALMS.map(realm => (
          <Link key={realm.slug} href={`/realm/${realm.slug}`} className='shrink-0 rounded-md bg-panel px-3 py-1'>
            {realm.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
