'use client'

// Mark as dynamic
export const dynamic = 'force-dynamic'

// This route matches Whop's expected /experiences/[experienceId] pattern
// It renders the same onboarding flow as /onboarding
// We use a client component wrapper since the onboarding page is a client component
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingPage from '@/app/onboarding/page'

export default function ExperiencePage() {
  // The experienceId is available in the URL but we don't need it for the onboarding flow
  // This route just renders the same onboarding component
  
  return <OnboardingPage />
}
