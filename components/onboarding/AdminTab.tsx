'use client'

import { GlassCard } from './GlassCard'
import { useEffect, useState } from 'react'

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

export function AdminTab() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/leaderboard')

      if (!response.ok) {
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
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-primary text-xl">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-primary text-xl">No data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Admin <span className="text-accent">Leaderboard</span>
        </h1>
        <p className="text-lg text-primary/70">
          Onboarding statistics and user progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard>
          <div className="text-center">
            <p className="text-xs text-primary/60 mb-1">Total Started</p>
            <p className="text-2xl font-bold text-primary">{data.totalStarted}</p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <p className="text-xs text-primary/60 mb-1">Completed</p>
            <p className="text-2xl font-bold text-accent">{data.totalCompleted}</p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <p className="text-xs text-primary/60 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-primary">{data.completionRate.toFixed(1)}%</p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <p className="text-xs text-primary/60 mb-1">Average XP</p>
            <p className="text-2xl font-bold text-accent">{Math.round(data.averageXP)}</p>
          </div>
        </GlassCard>
      </div>

      {/* Leaderboard Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">User</th>
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">Status</th>
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">Step</th>
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">XP</th>
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">Class</th>
                <th className="text-left py-3 px-3 text-sm text-primary font-semibold">Store</th>
              </tr>
            </thead>
            <tbody>
              {data.users.slice(0, 10).map((user) => (
                <tr
                  key={user.userId}
                  className={`border-b border-primary/10 ${
                    user.completedAt ? 'bg-accent/5' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-sm text-primary">
                    <div>
                      <div className="font-medium">{getUserName(user)}</div>
                      <div className="text-xs text-primary/60 font-mono">
                        {user.userId.substring(0, 20)}...
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3 text-sm text-primary">{user.step}/6</td>
                  <td className="py-3 px-3 text-sm text-accent font-bold">{user.xp}</td>
                  <td className="py-3 px-3 text-sm text-primary">{getClassLabel(user.selectedClass)}</td>
                  <td className="py-3 px-3">
                    {user.storeVerified ? (
                      <span className="text-accent text-sm">✓ Verified</span>
                    ) : (
                      <span className="text-primary/40 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {data.users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-primary/60">
                    No users have started onboarding yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data.users.length > 10 && (
          <div className="mt-4 text-center text-sm text-primary/60">
            Showing top 10 of {data.users.length} users
          </div>
        )}
      </GlassCard>
    </div>
  )
}

