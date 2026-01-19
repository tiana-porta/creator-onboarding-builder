import { getPublishedVersion, versionToConfig } from '@/lib/onboarding/service'
import { getAuthFromRequest } from '@/lib/auth/ownership'
import { prisma } from '@/lib/db/client'
import OnboardingClient from './OnboardingClient'
import { headers } from 'next/headers'

export default async function OnboardingPage({ params }: { params: { whopId: string } }) {
  const { whopId } = params

  // Fetch onboarding config
  const published = await getPublishedVersion(whopId)
  if (!published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Onboarding not found</div>
      </div>
    )
  }

  const fullVersion = await prisma.onboardingVersion.findUnique({
    where: { id: published.id },
    include: { onboarding: true },
  })

  const config = versionToConfig(fullVersion)

  // Get user and their progress
  const authContext = await getAuthFromRequest(new Request(process.env.NEXT_PUBLIC_URL!, { headers: headers() }))
  const userId = authContext?.userId || 'demo-user-1' // Replace with real user ID

  const progress = await prisma.onboardingProgress.findUnique({
    where: {
      versionId_userId: {
        versionId: published.id,
        userId,
      },
    },
  })

  const initialProgress = progress || {
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

