import { redirect } from 'next/navigation'

// Mark as dynamic
export const dynamic = 'force-dynamic'

export default function Home() {
  redirect('/onboarding')
}
