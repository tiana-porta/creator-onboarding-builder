/**
 * Challenge Schedule - Calendar-based drip feed
 * Days unlock ONLY by date, not by completion
 */

const DEFAULT_TIMEZONE = 'America/New_York'

export interface ChallengeConfig {
  startDate: string // YYYY-MM-DD format
  timezone?: string
}

/**
 * Parse challenge start date and get the Date object at midnight in the specified timezone
 * 
 * Note: For production, consider using date-fns-tz or luxon for proper timezone handling
 * This is a simplified implementation that uses local time
 */
function parseStartDate(dateStr: string, timezone: string = DEFAULT_TIMEZONE): Date {
  // Parse YYYY-MM-DD format
  const [year, month, day] = dateStr.split('-').map(Number)
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`)
  }
  
  // Create date at midnight (simplified - assumes local timezone)
  // In production with proper timezone support:
  // const date = zonedTimeToUtc(new Date(year, month - 1, day, 0, 0, 0), timezone)
  const date = new Date(year, month - 1, day, 0, 0, 0)
  
  return date
}

/**
 * Get the number of days unlocked based on the current date
 * Returns 0-5 (0 means nothing unlocked, 5 means all days unlocked)
 */
export function getUnlockedDayCount(config: ChallengeConfig, now: Date = new Date()): number {
  const startDate = parseStartDate(config.startDate, config.timezone || DEFAULT_TIMEZONE)
  const diffMs = now.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  // Clamp between 0 and 5
  return Math.max(0, Math.min(5, diffDays + 1))
}

/**
 * Check if a specific day is unlocked
 */
export function isDayUnlocked(dayNumber: number, config: ChallengeConfig, now: Date = new Date()): boolean {
  if (dayNumber < 1 || dayNumber > 5) return false
  const unlockedCount = getUnlockedDayCount(config, now)
  return dayNumber <= unlockedCount
}

/**
 * Get the unlock date for a specific day
 */
export function getDayUnlockDate(dayNumber: number, config: ChallengeConfig): Date {
  const startDate = parseStartDate(config.startDate, config.timezone || DEFAULT_TIMEZONE)
  const unlockDate = new Date(startDate)
  unlockDate.setDate(unlockDate.getDate() + (dayNumber - 1))
  return unlockDate
}

/**
 * Get the next unlock date (for the next locked day)
 */
export function getNextUnlockDate(config: ChallengeConfig, now: Date = new Date()): Date | null {
  const unlockedCount = getUnlockedDayCount(config, now)
  if (unlockedCount >= 5) return null // All days unlocked
  return getDayUnlockDate(unlockedCount + 1, config)
}

/**
 * Get time remaining until next unlock (in milliseconds)
 */
export function getTimeUntilNextUnlock(config: ChallengeConfig, now: Date = new Date()): number | null {
  const nextUnlock = getNextUnlockDate(config, now)
  if (!nextUnlock) return null
  return Math.max(0, nextUnlock.getTime() - now.getTime())
}

/**
 * Format countdown string (e.g., "2h 30m")
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m'
  
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Get challenge config from environment
 */
export function getChallengeConfig(): ChallengeConfig {
  const startDate = process.env.CHALLENGE_START_DATE || '2024-01-01'
  const timezone = process.env.CHALLENGE_TIMEZONE || DEFAULT_TIMEZONE
  
  return {
    startDate,
    timezone,
  }
}

