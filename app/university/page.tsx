'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/hooks'
import { GlassCard } from '@/components/onboarding/GlassCard'

export default function UniversityPage() {
  const router = useRouter()
  const { state, isHydrated } = useOnboarding()

  useEffect(() => {
    if (!isHydrated) return

    // Redirect if Step 4 not completed
    if (!state.storeVerified) {
      router.push('/onboarding?step=4')
    }
  }, [state.storeVerified, isHydrated, router])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  if (!state.storeVerified) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4 relative overflow-hidden">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Welcome to <span className="text-accent">Whop University</span>
          </h1>
          <p className="text-xl text-primary/70">
            Your journey to <span className="text-accent">$10k</span> starts here.
          </p>
        </div>

        <GlassCard className="mb-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <img 
                src="/images/congratulations.png" 
                alt="Congratulations"
                className="w-32 h-32 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-primary/70 mb-6">
              You've completed onboarding and are now a certified member of Whop University.
            </p>
            <div className="bg-primary/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-primary/60 mb-1">Class</p>
                  <p className="text-xl font-bold text-primary">
                    {state.selectedClass
                      ? state.selectedClass === 'architect' ? 'The Architect'
                        : state.selectedClass === 'sensei' ? 'The Sensei'
                        : state.selectedClass === 'builder' ? 'The Builder'
                        : state.selectedClass.charAt(0).toUpperCase() + state.selectedClass.slice(1)
                      : 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-accent">{state.xp}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="/images/step3-1.png" 
                  alt="The Library"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">The Library</h3>
                <p className="text-primary/70 mb-4">
                  Access all course modules and learning materials.
                </p>
                <a 
                  href="https://whop.com/joined/whop/education-dZiIvJxokT9ifc/app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                >
                  Explore Modules
                </a>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="/images/step3-2.png" 
                  alt="Discussion Board"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">Discussion Board</h3>
                <p className="text-primary/70 mb-4">
                  Connect with other members and share insights.
                </p>
                <a 
                  href="https://whop.com/joined/whop/discussion-board-C5EsWrYvdTPUEm/app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                >
                  Join Discussion
                </a>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Centered Live Stage */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src="/images/step3-5.png" 
                    alt="Live Stage"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-3">Live Stage</h3>
                  <p className="text-primary/70 mb-4">
                    Join live sessions and workshops.
                  </p>
                  <a 
                    href="https://whop.com/joined/whop/livestreams-Uawr04PqibrAYZ/app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                  >
                    View Schedule
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-all"
          >
            Back to Onboarding
          </button>
        </div>
      </div>
    </div>
  )
}
