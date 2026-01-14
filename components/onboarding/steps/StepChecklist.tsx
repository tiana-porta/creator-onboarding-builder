'use client'

import { GlassCard } from '../GlassCard'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepChecklistProps {
  config: StepConfig
  initialChecked?: string[]
  onContinue: (checked: string[]) => void
}

const renderDescription = (description: string, highlightWord?: string, accentColor?: string) => {
  if (!highlightWord) return description
  const parts = description.split(new RegExp(`(${highlightWord})`, 'gi'))
  return parts.map((part, index) => 
    part.toLowerCase() === highlightWord.toLowerCase() ? (
      <span key={index} style={{ color: accentColor }}>{part}</span>
    ) : (
      part
    )
  )
}

export function StepChecklist({ config, initialChecked = [], onContinue }: StepChecklistProps) {
  const { theme } = useTheme()
  const [checked, setChecked] = useState<string[]>(initialChecked)
  const checklistItems = config.checklistItems || []

  const toggleItem = (id: string) => {
    setChecked(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const allChecked = checklistItems.length > 0 && checklistItems.every(item => checked.includes(item.id))
  const checkedCount = checked.length
  const totalCount = checklistItems.length

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {config.title}
        </h1>
        {config.description && (
          <p className="text-lg text-primary/70 font-medium">
            {config.description}
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {checklistItems.map((item, index) => {
          const isChecked = checked.includes(item.id)
          const stepNumber = (item as any).stepNumber || String(index + 1)
          const highlightWord = (item as any).highlightWord
          const displayText = item.description || item.label
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                onClick={() => toggleItem(item.id)}
                selected={isChecked}
                hover={true}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div 
                      className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer
                        ${isChecked 
                          ? '' 
                          : 'bg-transparent border-primary/30'
                        }
                      `}
                      style={isChecked ? {
                        backgroundColor: theme.secondaryColor,
                        borderColor: theme.secondaryColor,
                      } : {}}
                      onMouseEnter={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.borderColor = `${theme.secondaryColor}80`
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleItem(item.id)
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
                      {stepNumber && `Step ${stepNumber}. `}
                      {highlightWord ? renderDescription(displayText, highlightWord, theme.secondaryColor) : displayText}
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
          onClick={() => onContinue(checked)}
          disabled={!allChecked}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${allChecked
              ? 'text-white shadow-lg cursor-pointer'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          style={allChecked ? {
            backgroundColor: theme.secondaryColor,
            boxShadow: `0 10px 15px -3px ${theme.secondaryColor}4D, 0 4px 6px -2px ${theme.secondaryColor}33`,
          } : {}}
          onMouseEnter={(e) => {
            if (allChecked) {
              e.currentTarget.style.opacity = '0.9'
            }
          }}
          onMouseLeave={(e) => {
            if (allChecked) {
              e.currentTarget.style.opacity = '1'
            }
          }}
          whileHover={allChecked ? { scale: 1.05 } : {}}
          whileTap={allChecked ? { scale: 0.95 } : {}}
        >
          {allChecked ? (config.ctaLabel || 'Continue') : `Check all steps to continue (${checkedCount}/${totalCount})`}
        </motion.button>
      </div>
    </div>
  )
}

