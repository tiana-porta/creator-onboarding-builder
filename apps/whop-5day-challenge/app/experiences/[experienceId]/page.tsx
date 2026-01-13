'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
// Import shared components from onboarding app (via symlinks)
import { GlassCard } from '@/components/onboarding/GlassCard'
import { ProgressHeader } from '@/components/onboarding/ProgressHeader'
import { CHALLENGE_CONTENT } from '@/lib/challengeContent'
import { getChallengeConfig, isDayUnlocked, getNextUnlockDate, formatCountdown, getTimeUntilNextUnlock } from '@/lib/challengeSchedule'
import { getProgress } from '@/lib/progressStore'
import { calculateTotalPoints } from '@/lib/scoring'
import { getLeaderboard, seedLeaderboard, getUserRank } from '@/lib/leaderboardStore'
import type { DayProgress } from '@/lib/progressStore'
import type { DayContent } from '@/lib/challengeContent'
import Link from 'next/link'

// Mock user ID for now (will be replaced with actual auth)
const MOCK_USER_ID = 'current-user'

export default function ChallengeDashboardPage() {
  const params = useParams()
  const experienceId = params.experienceId as string
  
  const [userId, setUserId] = useState<string>(MOCK_USER_ID)
  const [progress, setProgress] = useState<any>(null)
  const [config, setConfig] = useState(getChallengeConfig())
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<string>('')
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    // Seed leaderboard on mount
    seedLeaderboard(experienceId)
    
    // Load progress
    const userProgress = getProgress(userId, experienceId)
    setProgress(userProgress)
    
    // Load leaderboard
    const lb = getLeaderboard(experienceId)
    setLeaderboard(lb)
    setUserRank(getUserRank(experienceId, userId))
    
    setIsHydrated(true)
  }, [experienceId, userId])
  
  // Update countdown timer
  useEffect(() => {
    if (!isHydrated) return
    
    const updateCountdown = () => {
      const timeUntil = getTimeUntilNextUnlock(config)
      if (timeUntil !== null) {
        setCountdown(formatCountdown(timeUntil))
      } else {
        setCountdown('')
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000 * 60) // Update every minute
    
    return () => clearInterval(interval)
  }, [config, isHydrated])
  
  if (!isHydrated || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }
  
  // Calculate total points
  const totalPoints = calculateTotalPoints(
    CHALLENGE_CONTENT.days,
    progress.days
  )
  
  // Find highest unlocked day that's not completed
  const getHighestUnlockedIncompleteDay = (): number | null => {
    for (let i = 5; i >= 1; i--) {
      if (isDayUnlocked(i, config) && !progress.days[i - 1].completed) {
        return i
      }
    }
    return null
  }
  
  // Find latest unlocked day
  const getLatestUnlockedDay = (): number => {
    for (let i = 5; i >= 1; i--) {
      if (isDayUnlocked(i, config)) {
        return i
      }
    }
    return 1
  }
  
  const nextDay = getHighestUnlockedIncompleteDay() || getLatestUnlockedDay()
  const nextUnlockDate = getNextUnlockDate(config)
  
  const getDayStatus = (dayNumber: number): 'locked' | 'unlocked' | 'completed' => {
    const dayProgress = progress.days.find((d: DayProgress) => d.dayNumber === dayNumber)
    if (dayProgress?.completed) return 'completed'
    if (isDayUnlocked(dayNumber, config)) return 'unlocked'
    return 'locked'
  }
  
  return (
    <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-primary mb-4">
            {CHALLENGE_CONTENT.title}
          </h1>
          <p className="text-xl text-primary/70">
            {CHALLENGE_CONTENT.subtitle}
          </p>
        </div>
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">Your Progress</h2>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border-2 border-accent/20 shadow-sm">
              <span className="text-accent font-bold text-lg">{totalPoints}</span>
              <span className="text-primary/70 text-sm font-semibold">Points</span>
            </div>
          </div>
        </div>
        
        {/* Days Progress Row */}
        <GlassCard className="mb-8">
          <div className="grid grid-cols-5 gap-4">
            {CHALLENGE_CONTENT.days.map((day) => {
              const status = getDayStatus(day.dayNumber)
              const dayProgress = progress.days.find((d: DayProgress) => d.dayNumber === day.dayNumber)
              
              return (
                <Link
                  key={day.dayNumber}
                  href={`/experiences/${experienceId}/day/${day.dayNumber}`}
                  className="text-center"
                >
                  <motion.div
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${status === 'completed' 
                        ? 'border-accent bg-accent/10' 
                        : status === 'unlocked'
                        ? 'border-primary/40 bg-dark/50 hover:border-primary/60'
                        : 'border-primary/20 bg-dark/30 opacity-60'
                      }
                    `}
                    whileHover={status !== 'locked' ? { scale: 1.05 } : {}}
                  >
                    <div className="text-3xl font-bold mb-2">
                      {status === 'completed' ? '✓' : status === 'unlocked' ? day.dayNumber : '🔒'}
                    </div>
                    <div className="text-sm font-semibold text-primary mb-1">
                      Day {day.dayNumber}
                    </div>
                    <div className="text-xs text-primary/60 mb-2">
                      {day.title}
                    </div>
                    {status === 'locked' && (
                      <div className="text-xs text-accent mt-2">
                        {nextUnlockDate && formatCountdown(getTimeUntilNextUnlock(config) || 0)}
                      </div>
                    )}
                    {status === 'completed' && dayProgress?.completedAt && (
                      <div className="text-xs text-primary/50 mt-2">
                        Completed
                      </div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </GlassCard>
        
        {/* Continue CTA */}
        <div className="flex justify-center mb-8">
          <Link href={`/experiences/${experienceId}/day/${nextDay}`}>
            <motion.button
              className="px-10 py-4 rounded-xl font-semibold text-lg bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Challenge
            </motion.button>
          </Link>
        </div>
        
        {/* Leaderboard Preview */}
        <GlassCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-primary">Leaderboard</h3>
            <Link 
              href={`/experiences/${experienceId}/leaderboard`}
              className="text-accent hover:text-accent/80 text-sm font-semibold"
            >
              View Full →
            </Link>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.userId}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${entry.userId === userId ? 'bg-accent/10 border-2 border-accent/30' : 'bg-dark/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary/70 w-6">
                    {index + 1}
                  </span>
                  <span className="text-primary font-semibold">
                    {entry.userName || `User ${entry.userId.slice(0, 8)}`}
                  </span>
                  {entry.userId === userId && (
                    <span className="text-xs text-accent font-semibold px-2 py-1 bg-accent/20 rounded">
                      You
                    </span>
                  )}
                </div>
                <span className="text-accent font-bold">{entry.points} pts</span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div className="text-center text-primary/60 py-4">
                Be the first on the leaderboard!
              </div>
            )}
          </div>
        </GlassCard>
        
        {/* Badges */}
        {progress.badges.length > 0 && (
          <GlassCard>
            <h3 className="text-xl font-bold text-primary mb-4">Badges</h3>
            <div className="flex gap-3">
              {progress.badges.map((badge: string) => (
                <div
                  key={badge}
                  className="px-4 py-2 rounded-full bg-accent/20 border-2 border-accent/30 text-accent font-semibold"
                >
                  {badge === 'all_days_completed' ? '🏆 All Days Completed' : badge}
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

