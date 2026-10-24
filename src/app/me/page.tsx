import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'

async function RedirectToProfile(): Promise<null> {
  const user = await getCurrentUser()
  redirect(user ? `/u/${user.username}` : '/signin')
}

export default function MePage() {
  return (
    <Suspense>
      <RedirectToProfile />
    </Suspense>
  )
}
