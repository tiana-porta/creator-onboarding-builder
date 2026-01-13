/**
 * Scoring Logic
 * Calculates points for actions and completion
 */

import type { ActionItem, DayContent } from './challengeContent'
import type { DayProgress } from './progressStore'

/**
 * Calculate points for action items in a day
 */
export function calculateActionItemPoints(dayContent: DayContent, dayProgress: DayProgress): number {
  let points = 0
  
  dayContent.actionItems.forEach((item, index) => {
    if (dayProgress.actionItemsCompleted[index]) {
      points += item.points
    }
  })
  
  return points
}

/**
 * Calculate total points for a user across all days
 */
export function calculateTotalPoints(
  daysContent: DayContent[],
  daysProgress: DayProgress[]
): number {
  let total = 0
  
  daysContent.forEach(dayContent => {
    const dayProgress = daysProgress.find(d => d.dayNumber === dayContent.dayNumber)
    if (dayProgress) {
      // Action item points
      total += calculateActionItemPoints(dayContent, dayProgress)
      
      // Day completion bonus
      if (dayProgress.completed) {
        total += 50
      }
    }
  })
  
  // All 5 days completion bonus
  const allCompleted = daysProgress.every(d => d.completed)
  if (allCompleted) {
    total += 200
  }
  
  return total
}

/**
 * Check if all action items in a day are completed
 */
export function areAllActionItemsCompleted(dayContent: DayContent, dayProgress: DayProgress): boolean {
  if (dayProgress.actionItemsCompleted.length < dayContent.actionItems.length) {
    return false
  }
  
  return dayContent.actionItems.every((_, index) => {
    return dayProgress.actionItemsCompleted[index] === true
  })
}

