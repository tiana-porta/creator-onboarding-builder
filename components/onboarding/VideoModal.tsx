'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'

interface InstructionalStep {
  step: string
  text: string
}

interface InstructionalContent {
  title: string
  steps: InstructionalStep[]
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoUrl?: string
  onVideoEnd: () => void
  onMarkWatched?: () => void
  isWatched?: boolean
  instructionalContent?: InstructionalContent
}

export function VideoModal({ isOpen, onClose, title, videoUrl, onVideoEnd, onMarkWatched, isWatched, instructionalContent }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [hasBeenWatched, setHasBeenWatched] = useState(isWatched || false)
  const [videoEnded, setVideoEnded] = useState(false)
  const { theme } = useTheme()

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
  
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null
  const isEmbed = !!embedUrl
  const isVideoFile = videoUrl && !embedUrl

  useEffect(() => {
    if (isOpen) {
      if (videoRef.current) {
        videoRef.current.load()
      }
      // If no video URL and no instructional content (placeholder), automatically mark as watched when modal opens
      if (!videoUrl && !instructionalContent && !hasBeenWatched && onMarkWatched) {
        onMarkWatched()
        setHasBeenWatched(true)
      }
    } else {
      // Reset state when modal closes (but keep watched status)
      setVideoProgress(0)
      setCurrentTime(0)
      setDuration(0)
      setVideoEnded(false)
    }
  }, [isOpen, videoUrl, instructionalContent, hasBeenWatched, onMarkWatched])

  // Ensure progress shows 100% when video ends or is paused at the end
  useEffect(() => {
    if (!isOpen || !videoUrl) return
    
    const checkEnd = () => {
      if (videoRef.current && videoRef.current.duration > 0) {
        const currentTime = videoRef.current.currentTime
        const duration = videoRef.current.duration
        // If paused/ended and very close to the end (within 0.5 seconds), force to 100%
        if ((videoRef.current.paused || videoRef.current.ended) && 
            (currentTime >= duration - 0.5 || Math.abs(currentTime - duration) < 0.5)) {
          setVideoEnded(true)
          setVideoProgress(100)
          setCurrentTime(duration)
        }
      }
    }
    
    // Check when video pauses or ends - use a timeout to ensure ref is ready
    const timeoutId = setTimeout(() => {
      const video = videoRef.current
      if (video) {
        video.addEventListener('pause', checkEnd)
        video.addEventListener('ended', checkEnd)
        // Also check immediately in case video already ended
        checkEnd()
      }
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      const video = videoRef.current
      if (video) {
        video.removeEventListener('pause', checkEnd)
        video.removeEventListener('ended', checkEnd)
      }
    }
  }, [isOpen, videoUrl, duration])

  useEffect(() => {
    if (isWatched) {
      setHasBeenWatched(true)
    }
  }, [isWatched])

  const handleTimeUpdate = () => {
    // Don't update if video has already ended
    if (videoEnded) {
      return
    }
    
    if (videoRef.current && videoRef.current.duration > 0) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      
      // Check if we're at or very near the end of the video (within 0.3 seconds)
      const isAtEnd = currentTime >= duration - 0.3 || Math.abs(currentTime - duration) < 0.3 || videoRef.current.ended
      
      if (isAtEnd) {
        // Force to 100% when at the end and mark as ended
        setVideoProgress(100)
        setCurrentTime(duration)
        setVideoEnded(true)
        
        // Mark as watched and close if not already done
        if (!hasBeenWatched) {
          onVideoEnd()
          setHasBeenWatched(true)
        }
        // Auto-close modal when at the end
        setTimeout(() => {
          onClose()
        }, 800)
      } else {
        // Calculate normal progress
        const progress = (currentTime / duration) * 100
        const safeProgress = isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress))
        setVideoProgress(safeProgress)
        setCurrentTime(currentTime)
        
        // Mark as watched if >= 95% complete (allows for slight timing issues)
        if (safeProgress >= 95 && !hasBeenWatched) {
          onVideoEnd()
          setHasBeenWatched(true)
        }
      }
    }
  }

  const handleVideoEnded = () => {
    // Mark video as ended and force progress to 100%
    setVideoEnded(true)
    
    if (videoRef.current) {
      const duration = videoRef.current.duration || 0
      // Force to 100% and use the actual duration
      setVideoProgress(100)
      setCurrentTime(duration)
    } else {
      // Fallback if ref is not available
      setVideoProgress(100)
    }
    
    if (!hasBeenWatched) {
      onVideoEnd()
      setHasBeenWatched(true)
    }
    
    // Auto-close modal after a short delay
    setTimeout(() => {
      onClose()
    }, 800)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    videoRef.current?.play()
  }

  const handlePause = () => {
    setIsPlaying(false)
    videoRef.current?.pause()
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) {
      return '0:00'
    }
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-dark border-2 border-primary/20 rounded-3xl p-6 max-w-4xl w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-primary/60 hover:text-primary transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Video Container */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                {isEmbed ? (
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl || ''}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                      title={title}
                    />
                  </div>
                ) : isVideoFile ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleVideoEnded}
                    className="w-full aspect-video"
                    controls
                  />
                ) : instructionalContent ? (
                  <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 min-h-[400px] flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">🔔</div>
                      <h3 className="text-2xl font-bold text-primary mb-2">{instructionalContent.title}</h3>
                    </div>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {instructionalContent.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4 bg-primary/5 rounded-lg p-4">
                          <div 
                            className="flex-shrink-0 w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-sm"
                            style={{ backgroundColor: theme.secondaryColor }}
                          >
                            {step.step}
                          </div>
                          <p className="text-primary/80 font-medium flex-1 pt-1">{step.text}</p>
                        </div>
                      ))}
                    </div>
                    {!hasBeenWatched && (
                      <div className="text-center mt-6">
                        <button
                          onClick={() => {
                            if (onMarkWatched) {
                              onMarkWatched()
                              setHasBeenWatched(true)
                            }
                          }}
                          className="px-6 py-2 text-white rounded-lg transition-all font-medium"
                          style={{ backgroundColor: theme.secondaryColor }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1'
                          }}
                        >
                          I Understand
                        </button>
                      </div>
                    )}
                    {hasBeenWatched && (
                      <div className="text-center mt-6">
                        <div className="font-bold" style={{ color: theme.secondaryColor }}>✓ Completed</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-primary/60 font-medium mb-4">No video configured</p>
                      <p className="text-xs text-primary/40 mb-4">Add a video URL in the admin dashboard</p>
                      {!hasBeenWatched && (
                        <button
                          onClick={() => {
                            if (onMarkWatched) {
                              onMarkWatched()
                              setHasBeenWatched(true)
                            }
                          }}
                          className="px-6 py-2 text-white rounded-lg transition-all font-medium"
                          style={{ backgroundColor: theme.secondaryColor }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1'
                          }}
                        >
                          Mark as Watched
                        </button>
                      )}
                      {hasBeenWatched && (
                        <div className="font-bold" style={{ color: theme.secondaryColor }}>✓ Watched</div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Mark as watched button for embeds */}
                {isEmbed && !hasBeenWatched && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (onMarkWatched) {
                          onMarkWatched()
                          setHasBeenWatched(true)
                        }
                      }}
                      className="px-6 py-2 text-white rounded-lg transition-all font-medium"
                      style={{ backgroundColor: theme.secondaryColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                    >
                      Mark as Watched
                    </button>
                  </div>
                )}
                
                {isEmbed && hasBeenWatched && (
                  <div className="mt-4 text-center">
                    <div className="font-bold" style={{ color: theme.secondaryColor }}>✓ Watched</div>
                  </div>
                )}

                {/* Video Progress */}
                {duration > 0 && !isEmbed && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/20 h-1">
                    <motion.div
                      className="h-full"
                      style={{ 
                        width: `${videoProgress}%`,
                        backgroundColor: theme.secondaryColor,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${videoProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Video Info */}
              {duration > 0 && !isEmbed && (
                <div className="flex items-center justify-between text-sm text-primary/60">
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  <span>{isNaN(videoProgress) ? '0' : Math.round(videoProgress)}% complete</span>
                </div>
              )}

              {/* Mark as watched button for embeds */}
              {isEmbed && !hasBeenWatched && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      if (onMarkWatched) {
                        onMarkWatched()
                        setHasBeenWatched(true)
                      }
                    }}
                    className="px-6 py-2 text-white rounded-lg transition-all font-medium"
                    style={{ backgroundColor: theme.secondaryColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                  >
                    Mark as Watched
                  </button>
                </div>
              )}
              
              {isEmbed && hasBeenWatched && (
                <div className="mt-4 text-center">
                  <div className="font-bold" style={{ color: theme.secondaryColor }}>✓ Watched</div>
                </div>
              )}

              <p className="text-sm text-primary/60 mt-4 text-center">
                {hasBeenWatched ? (
                  <span className="font-medium" style={{ color: theme.secondaryColor }}>✓ Video watched</span>
                ) : videoUrl ? (
                  isEmbed ? 'Watch the video and click "Mark as Watched" when done' : 'Watch the video to continue'
                ) : (
                  'Click "Mark as Watched" above'
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

