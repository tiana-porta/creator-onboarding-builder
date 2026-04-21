'use client'

// Mark as dynamic
export const dynamic = 'force-dynamic'

// This route matches Whop's expected /experiences/[experienceId] pattern
// It redirects to the admin onboarding page, same as /onboarding
import { redirect } from 'next/navigation'

export default function ExperiencePage() {
  // Redirect to admin onboarding
  redirect('/admin/onboarding')
}
