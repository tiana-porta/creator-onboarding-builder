'use client'

// Mark as dynamic
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/onboarding/GlassCard'

interface OnboardingRecord {
  userId: string
  email?: string
  step: number
  xp: number
  selectedClass: 'architect' | 'sensei' | 'builder' | null
  storeUrl: string | null
  storeVerified: boolean
  startedAt: string
  completedAt: string | null
}

interface LeaderboardData {
  totalStarted: number
  totalCompleted: number
  completionRate: number
  averageXP: number
  users: OnboardingRecord[]
}

export default function AdminLeaderboardPage() {
  const router = useRouter()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      // Note: In production, implement proper authentication
      // For now, this is a simple implementation
      // You'll need to pass the admin API key through a secure method
      const response = await fetch('/api/admin/leaderboard')

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized - Admin access required')
          router.push('/')
          return
        }
        throw new Error('Failed to fetch leaderboard')
      }

      const result = await response.json()
      setData(result.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      setError(err.message || 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getClassLabel = (classType: string | null) => {
    if (!classType) return '—'
    return classType === 'architect' ? 'The Architect'
      : classType === 'sensei' ? 'The Sensei'
      : classType === 'builder' ? 'The Builder'
      : classType
  }

  const formatDuration = (startedAt: string, completedAt: string | null) => {
    if (!completedAt) return 'In Progress'
    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getUserName = (user: OnboardingRecord) => {
    // Use email as username if available, otherwise format userId
    if (user.email) {
      return user.email.split('@')[0] // Get username part of email
    }
    // Format userId to be more readable
    return user.userId.replace(/^user_/, '').substring(0, 15)
  }

  const ProgressBar = ({ step, completed }: { step: number; completed: boolean }) => {
    const totalSteps = 6
    const completedSteps = completed ? totalSteps : step - 1
    const currentStep = completed ? null : step
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1
          const isCompleted = stepNumber <= completedSteps
          const isCurrent = stepNumber === currentStep
          
          return (
            <div
              key={stepNumber}
              className={`
                h-2 flex-1 rounded-full transition-all
                ${isCompleted 
                  ? 'bg-accent' 
                  : isCurrent 
                  ? 'bg-accent/60' 
                  : 'bg-primary/20'
                }
              `}
              title={`Step ${stepNumber}${isCompleted ? ' (Completed)' : isCurrent ? ' (Current)' : ' (Not started)'}`}
            />
          )
        })}
        <span className="ml-2 text-sm text-primary/70 min-w-[3rem]">
          {step}/6
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-12 px-4 flex items-center justify-center">
        <div className="text-primary text-xl">Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark py-12 px-4 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-dark py-12 px-4 flex items-center justify-center">
        <div className="text-primary text-xl">No data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4 relative overflow-hidden">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Admin <span className="text-accent">Leaderboard</span>
          </h1>
          <p className="text-xl text-primary/70">
            Onboarding statistics and user progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="text-center">
              <p className="text-sm text-primary/60 mb-2">Total Started</p>
              <p className="text-3xl font-bold text-primary">{data.totalStarted}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm text-primary/60 mb-2">Completed</p>
              <p className="text-3xl font-bold text-accent">{data.totalCompleted}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm text-primary/60 mb-2">Completion Rate</p>
              <p className="text-3xl font-bold text-primary">{data.completionRate.toFixed(1)}%</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm text-primary/60 mb-2">Average XP</p>
              <p className="text-3xl font-bold text-accent">{Math.round(data.averageXP)}</p>
            </div>
          </GlassCard>
        </div>

        {/* Leaderboard Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-primary font-semibold">User</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Progress</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">XP</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Class</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Store</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Duration</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user, index) => (
                  <tr
                    key={user.userId}
                    className={`border-b border-primary/10 ${
                      user.completedAt ? 'bg-accent/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-primary">
                      <div>
                        <div className="font-medium">
                          {getUserName(user)}
                        </div>
                        <div className="text-sm text-primary/60 font-mono">
                          {user.userId}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.completedAt ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary/70">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <ProgressBar step={user.step} completed={!!user.completedAt} />
                    </td>
                    <td className="py-4 px-4 text-accent font-bold">{user.xp}</td>
                    <td className="py-4 px-4 text-primary">{getClassLabel(user.selectedClass)}</td>
                    <td className="py-4 px-4">
                      {user.storeVerified ? (
                        <span className="text-accent">✓ Verified</span>
                      ) : (
                        <span className="text-primary/40">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-primary text-sm">
                      {formatDuration(user.startedAt, user.completedAt)}
                    </td>
                    <td className="py-4 px-4 text-primary text-sm">
                      {user.completedAt ? formatDate(user.completedAt) : '—'}
                    </td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-primary/60">
                      No users have started onboarding yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

