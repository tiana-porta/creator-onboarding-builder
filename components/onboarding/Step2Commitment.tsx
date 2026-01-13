'use client'

import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'

interface Step2CommitmentProps {
  onCommit: () => void
}

export function Step2Commitment({ onCommit }: Step2CommitmentProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-6">
          This isn't a <span className="text-accent">hobby</span>.
        </h1>
        <p className="text-lg text-primary leading-relaxed font-medium mb-8">
          At <span className="text-accent">Whop University</span>, we follow the <span className="text-accent">Michelin Standard</span>. 
          To stay in this room, you have to <span className="text-accent">execute</span>.
        </p>

        <GlassCard className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <div className="text-center">
              <div className="text-7xl mb-4">🎬</div>
              <p className="text-primary/60 font-medium">Video Content Placeholder</p>
              <p className="text-xs text-primary/40 mt-2">Video embed will go here</p>
            </div>
          </div>
        </GlassCard>

        <motion.button
          onClick={onCommit}
          className="px-12 py-4 rounded-xl font-bold text-xl bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          I agree to make the commitment.
        </motion.button>
      </div>
    </div>
  )
}
