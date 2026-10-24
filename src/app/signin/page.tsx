import type { Metadata } from 'next'
import { Suspense } from 'react'
import { safeNext } from '@/lib/safe-next'
import { SignInForm } from './SignInForm'

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } }

async function Form({ searchParams }: { searchParams: PageProps<'/signin'>['searchParams'] }) {
  const { next, error } = await searchParams
  return (
    <>
      {error && (
        <p className='mb-4 rounded-md bg-tier-sss/15 p-3 text-sm text-tier-sss'>
          That sign-in link has expired or was already used. Request a new one.
        </p>
      )}
      <SignInForm next={safeNext(Array.isArray(next) ? next[0] : next)} />
    </>
  )
}

export default function SignInPage(props: PageProps<'/signin'>) {
  return (
    <div className='mx-auto max-w-sm py-16'>
      <h1 className='font-serif text-3xl font-bold'>Enter the Academy</h1>
      <p className='mt-2 mb-8 text-mist'>Rank what you read, keep a reading diary, and share your tier list. No password needed.</p>
      <Suspense>
        <Form searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
