'use client'

import { GlassCard } from './GlassCard'
import { VideoModal } from './VideoModal'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Step3DashboardProps {
  onContinue: () => void
}

const dashboardSections = [
  {
    id: 'library',
    title: 'The Library',
    subtitle: 'Course Modules',
    image: '/images/step3-1.png',
    description: 'Access all course modules and learning materials',
    // Video file should be placed in: public/videos/step3-library.mp4
    videoUrl: '/videos/step3-library.mp4',
  },
  {
    id: 'discussion',
    title: 'The Discussion Board',
    subtitle: 'Community',
    image: '/images/step3-2.png',
    description: 'Connect with other members and share insights',
    // Video file should be placed in: public/videos/step3-discussion.mp4
    videoUrl: '/videos/step3-discussion.mp4',
  },
  {
    id: 'feedback',
    title: 'Notification Settings',
    subtitle: 'Stay Connected',
    image: '/images/step3-3.png',
    description: 'Learn how to turn on notifications for important channels',
    // Video file should be placed in: public/videos/step3-notifications.mp4
    // If no video file exists, instructionalContent will be shown instead
    videoUrl: '/videos/step3-notifications.mp4',
    instructionalContent: {
      title: 'How to Turn On Notifications',
      steps: [
        {
          step: '1',
          text: 'Navigate to your channel settings or notification preferences',
        },
        {
          step: '2',
          text: 'Find the important channels like "Feedback Loop", "Weekly Mission", "The Sauce", and "The Audit"',
        },
        {
          step: '3',
          text: 'Toggle notifications ON for each channel you want to stay updated on',
        },
        {
          step: '4',
          text: 'Make sure to enable notifications for at least the Feedback Loop to get real-time support',
        },
      ],
    },
  },
  {
    id: 'support',
    title: 'The Support Room',
    subtitle: 'Help Center',
    image: '/images/step3-4.png',
    description: 'Find answers and get assistance',
    // Video file should be placed in: public/videos/step3-support.mp4
    videoUrl: '/videos/step3-support.mp4',
  },
  {
    id: 'stage',
    title: 'The Live Stage',
    subtitle: 'Live Sessions',
    image: '/images/step3-5.png',
    description: 'Join live sessions and workshops',
    live: 'Tuesday & Thursday at 4PM EST',
    // Video file should be placed in: public/videos/step3-stage.mp4
    videoUrl: '/videos/step3-stage.mp4',
  },
  {
    id: 'progress',
    title: 'Progress Tracker',
    subtitle: '$10K Club',
    image: '/images/step3-6.png',
    description: 'Track your progress to the inner circle and unlock more insight on how to keep growing',
    // Video file should be placed in: public/videos/step3-progress.mp4
    videoUrl: '/videos/step3-progress.mp4',
  },
]

export function Step3Dashboard({ onContinue }: Step3DashboardProps) {
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set())
  const [selectedModal, setSelectedModal] = useState<string | null>(null)

  const handleVideoEnd = (sectionId: string) => {
    setWatchedVideos((prev) => {
      if (!prev.has(sectionId)) {
        const newSet = new Set([...prev, sectionId])
        return newSet
      }
      return prev
    })
  }

  const handleMarkWatched = (sectionId: string) => {
    setWatchedVideos((prev) => {
      if (!prev.has(sectionId)) {
        const newSet = new Set([...prev, sectionId])
        return newSet
      }
      return prev
    })
  }

  const handleOpenModal = (sectionId: string) => {
    setSelectedModal(sectionId)
  }

  const allVideosWatched = dashboardSections.every((section) => watchedVideos.has(section.id))
  const selectedSection = dashboardSections.find((s) => s.id === selectedModal)

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Don't get <span className="text-accent">lost</span> in the <span className="text-accent">sauce</span>.
        </h1>
        <p className="text-lg text-primary/70 font-medium">
          Here is where you <span className="text-accent">live</span> now:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {dashboardSections.map((section, index) => {
          const isWatched = watchedVideos.has(section.id)
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                selected={isWatched}
                onClick={() => handleOpenModal(section.id)}
                hover={true}
              >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-primary">{section.title}</h3>
                    {isWatched && (
                      <span className="text-accent text-lg">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-accent font-semibold mb-2">{section.subtitle}</p>
                  <p className="text-sm text-primary/70 mb-2">{section.description}</p>
                  {section.live && (
                    <p className="text-xs text-accent font-medium">{section.live}</p>
                  )}
                </div>
              </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Video Modal */}
      {selectedSection && (
        <VideoModal
          isOpen={selectedModal === selectedSection.id}
          onClose={() => setSelectedModal(null)}
          title={selectedSection.title}
          videoUrl={selectedSection.videoUrl}
          onVideoEnd={() => handleVideoEnd(selectedSection.id)}
          onMarkWatched={() => handleMarkWatched(selectedSection.id)}
          isWatched={watchedVideos.has(selectedSection.id)}
          instructionalContent={selectedSection.instructionalContent}
        />
      )}

      {/* Continue Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={onContinue}
          disabled={!allVideosWatched}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${allVideosWatched
              ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30 cursor-pointer'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          whileHover={allVideosWatched ? { scale: 1.05 } : {}}
          whileTap={allVideosWatched ? { scale: 0.95 } : {}}
        >
          {allVideosWatched ? 'Continue' : `Watch all videos to continue (${watchedVideos.size}/${dashboardSections.length})`}
        </motion.button>
      </div>
    </div>
  )
}
