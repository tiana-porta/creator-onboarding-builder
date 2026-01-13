export type ClassType = 'architect' | 'sensei' | 'builder' | null

export interface OnboardingState {
  step: number
  xp: number
  selectedClass: ClassType
  commitmentAccepted: boolean
  storeUrl: string | null
  storeVerified: boolean
  notifMission: boolean
  notifSauce: boolean
  notifAudit: boolean
  notifDaily: boolean
  startedAt: string
  completedAt: string | null
  welcomeCompleted: boolean
  email?: string
}

export const DEFAULT_STATE: OnboardingState = {
  step: 1,
  xp: 0,
  selectedClass: null,
  commitmentAccepted: false,
  storeUrl: null,
  storeVerified: false,
  notifMission: false,
  notifSauce: false,
  notifAudit: false,
  notifDaily: false,
  startedAt: new Date().toISOString(),
  completedAt: null,
  welcomeCompleted: false,
  email: undefined,
}

export const STORAGE_KEY = 'whop_u_onboarding_v1'
