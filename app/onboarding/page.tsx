'use client'

// Mark as dynamic to avoid static generation issues with WhopApp
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

export default function OnboardingPage() {
  // Redirect to admin or show message
  redirect('/admin/onboarding')
}
