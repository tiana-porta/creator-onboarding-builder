'use client'

// This route matches Whop's expected /dashboard/[companyId] pattern
// It redirects to the admin leaderboard for now
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin leaderboard
    // In the future, you can add company-specific dashboard logic here
    router.push('/admin/leaderboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-primary">Redirecting...</div>
    </div>
  )
}

