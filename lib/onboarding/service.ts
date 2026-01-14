import { prisma } from '../db/client'
import type { OnboardingConfig, ThemeConfig, StepConfig } from './config-types'

// Get or create onboarding for a whop
export async function getOrCreateOnboarding(whopId: string) {
  let onboarding = await prisma.onboarding.findUnique({
    where: { whopId },
    include: {
      versions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!onboarding) {
    onboarding = await prisma.onboarding.create({
      data: {
        whopId,
        versions: {
          create: {
            version: 1,
            status: 'draft',
            steps: JSON.stringify([]),
          },
        },
      },
      include: {
        versions: true,
      },
    })
  }

  return onboarding
}

// Get draft version
export async function getDraftVersion(whopId: string) {
  const onboarding = await getOrCreateOnboarding(whopId)
  const draft = await prisma.onboardingVersion.findFirst({
    where: {
      onboardingId: onboarding.id,
      status: 'draft',
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!draft) {
    // Create new draft
    const latestVersion = await prisma.onboardingVersion.findFirst({
      where: { onboardingId: onboarding.id },
      orderBy: { version: 'desc' },
    })

    const newDraft = await prisma.onboardingVersion.create({
      data: {
        onboardingId: onboarding.id,
        version: (latestVersion?.version || 0) + 1,
        status: 'draft',
        steps: latestVersion?.steps || JSON.stringify([]),
        primaryColor: latestVersion?.primaryColor || '#141212',
        secondaryColor: latestVersion?.secondaryColor || '#FA4616',
        lightColor: latestVersion?.lightColor || '#FCF6F5',
        buttonRadius: latestVersion?.buttonRadius || 12,
        buttonStyle: latestVersion?.buttonStyle || 'solid',
        mode: latestVersion?.mode || 'dark',
        welcomeTitle: latestVersion?.welcomeTitle,
        welcomeSubtitle: latestVersion?.welcomeSubtitle,
        welcomeCompleted: latestVersion?.welcomeCompleted || false,
      },
    })

    return newDraft
  }

  return draft
}

// Get published version
export async function getPublishedVersion(whopId: string) {
  const onboarding = await prisma.onboarding.findUnique({
    where: { whopId },
  })

  if (!onboarding) return null

  return prisma.onboardingVersion.findFirst({
    where: {
      onboardingId: onboarding.id,
      status: 'published',
    },
    orderBy: { publishedAt: 'desc' },
  })
}

// Update draft theme
export async function updateDraftTheme(whopId: string, theme: Partial<ThemeConfig>) {
  const draft = await getDraftVersion(whopId)
  
  return prisma.onboardingVersion.update({
    where: { id: draft.id },
    data: {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      lightColor: theme.lightColor,
      gradientStops: theme.gradientStops ? JSON.stringify(theme.gradientStops) : null,
      buttonRadius: theme.buttonRadius,
      buttonStyle: theme.buttonStyle,
      logoUrl: theme.logoUrl,
      coverImageUrl: theme.coverImageUrl,
      mode: theme.mode,
    },
  })
}

// Update draft steps
export async function updateDraftSteps(whopId: string, steps: StepConfig[]) {
  const draft = await getDraftVersion(whopId)
  
  return prisma.onboardingVersion.update({
    where: { id: draft.id },
    data: {
      steps: JSON.stringify(steps),
    },
  })
}

// Publish draft
export async function publishDraft(whopId: string, publishedBy?: string) {
  const draft = await getDraftVersion(whopId)
  
  // Unpublish any existing published versions
  await prisma.onboardingVersion.updateMany({
    where: {
      onboardingId: draft.onboardingId,
      status: 'published',
    },
    data: {
      status: 'draft', // Archive old published versions
    },
  })

  // Publish the draft
  return prisma.onboardingVersion.update({
    where: { id: draft.id },
    data: {
      status: 'published',
      publishedAt: new Date(),
      publishedBy,
    },
  })
}

// Convert version to config format
export function versionToConfig(version: any): OnboardingConfig {
  if (!version) {
    throw new Error('Version is required')
  }

  // Get whopId from onboarding relation or fallback
  const whopId = version.onboarding?.whopId || version.onboardingId || ''

  // Safely parse steps
  let steps: StepConfig[] = []
  try {
    steps = JSON.parse(version.steps || '[]')
  } catch (e) {
    console.error('Error parsing steps:', e)
    steps = []
  }

  // Safely parse gradient stops
  let gradientStops = undefined
  if (version.gradientStops) {
    try {
      gradientStops = JSON.parse(version.gradientStops)
    } catch (e) {
      console.error('Error parsing gradient stops:', e)
    }
  }

  return {
    id: version.id || '',
    whopId,
    theme: {
      primaryColor: version.primaryColor || '#141212',
      secondaryColor: version.secondaryColor || '#FA4616',
      lightColor: version.lightColor || '#FCF6F5',
      gradientStops,
      buttonRadius: version.buttonRadius || 12,
      buttonStyle: (version.buttonStyle || 'solid') as 'solid' | 'outline' | 'ghost',
      logoUrl: version.logoUrl || undefined,
      coverImageUrl: version.coverImageUrl || undefined,
      mode: (version.mode || 'dark') as 'light' | 'dark',
    },
    welcomeTitle: version.welcomeTitle || undefined,
    welcomeSubtitle: version.welcomeSubtitle || undefined,
    welcomeCompleted: version.welcomeCompleted || false,
    steps,
  }
}

