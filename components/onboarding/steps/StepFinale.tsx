'use client'

import { GlassCard } from '../GlassCard'
import { motion } from 'framer-motion'
import { triggerCanvasConfetti } from '@/lib/onboarding/confetti'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepFinaleProps {
  config: StepConfig
  progressData?: Record<string, any>
  xp: number
  onComplete: () => void
}

const renderText = (text: string, accentColor: string) => {
  // Support highlighting words wrapped in <span class="text-accent"> tags or markdown-style **text**
  const parts = text.split(/(<span class="text-accent">.*?<\/span>|\*\*.*?\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('<span class="text-accent">')) {
      const content = part.replace(/<span class="text-accent">|<\/span>/g, '')
      return <span key={index} style={{ color: accentColor }}>{content}</span>
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.replace(/\*\*/g, '')
      return <span key={index} style={{ color: accentColor }}>{content}</span>
    }
    return part
  })
}

export function StepFinale({ config, progressData = {}, xp, onComplete }: StepFinaleProps) {
  const { theme } = useTheme()
  const router = useRouter()

  const handleComplete = () => {
    if (config.showConfetti !== false) {
      triggerCanvasConfetti()
    }
    onComplete()
    if (config.ctaUrl) {
      router.push(config.ctaUrl)
    }
  }

  const completionMessage = config.completionMessage || config.description || ''
  const canComplete = !(config as any).requireAllProgress || Object.keys(progressData).length > 0

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="text-center">
          <div className="mb-8">
            {config.emoji && (
              <motion.div 
                className="mb-6 flex justify-center text-8xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                {config.emoji}
              </motion.div>
            )}
            {config.mediaUrl && (
              <motion.div 
                className="mb-6 flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <img 
                  src={config.mediaUrl} 
                  alt="Completion"
                  className="w-32 h-32 object-contain"
                />
              </motion.div>
            )}
            <h1 className="text-5xl font-bold text-primary mb-5">
              {renderText(config.title || '', theme.secondaryColor)}
            </h1>
            {completionMessage && (
              <p className="text-xl text-primary/70 mb-8 leading-relaxed font-medium">
                {renderText(completionMessage, theme.secondaryColor)}
              </p>
            )}
          </div>

          {xp > 0 && (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 mb-8 border border-primary/20">
              <div className="text-center">
                <p className="text-sm text-primary/60 mb-2 font-medium">Total XP</p>
                <p className="text-4xl font-bold text-primary">{xp}</p>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`
              w-full px-8 py-4 rounded-xl font-bold text-xl transition-all
              ${canComplete
                ? 'text-white shadow-lg'
                : 'bg-primary/10 text-primary/30 cursor-not-allowed'
              }
            `}
            style={canComplete ? {
              backgroundColor: theme.secondaryColor,
              boxShadow: `0 10px 15px -3px ${theme.secondaryColor}4D, 0 4px 6px -2px ${theme.secondaryColor}33`,
            } : {}}
            onMouseEnter={(e) => {
              if (canComplete) {
                e.currentTarget.style.opacity = '0.9'
              }
            }}
            onMouseLeave={(e) => {
              if (canComplete) {
                e.currentTarget.style.opacity = '1'
              }
            }}
            whileHover={canComplete ? { scale: 1.02 } : {}}
            whileTap={canComplete ? { scale: 0.98 } : {}}
          >
            {config.ctaLabel || 'Complete'}
          </motion.button>

          {!canComplete && (config as any).requireAllProgress && (
            <p className="mt-4 text-sm text-primary/60">
              Complete all previous steps to continue
            </p>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

