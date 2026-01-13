import type { OnboardingRecord } from './types'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'onboarding-records.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  await ensureDataDirectory()
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

// Read all records
export async function getAllRecords(): Promise<OnboardingRecord[]> {
  await initializeDataFile()
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data) as OnboardingRecord[]
  } catch (error) {
    console.error('Error reading records:', error)
    return []
  }
}

// Get record by userId
export async function getRecordByUserId(userId: string): Promise<OnboardingRecord | null> {
  const records = await getAllRecords()
  return records.find(r => r.userId === userId) || null
}

// Create or update record
export async function upsertRecord(record: Partial<OnboardingRecord> & { userId: string }): Promise<OnboardingRecord> {
  await initializeDataFile()
  const records = await getAllRecords()
  const existingIndex = records.findIndex(r => r.userId === record.userId)
  
  const now = new Date().toISOString()
  const fullRecord: OnboardingRecord = {
    ...record,
    userId: record.userId,
    email: record.email ?? '',
    step: record.step ?? 0,
    xp: record.xp ?? 0,
    selectedClass: record.selectedClass ?? null,
    storeUrl: record.storeUrl ?? null,
    storeVerified: record.storeVerified ?? false,
    startedAt: record.startedAt ?? now,
    completedAt: record.completedAt ?? null,
    createdAt: existingIndex >= 0 ? records[existingIndex].createdAt : now,
    updatedAt: now,
  }

  if (existingIndex >= 0) {
    records[existingIndex] = fullRecord
  } else {
    records.push(fullRecord)
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2))
  return fullRecord
}

// Get leaderboard stats
export async function getLeaderboardStats(): Promise<{
  totalStarted: number
  totalCompleted: number
  completionRate: number
  averageXP: number
  users: OnboardingRecord[]
}> {
  const records = await getAllRecords()
  const totalStarted = records.length
  const totalCompleted = records.filter(r => r.completedAt !== null).length
  const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0
  const averageXP = records.length > 0 
    ? records.reduce((sum, r) => sum + r.xp, 0) / records.length 
    : 0

  // Sort by completed first, then by XP, then by completion time
  const sortedUsers = [...records].sort((a, b) => {
    // Completed users first
    if (a.completedAt && !b.completedAt) return -1
    if (!a.completedAt && b.completedAt) return 1
    
    // Then by XP (descending)
    if (a.xp !== b.xp) return b.xp - a.xp
    
    // Then by completion time (earlier first)
    if (a.completedAt && b.completedAt) {
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    }
    
    return 0
  })

  return {
    totalStarted,
    totalCompleted,
    completionRate,
    averageXP,
    users: sortedUsers,
  }
}

