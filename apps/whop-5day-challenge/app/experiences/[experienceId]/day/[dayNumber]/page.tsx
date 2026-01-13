'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
// Import shared components from onboarding app (via symlinks)
import { GlassCard } from '@/components/onboarding/GlassCard'
import { ProgressHeader } from '@/components/onboarding/ProgressHeader'
import { CHALLENGE_CONTENT, getDayContent } from '@/lib/challengeContent'
import { getChallengeConfig, isDayUnlocked, getDayUnlockDate, formatCountdown, getTimeUntilNextUnlock } from '@/lib/challengeSchedule'
import { getProgress, updateActionItem, completeDay, saveProgress } from '@/lib/progressStore'
import { submitScore } from '@/lib/leaderboardStore'
import { areAllActionItemsCompleted, calculateActionItemPoints } from '@/lib/scoring'
import type { DayProgress } from '@/lib/progressStore'
import type { DayContent } from '@/lib/challengeContent'
import Link from 'next/link'

const MOCK_USER_ID = 'current-user'

export default function DayDetailPage() {
  const params = useParams()
  const router = useRouter()
  const experienceId = params.experienceId as string
  const dayNumber = parseInt(params.dayNumber as string, 10)
  
  const [userId, setUserId] = useState<string>(MOCK_USER_ID)
  const [progress, setProgress] = useState<any>(null)
  const [config, setConfig] = useState(getChallengeConfig())
  const [dayContent, setDayContent] = useState<DayContent | null>(null)
  const [dayProgress, setDayProgress] = useState<DayProgress | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [actionItemInputs, setActionItemInputs] = useState<Record<number, string>>({})
  
  useEffect(() => {
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 5) {
      router.push(`/experiences/${experienceId}`)
      return
    }
    
    const content = getDayContent(dayNumber)
    setDayContent(content)
    
    const userProgress = getProgress(userId, experienceId)
    setProgress(userProgress)
    
    const day = userProgress.days.find((d: DayProgress) => d.dayNumber === dayNumber)
    setDayProgress(day)
    
    // Initialize input values
    if (day) {
      const inputs: Record<number, string> = {}
      day.actionItemInputs.forEach((value, index) => {
        inputs[index] = value || ''
      })
      setActionItemInputs(inputs)
    }
    
    setIsHydrated(true)
  }, [dayNumber, experienceId, userId, router])
  
  if (!isHydrated || !dayContent || !dayProgress || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }
  
  const isLocked = !isDayUnlocked(dayNumber, config)
  const nextUnlockDate = getDayUnlockDate(dayNumber, config)
  const allActionItemsCompleted = areAllActionItemsCompleted(dayContent, dayProgress)
  const actionItemPoints = calculateActionItemPoints(dayContent, dayProgress)
  
  const handleActionItemToggle = (index: number) => {
    if (isLocked) return
    
    const currentCompleted = dayProgress.actionItemsCompleted[index] || false
    const input = actionItemInputs[index] || ''
    
    const updated = updateActionItem(
      userId,
      experienceId,
      dayNumber,
      index,
      !currentCompleted,
      input
    )
    
    setProgress(updated)
    const updatedDay = updated.days.find((d: DayProgress) => d.dayNumber === dayNumber)
    setDayProgress(updatedDay!)
    
    // Recalculate and update leaderboard
    const newPoints = calculateActionItemPoints(dayContent, updatedDay!)
    const totalPoints = updated.points + newPoints
    submitScore(experienceId, userId, totalPoints, null, null)
  }
  
  const handleInputChange = (index: number, value: string) => {
    if (isLocked) return
    
    setActionItemInputs(prev => ({ ...prev, [index]: value }))
    
    // Auto-save if item is completed
    if (dayProgress.actionItemsCompleted[index]) {
      updateActionItem(userId, experienceId, dayNumber, index, true, value)
    }
  }
  
  const handleCompleteDay = () => {
    if (isLocked || !allActionItemsCompleted || dayProgress.completed) return
    
    const updated = completeDay(userId, experienceId, dayNumber)
    setProgress(updated)
    const updatedDay = updated.days.find((d: DayProgress) => d.dayNumber === dayNumber)
    setDayProgress(updatedDay!)
    
    // Update leaderboard
    submitScore(
      experienceId,
      userId,
      updated.points,
      dayNumber === 5 ? updatedDay!.completedAt : null,
      updated.days.every(d => d.completed) ? updatedDay!.completedAt : null
    )
    
    // Redirect to next day or dashboard
    if (dayNumber < 5) {
      router.push(`/experiences/${experienceId}/day/${dayNumber + 1}`)
    } else {
      router.push(`/experiences/${experienceId}`)
    }
  }
  
  // Locked state screen
  if (isLocked) {
    const timeUntil = getTimeUntilNextUnlock(config)
    const countdown = timeUntil !== null ? formatCountdown(timeUntil) : ''
    
    return (
      <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Day {dayNumber} is Locked
            </h1>
            <p className="text-xl text-primary/70 mb-6">
              This day unlocks on {nextUnlockDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })} at midnight (America/New_York)
            </p>
            {countdown && (
              <p className="text-2xl text-accent font-bold mb-8">
                Unlocks in: {countdown}
              </p>
            )}
          </div>
          
          <GlassCard>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {dayContent.title}
              </h2>
              <p className="text-primary/70 mb-6">
                {dayContent.goal}
              </p>
              <Link href={`/experiences/${experienceId}`}>
                <motion.button
                  className="px-8 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Dashboard
                </motion.button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }
  
  // Unlocked day screen
  return (
    <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/experiences/${experienceId}`}
            className="text-primary/70 hover:text-primary text-sm font-semibold"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border-2 border-accent/20 shadow-sm">
            <span className="text-accent font-bold text-lg">{actionItemPoints}</span>
            <span className="text-primary/70 text-sm font-semibold">Points</span>
          </div>
        </div>
        
        {/* Day Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Day {dayNumber}: {dayContent.title}
          </h1>
          <p className="text-xl text-accent font-semibold">
            Goal: {dayContent.goal}
          </p>
        </div>
        
        {/* Why Are We Here & How This Challenge Works */}
        {(dayNumber === 1) && (
          <>
            <GlassCard className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Why Are We Here?</h2>
              <ul className="space-y-2 text-primary/80">
                {CHALLENGE_CONTENT.whyAreWeHere.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
            
            <GlassCard className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4">How This Challenge Works</h2>
              <ul className="space-y-2 text-primary/80">
                {CHALLENGE_CONTENT.howThisChallengeWorks.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </>
        )}
        
        {/* Lesson Content */}
        <GlassCard className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Lesson</h2>
          <ul className="space-y-3 text-primary/80">
            {dayContent.lessonBullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span className="flex-1">{bullet}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        
        {/* Action Items */}
        <GlassCard className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Action Items</h2>
          <div className="space-y-4">
            {dayContent.actionItems.map((item, index) => {
              const isCompleted = dayProgress.actionItemsCompleted[index] || false
              const inputValue = actionItemInputs[index] || ''
              
              return (
                <div
                  key={item.id}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${isCompleted ? 'border-accent/50 bg-accent/10' : 'border-primary/20 bg-dark/50'}
                  `}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => handleActionItemToggle(index)}
                      className="mt-1 w-5 h-5 rounded border-2 border-primary/40 bg-dark text-accent focus:ring-accent focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-primary font-semibold cursor-pointer flex-1" onClick={() => handleActionItemToggle(index)}>
                          {item.text}
                        </label>
                        <span className="text-accent font-bold text-sm">
                          +{item.points} pts
                        </span>
                      </div>
                      {item.requiresInput && (
                        <textarea
                          value={inputValue}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onBlur={() => {
                            if (isCompleted && inputValue) {
                              updateActionItem(userId, experienceId, dayNumber, index, true, inputValue)
                            }
                          }}
                          placeholder={item.inputPlaceholder || 'Enter your answer...'}
                          disabled={isLocked}
                          className="w-full px-3 py-2 mt-2 rounded-lg border-2 border-primary/20 bg-dark/90 text-primary placeholder-primary/40 focus:border-accent focus:outline-none"
                          rows={3}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
        
        {/* Complete Day Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleCompleteDay}
            disabled={!allActionItemsCompleted || dayProgress.completed}
            className={`
              px-10 py-4 rounded-xl font-semibold text-lg transition-all
              ${allActionItemsCompleted && !dayProgress.completed
                ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30'
                : 'bg-primary/10 text-primary/30 cursor-not-allowed'
              }
            `}
            whileHover={allActionItemsCompleted && !dayProgress.completed ? { scale: 1.05 } : {}}
            whileTap={allActionItemsCompleted && !dayProgress.completed ? { scale: 0.95 } : {}}
          >
            {dayProgress.completed ? 'Day Completed ✓' : 'Complete Day (+50 pts)'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

