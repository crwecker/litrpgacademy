'use client'

import { useActionState } from 'react'
import { requestSignIn, type SignInState } from './actions'

const inputClass =
  'w-full rounded-md border border-line bg-ink px-3 py-2.5 placeholder:text-dim focus:border-copper focus:outline-none'
const buttonClass =
  'w-full rounded-md bg-copper px-4 py-2.5 font-semibold text-night hover:bg-copper-hi disabled:opacity-60'

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(requestSignIn, { step: 'email' })

  if (state.step === 'sent') {
    return (
      <div className='space-y-3'>
        <p>
          Check <span className='font-semibold'>{state.email}</span> for a sign-in link. It expires in 15 minutes.
        </p>
        {state.devLink && (
          <p className='rounded-md border border-dashed border-copper p-3 text-sm'>
            Development only:{' '}
            <a href={state.devLink} className='break-all text-copper-hi underline'>
              open the sign-in link
            </a>
          </p>
        )}
      </div>
    )
  }

  return (
    <form action={action} className='space-y-4'>
      <input type='hidden' name='next' value={next} />
      <div>
        <label htmlFor='email' className='mb-1 block text-sm text-mist'>
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          required
          autoComplete='email'
          defaultValue={state.step === 'name' ? state.email : undefined}
          readOnly={state.step === 'name'}
          className={inputClass}
        />
      </div>
      {state.step === 'name' && (
        <div>
          <label htmlFor='firstName' className='mb-1 block text-sm text-mist'>
            New here! What should we call you?
          </label>
          <input id='firstName' name='firstName' required autoFocus autoComplete='given-name' className={inputClass} />
        </div>
      )}
      {state.error && <p className='text-sm text-tier-sss'>{state.error}</p>}
      <button type='submit' disabled={pending} className={buttonClass}>
        {pending ? 'Sending…' : state.step === 'name' ? 'Create account' : 'Email me a sign-in link'}
      </button>
    </form>
  )
}
