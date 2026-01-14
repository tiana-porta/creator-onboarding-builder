'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepChoice } from './steps/StepChoice'
import { StepVideo } from './steps/StepVideo'
import { StepTour } from './steps/StepTour'
import { StepForm } from './steps/StepForm'
import { StepChecklist } from './steps/StepChecklist'
import { StepFinale } from './steps/StepFinale'
import { ProgressHeader } from './ProgressHeader'
import { WelcomeScreenConfigurable } from './WelcomeScreenConfigurable'
import type { OnboardingConfig, StepConfig } from '@/lib/onboarding/config-types'

interface OnboardingRendererProps {
  config: OnboardingConfig
  userProgress?: {
    currentStep: number
    xp: number
    stepData?: Record<string, any>
    completed: boolean
  }
  onStepComplete: (stepIndex: number, data: any) => void
  onComplete: () => void
  onXPChange: (xp: number) => void
  showAdminTab?: boolean
  onAdminTabClick?: () => void
}

export function OnboardingRenderer({
  config,
  userProgress = { currentStep: 1, xp: 0, completed: false },
  onStepComplete,
  onComplete,
  onXPChange,
  showAdminTab = false,
  onAdminTabClick,
}: OnboardingRendererProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(userProgress.currentStep - 1)
  const [stepData, setStepData] = useState<Record<string, any>>(userProgress.stepData || {})
  const [xp, setXP] = useState(userProgress.xp)

  // Get enabled steps sorted by order
  const enabledSteps = config.steps
    .filter(step => step.enabled)
    .sort((a, b) => a.order - b.order)

  const currentStep = enabledSteps[currentStepIndex]
  const totalSteps = enabledSteps.length
  const [welcomeCompleted, setWelcomeCompleted] = useState(false)

  const addXP = (amount: number) => {
    const newXP = xp + amount
    setXP(newXP)
    onXPChange(newXP)
  }

  const handleStepComplete = (data: any) => {
    const stepId = currentStep.id
    const newStepData = { ...stepData, [stepId]: data }
    setStepData(newStepData)

    // Award XP if configured
    if (currentStep.xpReward) {
      addXP(currentStep.xpReward)
    }

    // Call the completion handler
    onStepComplete(currentStepIndex, { ...data, stepId })

    // Move to next step or complete
    if (currentStepIndex < enabledSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const renderStep = () => {
    if (!currentStep) return null

    const stepProps = {
      config: currentStep,
      onContinue: handleStepComplete,
    }

    switch (currentStep.type) {
      case 'choice':
        return (
          <StepChoice
            {...stepProps}
            selectedValue={stepData[currentStep.id]}
            onSelect={(value) => {
              setStepData(prev => ({ ...prev, [currentStep.id]: value }))
            }}
          />
        )
      case 'video':
        return <StepVideo {...stepProps} />
      case 'tour':
        return <StepTour {...stepProps} />
      case 'form':
        return (
          <StepForm
            {...stepProps}
            initialData={stepData[currentStep.id] || {}}
            onContinue={(data) => handleStepComplete(data)}
          />
        )
      case 'checklist':
        return (
          <StepChecklist
            {...stepProps}
            initialChecked={stepData[currentStep.id] || []}
            onContinue={(checked) => handleStepComplete(checked)}
          />
        )
      case 'finale':
        return (
          <StepFinale
            {...stepProps}
            progressData={stepData}
            xp={xp}
            onComplete={onComplete}
          />
        )
      default:
        return <div>Unknown step type: {currentStep.type}</div>
    }
  }

  // Show welcome screen if not completed
  if (!welcomeCompleted && (config.welcomeTitle || config.welcomeSubtitle || !config.welcomeCompleted)) {
    return (
      <WelcomeScreenConfigurable
        title={config.welcomeTitle}
        subtitle={config.welcomeSubtitle}
        onContinue={() => setWelcomeCompleted(true)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
          style={{ backgroundColor: config.theme.secondaryColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-10"
          style={{ backgroundColor: config.theme.secondaryColor, animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-15"
          style={{ backgroundColor: config.theme.secondaryColor, animationDelay: '2s' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ProgressHeader
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
          xp={xp}
          stepTitle={currentStep?.title || ''}
          onAdminTabClick={onAdminTabClick}
          showAdminTab={showAdminTab}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {currentStepIndex > 0 && (
          <div className="mt-10 flex justify-center">
            <motion.button
              onClick={handlePrevious}
              className="px-6 py-3 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

