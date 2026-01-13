'use client'

// Mark as dynamic to avoid static generation issues with WhopApp
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboarding } from '@/lib/onboarding/hooks'
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen'
import { ProgressHeader } from '@/components/onboarding/ProgressHeader'
import { Step1Identity } from '@/components/onboarding/Step1Identity'
import { Step2Commitment } from '@/components/onboarding/Step2Commitment'
import { Step3Dashboard } from '@/components/onboarding/Step3Dashboard'
import { Step4Accountability } from '@/components/onboarding/Step4Accountability'
import { Step5Schedule } from '@/components/onboarding/Step5Schedule'
import { Step6Gateway } from '@/components/onboarding/Step6Gateway'

const STEP_TITLES = [
  'Choose Your Class',
  'The Commitment',
  'Finding Your Gear',
  'Accountability Starts Now',
  'Rhythm of Winning',
  'The Final Gateway',
]

export default function OnboardingPage() {
  const {
    state,
    isHydrated,
    selectClass,
    updateState,
    addXP,
    nextStep,
    previousStep,
    completeOnboarding,
  } = useOnboarding()

  // Check for reset parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const params = new URLSearchParams(window.location.search)
      if (params.get('reset') === 'true') {
        localStorage.removeItem('whop_u_onboarding_v1')
        window.location.href = '/onboarding'
      }
    }
  }, [isHydrated])

  // Send webhook on step changes and completion
  useEffect(() => {
    if (!isHydrated) return

    const sendWebhook = async (event: string, data: any) => {
      try {
        await fetch('/api/webhooks/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
        })
      } catch (error) {
        console.error('Failed to send webhook:', error)
      }
    }

    // Track onboarding start (first time step > 0)
    if (state.step > 0 && state.step === 1 && state.startedAt) {
      sendWebhook('onboarding_started', {
        email: state.email,
        step: state.step,
        xp: state.xp,
        startedAt: state.startedAt,
      })
    }

    // Track step progress
    if (state.step > 0) {
      sendWebhook('step_progress', {
        email: state.email,
        step: state.step,
        xp: state.xp,
        selectedClass: state.selectedClass,
        storeVerified: state.storeVerified,
        storeUrl: state.storeUrl,
        startedAt: state.startedAt,
      })
    }

    // Track completion
    if (state.completedAt) {
      sendWebhook('onboarding_completed', {
        email: state.email,
        step: state.step,
        xp: state.xp,
        selectedClass: state.selectedClass,
        storeUrl: state.storeUrl,
        storeVerified: state.storeVerified,
        completedAt: state.completedAt,
        startedAt: state.startedAt,
      })
    }
  }, [state.step, state.completedAt, state.xp, isHydrated])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const handleWelcomeContinue = () => {
    updateState({ welcomeCompleted: true })
  }

  const handleStep1Continue = () => {
    addXP(25)
    nextStep()
  }

  const handleStep2Commit = () => {
    updateState({ commitmentAccepted: true })
    addXP(50)
    nextStep()
  }

  const handleStep3Continue = () => {
    addXP(25)
    nextStep()
  }

  const handleStep4Verify = (url: string) => {
    updateState({
      storeUrl: url,
      storeVerified: true,
    })
    addXP(100)
  }

  const handleStep4Continue = () => {
    if (state.storeVerified) {
      nextStep()
    }
  }

  const handleStep5Toggle = (key: 'notifMission' | 'notifSauce' | 'notifAudit' | 'notifDaily') => {
    updateState({ [key]: !state[key] })
    addXP(10)
  }

  const handleStep5Continue = () => {
    addXP(50)
    nextStep()
  }

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1Identity
            selectedClass={state.selectedClass}
            onSelectClass={selectClass}
            onContinue={handleStep1Continue}
          />
        )
      case 2:
        return <Step2Commitment onCommit={handleStep2Commit} />
      case 3:
        return (
          <Step3Dashboard
            onContinue={handleStep3Continue}
          />
        )
      case 4:
        return (
          <Step4Accountability
            storeUrl={state.storeUrl}
            storeVerified={state.storeVerified}
            onVerify={handleStep4Verify}
            onContinue={handleStep4Continue}
          />
        )
      case 5:
        return (
          <Step5Schedule
            notifMission={state.notifMission}
            notifSauce={state.notifSauce}
            notifAudit={state.notifAudit}
            notifDaily={state.notifDaily}
            onToggle={handleStep5Toggle}
            onContinue={handleStep5Continue}
          />
        )
      case 6:
        return (
          <Step6Gateway
            selectedClass={state.selectedClass}
            storeVerified={state.storeVerified}
            xp={state.xp}
            onComplete={completeOnboarding}
          />
        )
      default:
        return null
    }
  }

  // Show welcome screen first if not completed
  // Check if welcomeCompleted exists and is explicitly false/undefined (not set)
  if (state.welcomeCompleted === false || state.welcomeCompleted === undefined) {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />
  }

  return (
    <div className="min-h-screen bg-dark py-8 px-4 relative overflow-hidden">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ProgressHeader
          currentStep={state.step}
          totalSteps={6}
          xp={state.xp}
          stepTitle={STEP_TITLES[state.step - 1]}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {state.step > 1 && (
          <div className="mt-10 flex justify-center">
            <motion.button
              onClick={previousStep}
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
