import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BookBrowser } from '@/components/BookBrowser'
import { REALMS, getRealm } from '@/lib/realms'

export function generateStaticParams() {
  return REALMS.map(realm => ({ realmId: realm.slug }))
}

export async function generateMetadata({ params }: PageProps<'/realm/[realmId]'>): Promise<Metadata> {
  const realm = getRealm((await params).realmId)
  if (!realm) return {}
  return {
    title: `${realm.name} books`,
    description: realm.blurb,
    alternates: { canonical: `/realm/${realm.slug}` },
    openGraph: { images: [{ url: realm.image, width: 1024, height: 1024 }] },
  }
}

export default async function RealmPage(props: PageProps<'/realm/[realmId]'>) {
  const { realmId } = await props.params
  const realm = getRealm(realmId)
  if (!realm) notFound()

  return (
    <div>
      <section
        className='mt-6 overflow-hidden rounded-2xl border border-line'
        style={{ background: `linear-gradient(120deg, ${realm.primary}, #030e2f 75%)` }}
      >
        <div className='flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8'>
          <Image
            src={realm.image}
            alt={`${realm.name} realm`}
            width={220}
            height={220}
            priority
            className='rounded-xl shadow-2xl ring-2'
            style={{ ['--tw-ring-color' as string]: realm.accent }}
          />
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold tracking-widest uppercase' style={{ color: realm.accent }}>
              {realm.tagline}
            </p>
            <h1 className='mt-1 font-serif text-4xl font-bold'>{realm.name}</h1>
            <p className='mt-3 text-mist'>{realm.blurb}</p>
            <p className='mt-4 text-sm text-dim'>
              <span className='font-semibold' style={{ color: realm.accent }}>
                Realm boss: {realm.boss}.
              </span>{' '}
              {realm.bossLore}
            </p>
          </div>
        </div>
      </section>
      <div className='mt-8'>
        <BookBrowser params={{ realm: realm.slug }} suggestedTags={realm.tags} />
      </div>
    </div>
  )
}
