export interface OnboardingRecord {
  userId: string
  whopId: string
  email?: string
  step: number
  xp: number
  selectedClass: 'architect' | 'sensei' | 'builder' | null
  storeUrl: string | null
  storeVerified: boolean
  startedAt: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface LeaderboardStats {
  totalStarted: number
  totalCompleted: number
  completionRate: number
  averageXP: number
  users: OnboardingRecord[]
}

