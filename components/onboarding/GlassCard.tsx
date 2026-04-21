'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  hover?: boolean
  style?: React.CSSProperties
}

export function GlassCard({ children, className = '', onClick, selected, hover = true, style }: GlassCardProps) {
  const { theme } = useTheme()
  
  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-dark/70 border-2 rounded-3xl p-6
        shadow-lg
        ${selected 
          ? 'shadow-2xl bg-dark/90' 
          : 'border-primary/20 shadow-primary/10'
        }
        ${hover && !selected ? 'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        ...(selected ? {
          borderColor: theme.secondaryColor,
          boxShadow: `0 25px 50px -12px ${theme.secondaryColor}4D`,
        } : {}),
        ...style,
      }}
      onClick={onClick}
      whileHover={hover && !selected ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
