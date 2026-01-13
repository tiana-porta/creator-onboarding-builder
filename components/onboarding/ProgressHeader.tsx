'use client'

import { motion } from 'framer-motion'

interface ProgressHeaderProps {
  currentStep: number
  totalSteps: number
  xp: number
  stepTitle: string
}

export function ProgressHeader({ currentStep, totalSteps, xp, stepTitle }: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">{stepTitle}</h2>
          <p className="text-sm text-primary/60 font-medium">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border-2 border-accent/20 shadow-sm">
          <span className="text-accent font-bold text-lg">{xp}</span>
          <span className="text-primary/70 text-sm font-semibold">XP</span>
        </div>
      </div>
      <div className="relative h-3 bg-primary/20 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent/90 rounded-full shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
