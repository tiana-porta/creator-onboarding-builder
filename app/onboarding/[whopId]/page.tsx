'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/lib/theme/ThemeProvider'
import { OnboardingRenderer } from '@/components/onboarding/OnboardingRenderer'
import type { OnboardingConfig } from '@/lib/onboarding/config-types'

export default function OnboardingPage({ params }: { params: { whopId: string } }) {
  const [config, setConfig] = useState<OnboardingConfig | null>(null)
  const [progress, setProgress] = useState({
    currentStep: 1,
    xp: 0,
    stepData: {} as Record<string, any>,
    completed: false,
  })
  const [loading, setLoading] = useState(true)
  const [userId] = useState('demo-user-1') // TODO: Get from auth

  useEffect(() => {
    loadOnboarding()
  }, [params.whopId])

  const loadOnboarding = async () => {
    try {
      setLoading(true)
      
      // Load published config
      const configRes = await fetch(`/api/onboarding?whop_id=${params.whopId}&type=published`)
      if (!configRes.ok) {
        throw new Error('Onboarding not found')
      }
      const configData = await configRes.json()
      setConfig(configData)

      // Load user progress
      const progressRes = await fetch(`/api/onboarding/progress?whop_id=${params.whopId}&user_id=${userId}`)
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress(progressData)
      }
    } catch (error) {
      console.error('Error loading onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whop_id: params.whopId,
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whop_id: params.whopId,
        user_id: userId,
        completed: true,
      }),
    })
  }

  const handleXPChange = async (xp: number) => {
    setProgress(prev => ({ ...prev, xp }))
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
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

