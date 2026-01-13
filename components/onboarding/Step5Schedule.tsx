'use client'

import { GlassCard } from './GlassCard'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Step5ScheduleProps {
  notifMission: boolean
  notifSauce: boolean
  notifAudit: boolean
  notifDaily: boolean
  onToggle: (key: 'notifMission' | 'notifSauce' | 'notifAudit' | 'notifDaily') => void
  onContinue: () => void
}

const steps = [
  {
    key: 'notifMission' as const,
    step: '1',
    description: 'Check announcements daily',
    highlightWord: 'daily',
  },
  {
    key: 'notifSauce' as const,
    step: '2',
    description: 'Enter the discussion board and interact with other creators',
    highlightWord: 'discussion board',
  },
  {
    key: 'notifAudit' as const,
    step: '3',
    description: 'Turn notifications on for our lives, we go live every tuesday and thursday',
    highlightWord: 'notifications',
  },
  {
    key: 'notifDaily' as const,
    step: '4',
    description: 'Get feedback in the discussion board when we drop growth framework',
    highlightWord: 'growth framework',
  },
]

const renderDescription = (description: string, highlightWord: string) => {
  const parts = description.split(new RegExp(`(${highlightWord})`, 'gi'))
  return parts.map((part, index) => 
    part.toLowerCase() === highlightWord.toLowerCase() ? (
      <span key={index} className="text-accent">{part}</span>
    ) : (
      part
    )
  )
}

export function Step5Schedule({
  notifMission,
  notifSauce,
  notifAudit,
  notifDaily,
  onToggle,
  onContinue,
}: Step5ScheduleProps) {
  const getValue = (key: typeof steps[0]['key']) => {
    switch (key) {
      case 'notifMission': return notifMission
      case 'notifSauce': return notifSauce
      case 'notifAudit': return notifAudit
      case 'notifDaily': return notifDaily
    }
  }

  const allChecked = notifMission && notifSauce && notifAudit && notifDaily

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">
          <span className="text-accent">Success</span> is a <span className="text-accent">habit</span>.
        </h1>
        <p className="text-lg text-primary/70 font-medium">
          Build your <span className="text-accent">rhythm of winning</span> by completing these daily habits.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((stepItem, index) => {
          const isChecked = getValue(stepItem.key)
          return (
            <motion.div
              key={stepItem.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                onClick={() => onToggle(stepItem.key)}
                selected={isChecked}
                hover={true}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer
                      ${isChecked 
                        ? 'bg-accent border-accent' 
                        : 'bg-transparent border-primary/30 hover:border-accent/50'
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggle(stepItem.key)
                    }}
                    >
                      {isChecked && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary">
                      Step {stepItem.step}. {renderDescription(stepItem.description, stepItem.highlightWord)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={onContinue}
          disabled={!allChecked}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${allChecked
              ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30 cursor-pointer'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          whileHover={allChecked ? { scale: 1.05 } : {}}
          whileTap={allChecked ? { scale: 0.95 } : {}}
        >
          {allChecked ? 'Continue' : `Check all steps to continue (${[notifMission, notifSauce, notifAudit, notifDaily].filter(Boolean).length}/${steps.length})`}
        </motion.button>
      </div>
    </div>
  )
}
