'use client'

import { GlassCard } from '../GlassCard'
import { VideoModal } from '../VideoModal'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepTourProps {
  config: StepConfig
  onContinue: () => void
}

export function StepTour({ config, onContinue }: StepTourProps) {
  const { theme } = useTheme()
  const tourItems = config.tourItems || []
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set())
  const [selectedModal, setSelectedModal] = useState<string | null>(null)

  const handleVideoEnd = (itemId: string) => {
    setWatchedVideos((prev) => {
      if (!prev.has(itemId)) {
        return new Set([...prev, itemId])
      }
      return prev
    })
  }

  const handleMarkWatched = (itemId: string) => {
    setWatchedVideos((prev) => {
      if (!prev.has(itemId)) {
        return new Set([...prev, itemId])
      }
      return prev
    })
  }

  const handleOpenModal = (itemId: string) => {
    setSelectedModal(itemId)
  }

  const allVideosWatched = tourItems.length > 0 && tourItems.every((item) => {
    const itemId = (item as any).id || item.title
    return !(item as any).videoUrl || watchedVideos.has(itemId)
  })
  
  const selectedItem = tourItems.find((item) => {
    const itemId = (item as any).id || item.title
    return itemId === selectedModal
  })

  return (
    <div className="w-full max-w-5xl mx-auto">
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

      {tourItems.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <p className="text-primary/70">No tour items configured. Please add items in the admin dashboard.</p>
          </div>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tourItems.map((item, index) => {
              const itemId = (item as any).id || item.title
              const isWatched = watchedVideos.has(itemId)
              const hasVideo = !!(item as any).videoUrl
              
              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    selected={isWatched}
                    onClick={hasVideo ? () => handleOpenModal(itemId) : undefined}
                    hover={hasVideo}
                  >
                    <div className="flex items-start gap-4">
                      {(item.imageUrl || (item as any).image) && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.imageUrl || (item as any).image} 
                            alt={item.title}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                          {isWatched && (
                            <span className="text-lg" style={{ color: theme.secondaryColor }}>✓</span>
                          )}
                        </div>
                        {(item as any).subtitle && (
                          <p className="text-sm font-semibold mb-2" style={{ color: theme.secondaryColor }}>{(item as any).subtitle}</p>
                        )}
                        <p className="text-sm text-primary/70 mb-2">{item.description}</p>
                        {(item as any).live && (
                          <p className="text-xs font-medium" style={{ color: theme.secondaryColor }}>{(item as any).live}</p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          {/* Video Modal */}
          {selectedItem && (selectedItem as any).videoUrl && (
            <VideoModal
              isOpen={selectedModal === ((selectedItem as any).id || selectedItem.title)}
              onClose={() => setSelectedModal(null)}
              title={selectedItem.title}
              videoUrl={(selectedItem as any).videoUrl}
              onVideoEnd={() => handleVideoEnd((selectedItem as any).id || selectedItem.title)}
              onMarkWatched={() => handleMarkWatched((selectedItem as any).id || selectedItem.title)}
              isWatched={watchedVideos.has((selectedItem as any).id || selectedItem.title)}
              instructionalContent={(selectedItem as any).instructionalContent}
            />
          )}
        </>
      )}

      {/* Continue Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={onContinue}
          disabled={!allVideosWatched && tourItems.some(item => !!(item as any).videoUrl)}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl)
              ? 'text-white shadow-lg cursor-pointer'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          style={(allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl)) ? {
            backgroundColor: theme.secondaryColor,
            boxShadow: `0 10px 15px -3px ${theme.secondaryColor}4D, 0 4px 6px -2px ${theme.secondaryColor}33`,
          } : {}}
          onMouseEnter={(e) => {
            if (allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl)) {
              e.currentTarget.style.opacity = '0.9'
            }
          }}
          onMouseLeave={(e) => {
            if (allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl)) {
              e.currentTarget.style.opacity = '1'
            }
          }}
          whileHover={allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl) ? { scale: 1.05 } : {}}
          whileTap={allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl) ? { scale: 0.95 } : {}}
        >
          {allVideosWatched || !tourItems.some(item => !!(item as any).videoUrl)
            ? (config.ctaLabel || 'Continue')
            : `Watch all videos to continue (${watchedVideos.size}/${tourItems.filter(item => !!(item as any).videoUrl).length})`
          }
        </motion.button>
      </div>
    </div>
  )
}

