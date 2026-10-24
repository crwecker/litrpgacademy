import Link from 'next/link'
import { signOut } from '@/app/signin/actions'
import { getCurrentUser } from '@/lib/auth'

// Reads the session, so render it inside <Suspense>.
export async function UserNav() {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <Link href='/signin' className='shrink-0 rounded-md border border-line px-3 py-1.5 text-sm hover:border-copper'>
        Sign in
      </Link>
    )
  }
  return (
    <div className='flex shrink-0 items-center gap-3 text-sm'>
      <Link href={`/u/${user.username}`} className='font-semibold hover:text-copper-hi'>
        {user.firstName}
      </Link>
      <form action={signOut}>
        <button type='submit' className='text-dim hover:text-parchment'>
          Sign out
        </button>
      </form>
    </div>
  )
}
