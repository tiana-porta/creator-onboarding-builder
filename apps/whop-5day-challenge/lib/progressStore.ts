/**
 * Progress Store Interface
 * Handles user progress tracking (localStorage MVP, can be swapped for DB)
 */

export interface DayProgress {
  dayNumber: number
  actionItemsCompleted: boolean[]
  actionItemInputs: string[] // Stores input values for action items that require them
  completed: boolean
  completedAt: string | null // ISO timestamp
}

export interface UserProgress {
  userId: string
  experienceId: string
  points: number
  days: DayProgress[]
  badges: string[]
  startedAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

const STORAGE_PREFIX = 'whop_5day_challenge_progress_'

/**
 * Get storage key for user progress
 */
function getStorageKey(userId: string, experienceId: string): string {
  return `${STORAGE_PREFIX}${experienceId}_${userId}`
}

/**
 * Initialize default progress for a user
 */
function createDefaultProgress(userId: string, experienceId: string): UserProgress {
  const now = new Date().toISOString()
  const days: DayProgress[] = []
  
  for (let i = 1; i <= 5; i++) {
    days.push({
      dayNumber: i,
      actionItemsCompleted: [],
      actionItemInputs: [],
      completed: false,
      completedAt: null,
    })
  }
  
  return {
    userId,
    experienceId,
    points: 0,
    days,
    badges: [],
    startedAt: now,
    updatedAt: now,
  }
}

/**
 * Get user progress
 */
export function getProgress(userId: string, experienceId: string): UserProgress {
  if (typeof window === 'undefined') {
    // Server-side: return default (in real app, fetch from DB)
    return createDefaultProgress(userId, experienceId)
  }
  
  try {
    const key = getStorageKey(userId, experienceId)
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load progress:', error)
  }
  
  return createDefaultProgress(userId, experienceId)
}

/**
 * Save user progress
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot save progress on server-side (use DB in production)')
    return
  }
  
  try {
    const key = getStorageKey(progress.userId, progress.experienceId)
    const updated = {
      ...progress,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

/**
 * Update action item completion
 */
export function updateActionItem(
  userId: string,
  experienceId: string,
  dayNumber: number,
  actionItemIndex: number,
  completed: boolean,
  input?: string
): UserProgress {
  const progress = getProgress(userId, experienceId)
  const day = progress.days.find(d => d.dayNumber === dayNumber)
  
  if (!day) {
    throw new Error(`Day ${dayNumber} not found`)
  }
  
  // Ensure arrays are big enough
  while (day.actionItemsCompleted.length <= actionItemIndex) {
    day.actionItemsCompleted.push(false)
  }
  while (day.actionItemInputs.length <= actionItemIndex) {
    day.actionItemInputs.push('')
  }
  
  day.actionItemsCompleted[actionItemIndex] = completed
  if (input !== undefined) {
    day.actionItemInputs[actionItemIndex] = input
  }
  
  // Recalculate points based on action items
  // This will be done by the scoring module, but we save the progress here
  saveProgress(progress)
  return progress
}

/**
 * Mark day as completed
 */
export function completeDay(
  userId: string,
  experienceId: string,
  dayNumber: number
): UserProgress {
  const progress = getProgress(userId, experienceId)
  const day = progress.days.find(d => d.dayNumber === dayNumber)
  
  if (!day) {
    throw new Error(`Day ${dayNumber} not found`)
  }
  
  if (!day.completed) {
    day.completed = true
    day.completedAt = new Date().toISOString()
    
    // Add day completion bonus (50 points)
    progress.points += 50
    
    // Check for all 5 days completion bonus
    const allCompleted = progress.days.every(d => d.completed)
    if (allCompleted && !progress.badges.includes('all_days_completed')) {
      progress.badges.push('all_days_completed')
      progress.points += 200 // All days completion bonus
    }
    
    saveProgress(progress)
  }
  
  return progress
}

