import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='mx-auto max-w-md py-24 text-center'>
      <p className='font-serif text-5xl font-bold text-copper'>404</p>
      <h1 className='mt-3 font-serif text-2xl font-bold'>This dungeon floor doesn&apos;t exist</h1>
      <p className='mt-2 text-mist'>The page you were looking for wandered off the map.</p>
      <Link href='/books' className='mt-6 inline-block rounded-md bg-copper px-5 py-2.5 font-semibold text-night hover:bg-copper-hi'>
        Browse books
      </Link>
    </div>
  )
}
