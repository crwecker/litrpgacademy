import Image from 'next/image'
import Link from 'next/link'
import { BookShelf } from '@/components/BookCard'
import { getCommunityFavorites, searchBooks } from '@/lib/books'
import { REALMS } from '@/lib/realms'
import { WRITINATOR_URL } from '@/lib/site'

export default async function HomePage() {
  const [favorites, popular, topRated, gamelit] = await Promise.all([
    getCommunityFavorites(),
    searchBooks({ sort: 'popular' }),
    searchBooks({ sort: 'rating' }),
    searchBooks({ sort: 'popular', anyTags: ['LitRPG', 'GameLit'] }),
  ])

  return (
    <>
      <section className='mt-6 overflow-hidden rounded-2xl border border-line'>
        <h1 className='sr-only'>LitRPG Academy: read, rank, and level up</h1>
        <Image
          src='/images/banner-wide.png'
          alt='Read. Rank. Level Up. Discover LitRPG stories with the help of your friends.'
          width={3840}
          height={1200}
          sizes='(min-width: 1280px) 1280px, 100vw'
          priority
          className='h-auto w-full'
        />
      </section>

      <section className='mt-10' id='realms'>
        <h2 className='font-serif text-2xl font-bold'>Choose your realm</h2>
        <p className='mt-1 text-mist'>Four corners of the genre, each with its own boss and its own best books.</p>
        <div className='mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {REALMS.map(realm => (
            <Link
              key={realm.slug}
              href={`/realm/${realm.slug}`}
              className='group overflow-hidden rounded-xl border border-line bg-panel/60 transition hover:-translate-y-1 hover:border-copper'
            >
              <Image
                src={realm.image}
                alt=''
                width={512}
                height={512}
                sizes='(min-width: 1024px) 300px, 50vw'
                className='aspect-[4/3] w-full object-cover'
              />
              <div className='p-4'>
                <p className='font-serif text-lg font-bold group-hover:text-copper-hi'>{realm.name}</p>
                <p className='mt-1 text-sm text-mist'>{realm.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BookShelf title='Community favorites' href='/search?sort=community' books={favorites} />
      <BookShelf title='Most followed on Royal Road' href='/books' books={popular.books} />
      <BookShelf title='Top LitRPG & GameLit' href='/realm/gamelit' books={gamelit.books} />
      <BookShelf title='Highest rated' href='/search?sort=rating' books={topRated.books} />

      <section className='mt-16 grid items-center gap-6 overflow-hidden rounded-2xl border border-line bg-panel/60 sm:grid-cols-[1fr_280px]'>
        <div className='p-6 sm:p-8'>
          <p className='text-sm font-semibold tracking-widest text-copper uppercase'>For writers</p>
          <h2 className='mt-1 font-serif text-2xl font-bold'>Writing your own LitRPG?</h2>
          <p className='mt-2 max-w-xl text-mist'>
            Writinator is the editor I&apos;m building while writing my own LitRPG: character stat tracking, a
            storylet tree, writing quests, and export to EPUB, DOCX, and PDF. Free in your browser.
          </p>
          <a
            href={WRITINATOR_URL}
            target='_blank'
            rel='noopener'
            className='mt-4 inline-flex rounded-md bg-copper px-5 py-2.5 font-semibold text-night hover:bg-copper-hi'
          >
            Try Writinator ↗
          </a>
        </div>
        <Image src='/images/library.png' alt='' width={560} height={560} sizes='280px' className='h-full w-full object-cover max-sm:hidden' />
      </section>
    </>
  )
}
