'use client'

import { GlassCard } from './GlassCard'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerCanvasConfetti } from '@/lib/onboarding/confetti'

interface Step4AccountabilityProps {
  storeUrl: string | null
  storeVerified: boolean
  onVerify: (url: string) => void
  onContinue: () => void
}

export function Step4Accountability({
  storeUrl,
  storeVerified,
  onVerify,
  onContinue,
}: Step4AccountabilityProps) {
  const [inputUrl, setInputUrl] = useState(storeUrl || '')
  const [error, setError] = useState('')

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false
    
    // Normalize URL - add https:// if no protocol is provided
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }
    
    try {
      const urlObj = new URL(normalizedUrl)
      // Must be https:// (normalize http:// to https://)
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') return false
      // Must be whop.com domain
      if (urlObj.hostname !== 'whop.com') return false
      // Must have a path after / (the store name)
      const path = urlObj.pathname
      if (!path || path === '/' || path.length <= 1) return false
      return true
    } catch {
      return false
    }
  }

  const handleVerify = () => {
    setError('')
    if (!inputUrl.trim()) {
      setError('Please enter a store URL')
      return
    }

    if (validateUrl(inputUrl)) {
      // Normalize the URL before saving (ensure it has https://)
      let normalizedUrl = inputUrl.trim()
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl
      }
      // Ensure it's https://
      if (normalizedUrl.startsWith('http://')) {
        normalizedUrl = normalizedUrl.replace('http://', 'https://')
      }
      onVerify(normalizedUrl)
      triggerCanvasConfetti()
    } else {
      setError('Please enter a valid Whop store URL (e.g., whop.com/your-store or https://whop.com/your-store)')
    }
  }

  const handleCreateStore = () => {
    window.open('/create', '_blank')
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          <span className="text-accent">Accountability</span> starts now.
        </h1>
        <p className="text-lg text-primary/70 mb-6">
          Drop your <span className="text-accent">Whop Store</span> link below. If you don't have one, create a whop. 
          We aren't moving forward until you have a <span className="text-accent">destination</span>.
        </p>
      </div>

      <GlassCard className="mb-6">
        <div className="mb-6">
          {!storeVerified && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-primary">Certification Progress:</span>
                <span className="text-sm font-bold text-primary/60">0% Certified</span>
              </div>
              <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value)
                setError('')
              }}
              placeholder="whop.com/your-store-name"
              disabled={storeVerified}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !storeVerified && inputUrl.trim()) {
                  handleVerify()
                }
              }}
              className={`
                flex-1 px-4 py-3 rounded-xl border-2 bg-dark/90 backdrop-blur-sm
                text-primary placeholder:text-primary/40
                ${error ? 'border-red-500 focus:border-red-500' : 'border-primary/20'}
                ${storeVerified ? 'opacity-60 cursor-not-allowed' : 'focus:border-accent'}
                focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all
              `}
            />
            <button
              onClick={handleVerify}
              disabled={storeVerified || !inputUrl.trim()}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap
                ${storeVerified
                  ? 'bg-accent text-white cursor-pointer'
                  : !inputUrl.trim()
                  ? 'bg-primary/10 text-primary/30 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20'
                }
              `}
            >
              {storeVerified ? 'Verified ✓' : 'Verify link'}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mb-4 font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {!storeVerified && !inputUrl.trim() && (
            <button
              onClick={handleCreateStore}
              className="w-full px-6 py-3 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent/10 transition-all"
            >
              Create a whop if you don't have one
            </button>
          )}
        </div>

        <AnimatePresence>
          {storeVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent rounded-2xl p-8 text-center"
            >
              <motion.div 
                className="mb-4 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <img 
                  src="/images/verified-builder.png" 
                  alt="Verified Builder"
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
              <h3 className="text-3xl font-bold text-accent mb-2">Verified Builder</h3>
              <p className="text-primary/70 mb-6">Your store has been verified! You're ready to build.</p>
              <motion.div 
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 rounded-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-accent font-bold text-lg">+100 XP</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          disabled={!storeVerified}
            className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${storeVerified
              ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
