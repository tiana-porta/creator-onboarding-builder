'use client'

import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Step2CommitmentProps {
  onCommit: () => void
}

export function Step2Commitment({ onCommit }: Step2CommitmentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      console.error('Video error details:', video.error)
    }

    const handleLoadStart = () => {
      console.log('Video load started')
    }

    const handleCanPlay = () => {
      console.log('Video can play')
    }

    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

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
          <div className="aspect-video rounded-2xl mb-6 border border-primary/20 overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              controls
              loop
              preload="auto"
              crossOrigin="anonymous"
            >
              <source src="/videos/commitment-video.mp4" type="video/mp4" />
              <source src="/videos/commitment-video.mp4" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
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
