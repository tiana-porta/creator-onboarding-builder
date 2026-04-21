'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/lib/theme/ThemeProvider'
import { OnboardingRenderer } from '@/components/onboarding/OnboardingRenderer'
import type { OnboardingConfig } from '@/lib/onboarding/config-types'

interface ProgressState {
  currentStep: number
  xp: number
  stepData: Record<string, any>
  completed: boolean
}

export default function OnboardingClient({ config, initialProgress, whopId, userId }: { config: OnboardingConfig, initialProgress: ProgressState, whopId: string, userId: string }) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress)

  const handleStepComplete = async (stepIndex: number, data: any) => {
    const newProgress = {
      ...progress,
      currentStep: stepIndex + 2,
      stepData: { ...progress.stepData, ...data },
      xp: progress.xp + (config?.steps[stepIndex]?.xpReward || 0),
    }
    setProgress(newProgress)

    // Save to DB
    await fetch('/api/onboarding/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whop-ID': whopId,
      },
      body: JSON.stringify({
        user_id: userId,
        currentStep: newProgress.currentStep,
        xp: newProgress.xp,
        stepData: newProgress.stepData,
      }),
    })
  }

  const handleComplete = async () => {
    const newProgress = { ...progress, completed: true }
    setProgress(newProgress)

    // Save completion
    await fetch('/api/onboarding/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whop-ID': whopId,
      },
      body: JSON.stringify({
        user_id: userId,
        completed: true,
      }),
    })
  }

  const handleXPChange = async (xp: number) => {
    setProgress(prev => ({ ...prev, xp }))
  }

  return (
    <ThemeProvider theme={config.theme}>
      <OnboardingRenderer
        config={config}
        userProgress={progress}
        onStepComplete={handleStepComplete}
        onComplete={handleComplete}
        onXPChange={handleXPChange}
      />
    </ThemeProvider>
  )
}
