// Type definitions for config-driven onboarding system

export type StepType = 'choice' | 'video' | 'tour' | 'form' | 'checklist' | 'finale'

export interface GradientStop {
  color: string
  position: number // 0-100
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  lightColor: string
  gradientStops?: GradientStop[]
  buttonRadius: number
  buttonStyle: 'solid' | 'outline' | 'ghost'
  logoUrl?: string
  coverImageUrl?: string
}

export interface ChoiceOption {
  id: string
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  emoji?: string
}

export interface StepConfig {
  id: string
  type: StepType
  title: string
  description?: string
  enabled: boolean
  order: number
  
  // Step-specific configs
  // Choice step
  options?: ChoiceOption[]
  allowMultiple?: boolean
  
  // Video step
  videoUrl?: string
  videoEmbedUrl?: string
  requireWatch?: boolean
  minWatchTime?: number // seconds
  
  // Tour step
  tourItems?: Array<{
    id?: string
    title: string
    subtitle?: string
    description: string
    imageUrl?: string
    image?: string // Alias for imageUrl
    videoUrl?: string
    live?: string // e.g., "Tuesday & Thursday at 4PM EST"
    instructionalContent?: {
      title: string
      steps: Array<{
        step: string
        text: string
      }>
    }
  }>
  
  // Form step
  formFields?: Array<{
    id: string
    label: string
    type: 'text' | 'email' | 'url' | 'textarea'
    required: boolean
    placeholder?: string
    validation?: {
      pattern?: string
      minLength?: number
      maxLength?: number
    }
  }>
  
  // Checklist step
  checklistItems?: Array<{
    id: string
    label: string
    description?: string
    required: boolean
    stepNumber?: string // Optional step number (e.g., "1", "2")
    highlightWord?: string // Word to highlight in description
  }>
  
  // Finale step
  completionMessage?: string
  showConfetti?: boolean
  
  // Common
  ctaLabel?: string
  ctaUrl?: string
  xpReward?: number
  mediaUrl?: string
  emoji?: string
}

export interface OnboardingConfig {
  id: string
  whopId: string
  theme: ThemeConfig
  welcomeTitle?: string
  welcomeSubtitle?: string
  welcomeCompleted: boolean
  steps: StepConfig[]
}

export interface OnboardingVersionData {
  id: string
  onboardingId: string
  version: number
  status: 'draft' | 'published'
  publishedAt?: string
  publishedBy?: string
  theme: ThemeConfig
  welcomeTitle?: string
  welcomeSubtitle?: string
  welcomeCompleted: boolean
  steps: StepConfig[]
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  id: string
  versionId: string
  userId: string
  email?: string
  currentStep: number
  xp: number
  completed: boolean
  stepData?: Record<string, any>
  startedAt: string
  completedAt?: string
  updatedAt: string
}

