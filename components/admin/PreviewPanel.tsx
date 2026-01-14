'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/lib/theme/ThemeProvider'
import { OnboardingRenderer } from '../onboarding/OnboardingRenderer'
import type { OnboardingConfig } from '@/lib/onboarding/config-types'

interface PreviewPanelProps {
  config: OnboardingConfig
}

export function PreviewPanel({ config }: PreviewPanelProps) {
  const [previewProgress, setPreviewProgress] = useState({
    currentStep: 1,
    xp: 0,
    stepData: {} as Record<string, any>,
    completed: false,
  })

  const handleStepComplete = (stepIndex: number, data: any) => {
    setPreviewProgress(prev => ({
      ...prev,
      stepData: { ...prev.stepData, ...data },
    }))
  }

  const handleComplete = () => {
    setPreviewProgress(prev => ({ ...prev, completed: true }))
  }

  const handleXPChange = (xp: number) => {
    setPreviewProgress(prev => ({ ...prev, xp }))
  }

  const resetPreview = () => {
    setPreviewProgress({
      currentStep: 1,
      xp: 0,
      stepData: {},
      completed: false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Preview</h2>
        <button
          onClick={resetPreview}
          className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
        >
          Reset Preview
        </button>
      </div>

      <div className="border-4 border-primary/20 rounded-xl overflow-hidden">
        <div className="bg-primary/5 px-4 py-2 border-b border-primary/20">
          <p className="text-sm text-primary/70">Preview Mode - This is how buyers will see your onboarding</p>
        </div>
        <div className="bg-white">
          <ThemeProvider theme={config.theme}>
            <OnboardingRenderer
              config={config}
              userProgress={previewProgress}
              onStepComplete={handleStepComplete}
              onComplete={handleComplete}
              onXPChange={handleXPChange}
            />
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}

