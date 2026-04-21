import { getPublishedVersion, getVersionWithOnboarding, versionToConfig } from '@/lib/onboarding/service'
import { getAuthenticatedUser } from '@/lib/auth/ownership'
import { supabaseAdmin } from '@/lib/db/supabase'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage({ params }: { params: Promise<{ whopId: string }> }) {
  const { whopId } = await params

  // Fetch onboarding config
  const published = await getPublishedVersion(whopId)
  if (!published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Onboarding not found</div>
      </div>
    )
  }

  const fullVersion = await getVersionWithOnboarding(published.id)
  const config = versionToConfig(fullVersion)

  // Get user and their progress
  const authContext = await getAuthenticatedUser()
  const userId = authContext?.userId || 'demo-user-1' // Replace with real user ID

  const { data: progress } = await supabaseAdmin
    .from('onboarding_progress')
    .select('*')
    .eq('version_id', published.id)
    .eq('user_id', userId)
    .single()

  const initialProgress = progress ? {
    currentStep: progress.current_step,
    xp: progress.xp,
    stepData: progress.step_data || {},
    completed: progress.completed,
  } : {
    currentStep: 1,
    xp: 0,
    stepData: {},
    completed: false,
  }

  return (
    <OnboardingClient
      config={config}
      initialProgress={initialProgress}
      whopId={whopId}
      userId={userId}
    />
  )
}
