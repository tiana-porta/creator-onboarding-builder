'use client'

import { motion } from 'framer-motion'
import { useAdminCheck } from '@/lib/hooks/useAdminCheck'
import { useTheme } from '@/lib/theme/ThemeProvider'

interface ProgressHeaderProps {
  currentStep: number
  totalSteps: number
  xp: number
  stepTitle: string
  onAdminTabClick?: () => void
  showAdminTab?: boolean
}

export function ProgressHeader({ 
  currentStep, 
  totalSteps, 
  xp, 
  stepTitle,
  onAdminTabClick,
  showAdminTab = false
}: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100
  const { isAdmin, loading } = useAdminCheck()
  const shouldShowAdminTab = showAdminTab && !loading && isAdmin === true
  const { theme } = useTheme()

  return (
    <div className="w-full mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary mb-2">{stepTitle}</h2>
          <p className="text-sm text-primary/60 font-medium">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {shouldShowAdminTab && onAdminTabClick && (
            <motion.button
              onClick={onAdminTabClick}
              className="px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all"
              style={{
                borderColor: `${theme.secondaryColor}4D`,
                color: theme.secondaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.secondaryColor}1A`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔧 Admin
            </motion.button>
          )}
          <div 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm"
            style={{
              backgroundColor: `${theme.secondaryColor}1A`,
              border: `2px solid ${theme.secondaryColor}33`,
            }}
          >
            <span className="font-bold text-lg" style={{ color: theme.secondaryColor }}>{xp}</span>
            <span className="text-primary/70 text-sm font-semibold">XP</span>
          </div>
        </div>
      </div>
      <div className="relative h-3 bg-primary/20 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full shadow-sm"
          style={{
            background: `linear-gradient(to right, ${theme.secondaryColor}, ${theme.secondaryColor}E6)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
