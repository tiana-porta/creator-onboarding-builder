'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
// Import shared components from onboarding app (via symlinks)
import { GlassCard } from '@/components/onboarding/GlassCard'
import { getLeaderboard } from '@/lib/leaderboardStore'
import Link from 'next/link'

const MOCK_USER_ID = 'current-user'

export default function LeaderboardPage() {
  const params = useParams()
  const experienceId = params.experienceId as string
  
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    const lb = getLeaderboard(experienceId)
    setLeaderboard(lb)
    setIsHydrated(true)
  }, [experienceId])
  
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href={`/experiences/${experienceId}`}
            className="text-primary/70 hover:text-primary text-sm font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Leaderboard</h1>
          <p className="text-primary/70">Top performers in the challenge</p>
        </div>
        
        {/* Leaderboard */}
        <GlassCard>
          {leaderboard.length === 0 ? (
            <div className="text-center text-primary/60 py-12">
              <p className="text-xl mb-4">No entries yet</p>
              <p>Be the first to complete the challenge!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.userId === MOCK_USER_ID
                const rank = index + 1
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null
                
                return (
                  <div
                    key={entry.userId}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border-2 transition-all
                      ${isCurrentUser 
                        ? 'bg-accent/20 border-accent/50 shadow-lg shadow-accent/20' 
                        : 'bg-dark/50 border-primary/20 hover:border-primary/40'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary/70 w-8 text-center">
                        {medal || rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold text-lg">
                            {entry.userName || `User ${entry.userId.slice(0, 8)}`}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs text-accent font-semibold px-2 py-1 bg-accent/30 rounded">
                              You
                            </span>
                          )}
                        </div>
                        {entry.completedAt && (
                          <div className="text-xs text-primary/50 mt-1">
                            Completed: {new Date(entry.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">
                        {entry.points}
                      </div>
                      <div className="text-xs text-primary/60">points</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

