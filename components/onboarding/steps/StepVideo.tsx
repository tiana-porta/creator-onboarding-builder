'use client'

import { GlassCard } from '../GlassCard'
import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepVideoProps {
  config: StepConfig
  onContinue: () => void
}

export function StepVideo({ config, onContinue }: StepVideoProps) {
  const { theme } = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasWatched, setHasWatched] = useState(false)
  const [watchTime, setWatchTime] = useState(0)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(video.currentTime)
      setWatchTime(currentTime)
      
      if (config.minWatchTime && currentTime >= config.minWatchTime) {
        setHasWatched(true)
      } else if (!config.minWatchTime) {
        setHasWatched(true)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [config.minWatchTime])

  const canContinue = !config.requireWatch || hasWatched
  
  // Convert YouTube URLs to embed format
  const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null
    
    // If it's already an embed URL, return as-is
    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) {
      return url
    }
    
    // Convert YouTube watch URLs to embed
    const youtubeWatchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeWatchMatch) {
      return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`
    }
    
    // If it's already an embed URL or other iframe-compatible URL, return as-is
    if (url.includes('embed') || url.includes('iframe')) {
      return url
    }
    
    return null
  }
  
  const embedUrl = config.videoEmbedUrl ? getEmbedUrl(config.videoEmbedUrl) : null
  const videoUrl = embedUrl ? null : (config.videoUrl || config.videoEmbedUrl)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-6">
          {config.title}
        </h1>
        {config.description && (
          <p className="text-lg text-primary leading-relaxed font-medium mb-8">
            {config.description}
          </p>
        )}

        {(embedUrl || videoUrl) && (
          <GlassCard className="mb-8">
            <div className="aspect-video rounded-2xl mb-6 border border-primary/20 overflow-hidden bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  title={config.title || 'Video'}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl || ''}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  controls
                  loop
                />
              )}
            </div>
            {config.requireWatch && config.minWatchTime && (
              <p className="text-sm text-primary/60">
                Watch at least {config.minWatchTime}s ({watchTime}s / {config.minWatchTime}s)
              </p>
            )}
          </GlassCard>
        )}

        <motion.button
          onClick={onContinue}
          disabled={!canContinue}
          className={`
            px-12 py-4 rounded-xl font-bold text-xl transition-all
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

