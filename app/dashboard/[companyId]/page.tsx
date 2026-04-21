'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function DashboardPage() {
  const params = useParams()
  const companyId = params.companyId as string
  const router = useRouter()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (companyId) {
      fetchLeaderboard()
      const interval = setInterval(fetchLeaderboard, 30000)
      return () => clearInterval(interval)
    }
  }, [companyId])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/leaderboard?whop_id=${companyId}`)

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized - Admin access required')
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
    if (user.email) {
      return user.email.split('@')[0]
    }
    return user.userId.replace(/^user_/, '').substring(0, 15)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl opacity-70">Onboarding statistics and user progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="text-center">
              <p className="text-sm opacity-60 mb-2">Total Started</p>
              <p className="text-3xl font-bold">{data.totalStarted}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm opacity-60 mb-2">Completed</p>
              <p className="text-3xl font-bold text-accent">{data.totalCompleted}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm opacity-60 mb-2">Completion Rate</p>
              <p className="text-3xl font-bold">{data.completionRate.toFixed(1)}%</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <p className="text-sm opacity-60 mb-2">Average XP</p>
              <p className="text-3xl font-bold text-accent">{Math.round(data.averageXP)}</p>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-a4">
                  <th className="text-left py-4 px-4 font-semibold">User</th>
                  <th className="text-left py-4 px-4 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 font-semibold">XP</th>
                  <th className="text-left py-4 px-4 font-semibold">Class</th>
                  <th className="text-left py-4 px-4 font-semibold">Store</th>
                  <th className="text-left py-4 px-4 font-semibold">Duration</th>
                  <th className="text-left py-4 px-4 font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.userId} className="border-b border-gray-a2">
                    <td className="py-4 px-4">
                      <div className="font-medium">{getUserName(user)}</div>
                      <div className="text-sm opacity-60 font-mono">{user.userId}</div>
                    </td>
                    <td className="py-4 px-4">
                      {user.completedAt ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-a3">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-accent font-bold">{user.xp}</td>
                    <td className="py-4 px-4">{getClassLabel(user.selectedClass)}</td>
                    <td className="py-4 px-4">
                      {user.storeVerified ? (
                        <span className="text-accent">✓ Verified</span>
                      ) : (
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {formatDuration(user.startedAt, user.completedAt)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {user.completedAt ? formatDate(user.completedAt) : '—'}
                    </td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center opacity-60">
                      No users have started onboarding yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
