'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '../GlassCard'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig, ChoiceOption } from '@/lib/onboarding/config-types'

interface StepChoiceProps {
  config: StepConfig
  selectedValue?: string | string[]
  onSelect: (value: string) => void
  onContinue: (data?: any) => void
}

export function StepChoice({ config, selectedValue, onSelect, onContinue }: StepChoiceProps) {
  const { theme } = useTheme()
  const options = (config.options || []) as ChoiceOption[]
  const isSelected = (id: string) => {
    if (Array.isArray(selectedValue)) {
      return selectedValue.includes(id)
    }
    return selectedValue === id
  }
  const canContinue = selectedValue !== undefined && selectedValue !== null && 
    (Array.isArray(selectedValue) ? selectedValue.length > 0 : true)

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {config.title}
        </h1>
        {config.description && (
          <p className="text-lg text-primary/70">
            {config.description}
          </p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${options.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mb-10`}>
        {options.map((option) => (
          <GlassCard
            key={option.id}
            selected={isSelected(option.id)}
            onClick={() => onSelect(option.id)}
            hover={true}
          >
            <div className="text-center">
              {option.emoji && (
                <motion.div 
                  className="mb-4 flex justify-center text-6xl"
                  animate={isSelected(option.id) ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {option.emoji}
                </motion.div>
              )}
              {option.imageUrl && (
                <motion.div 
                  className="mb-4 flex justify-center"
                  animate={isSelected(option.id) ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img 
                    src={option.imageUrl} 
                    alt={option.title}
                    className="w-24 h-24 object-contain"
                  />
                </motion.div>
              )}
              <h3 className="text-2xl font-bold text-primary mb-2">{option.title}</h3>
              {option.subtitle && (
                <p className="text-sm font-semibold mb-3" style={{ color: theme.secondaryColor }}>
                  {option.subtitle}
                </p>
              )}
              {option.description && (
                <p className="text-sm text-primary/70 leading-relaxed">{option.description}</p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={onContinue}
          disabled={!canContinue}
          className={`
            px-10 py-4 rounded-xl font-semibold text-lg transition-all
            ${canContinue
              ? `bg-[${theme.secondaryColor}] text-white hover:opacity-90 shadow-lg`
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          style={canContinue ? { backgroundColor: theme.secondaryColor } : {}}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
        >
          {config.ctaLabel || 'Continue'}
        </motion.button>
      </div>
    </div>
  )
}

