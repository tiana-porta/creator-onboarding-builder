'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'

interface WelcomeScreenConfigurableProps {
  title?: string
  subtitle?: string
  onContinue: () => void
}

export function WelcomeScreenConfigurable({ title, subtitle, onContinue }: WelcomeScreenConfigurableProps) {
  const { theme } = useTheme()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Small delay for animations
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const displayTitle = title || 'Welcome to Your Store'
  const displaySubtitle = subtitle || 'Where the future begins'

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(250, 70, 22, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 70, 22, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Glowing orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
        style={{ backgroundColor: theme.secondaryColor }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-10"
        style={{ backgroundColor: theme.secondaryColor, animationDelay: '1s' }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Animated text reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black text-primary mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block">{displayTitle}</span>
          </motion.h1>
        </motion.div>

        {/* Subtitle with animated gradient */}
        <motion.p
          className="text-xl md:text-2xl text-primary/70 font-light mb-16 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {displaySubtitle}
        </motion.p>

        {/* Animated lines/decoration */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="h-px w-32"
            style={{
              background: `linear-gradient(to right, transparent, ${theme.secondaryColor}, transparent)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.secondaryColor }}
          />
          <motion.div
            className="h-px w-32"
            style={{
              background: `linear-gradient(to right, transparent, ${theme.secondaryColor}, transparent)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </motion.div>

        {/* Continue button */}
        <motion.button
          onClick={onContinue}
          disabled={!isReady}
          className={`
            relative px-16 py-5 rounded-xl font-bold text-lg
            text-white hover:opacity-90
            shadow-lg
            transition-all duration-300
            overflow-hidden group
            ${isReady ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-not-allowed'}
          `}
          style={{ 
            backgroundColor: theme.secondaryColor,
            boxShadow: `0 10px 40px ${theme.secondaryColor}50`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 tracking-wider">Get Started</span>
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        </motion.button>

        {/* Bottom decorative elements */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-8 rounded-full opacity-30"
                style={{ backgroundColor: theme.secondaryColor }}
                animate={{
                  height: [32, 16, 32],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Corner accents */}
      <div 
        className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 opacity-30"
        style={{ borderColor: theme.secondaryColor }}
      />
      <div 
        className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 opacity-30"
        style={{ borderColor: theme.secondaryColor }}
      />
      <div 
        className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 opacity-30"
        style={{ borderColor: theme.secondaryColor }}
      />
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 opacity-30"
        style={{ borderColor: theme.secondaryColor }}
      />
    </div>
  )
}

