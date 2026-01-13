/**
 * Leaderboard Store Interface
 * Handles leaderboard scoring (localStorage MVP, can be swapped for DB)
 */

export interface LeaderboardEntry {
  userId: string
  userName?: string // Optional display name
  points: number
  completedAt: string | null // ISO timestamp of when all days completed (tie-breaker)
  day5CompletedAt: string | null // When day 5 was completed
}

const STORAGE_PREFIX = 'whop_5day_challenge_leaderboard_'

/**
 * Get storage key for leaderboard
 */
function getStorageKey(experienceId: string): string {
  return `${STORAGE_PREFIX}${experienceId}`
}

/**
 * Get leaderboard entries
 */
export function getLeaderboard(experienceId: string): LeaderboardEntry[] {
  if (typeof window === 'undefined') {
    // Server-side: return empty (in real app, fetch from DB)
    return []
  }
  
  try {
    const key = getStorageKey(experienceId)
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  }
  
  return []
}

/**
 * Save leaderboard entries
 */
function saveLeaderboard(experienceId: string, entries: LeaderboardEntry[]): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot save leaderboard on server-side (use DB in production)')
    return
  }
  
  try {
    const key = getStorageKey(experienceId)
    localStorage.setItem(key, JSON.stringify(entries))
  } catch (error) {
    console.error('Failed to save leaderboard:', error)
  }
}

/**
 * Submit/update score for a user
 */
export function submitScore(
  experienceId: string,
  userId: string,
  points: number,
  day5CompletedAt: string | null = null,
  completedAt: string | null = null
): void {
  const entries = getLeaderboard(experienceId)
  const existingIndex = entries.findIndex(e => e.userId === userId)
  
  const entry: LeaderboardEntry = {
    userId,
    points,
    completedAt,
    day5CompletedAt,
  }
  
  if (existingIndex >= 0) {
    // Update existing entry
    entries[existingIndex] = entry
  } else {
    // Add new entry
    entries.push(entry)
  }
  
  // Sort by: 1) points desc, 2) completedAt/day5CompletedAt asc (earlier is better)
  entries.sort((a, b) => {
    // First by points (descending)
    if (b.points !== a.points) {
      return b.points - a.points
    }
    
    // Tie-breaker: earliest completion timestamp (ascending)
    const aTime = a.completedAt || a.day5CompletedAt || '9999-12-31'
    const bTime = b.completedAt || b.day5CompletedAt || '9999-12-31'
    return aTime.localeCompare(bTime)
  })
  
  saveLeaderboard(experienceId, entries)
}

/**
 * Get user's rank
 */
export function getUserRank(experienceId: string, userId: string): number | null {
  const entries = getLeaderboard(experienceId)
  const index = entries.findIndex(e => e.userId === userId)
  return index >= 0 ? index + 1 : null
}

/**
 * Seed leaderboard with fake users for testing
 */
export function seedLeaderboard(experienceId: string): void {
  const entries = getLeaderboard(experienceId)
  
  // Only seed if empty
  if (entries.length > 0) return
  
  const fakeUsers: LeaderboardEntry[] = [
    { userId: 'user1', userName: 'Alex', points: 450, completedAt: '2024-01-05T12:00:00Z', day5CompletedAt: '2024-01-05T12:00:00Z' },
    { userId: 'user2', userName: 'Sam', points: 420, completedAt: '2024-01-05T14:00:00Z', day5CompletedAt: '2024-01-05T14:00:00Z' },
    { userId: 'user3', userName: 'Jordan', points: 380, completedAt: '2024-01-05T16:00:00Z', day5CompletedAt: '2024-01-05T16:00:00Z' },
    { userId: 'user4', userName: 'Casey', points: 350, completedAt: null, day5CompletedAt: null },
    { userId: 'user5', userName: 'Morgan', points: 320, completedAt: null, day5CompletedAt: null },
  ]
  
  saveLeaderboard(experienceId, fakeUsers)
}

