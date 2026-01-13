'use client'

import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'
import { triggerCanvasConfetti } from '@/lib/onboarding/confetti'
import { useRouter } from 'next/navigation'

interface Step6GatewayProps {
  selectedClass: string | null
  storeVerified: boolean
  xp: number
  onComplete: () => void
}

const classNames: Record<string, string> = {
  architect: 'The Architect',
  sensei: 'The Sensei',
  builder: 'The Builder',
}

const getClassName = (classType: string | null): string => {
  if (!classType) return 'Not selected'
  return classNames[classType] || classType.charAt(0).toUpperCase() + classType.slice(1)
}

export function Step6Gateway({ selectedClass, storeVerified, xp, onComplete }: Step6GatewayProps) {
  const router = useRouter()

  const handleEnter = () => {
    if (storeVerified) {
      triggerCanvasConfetti()
      onComplete()
      router.push('/university')
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="text-center">
          <div className="mb-8">
            <motion.div 
              className="mb-6 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <img 
                src="/images/graduate.png" 
                alt="Graduate"
                className="w-32 h-32 object-contain"
              />
            </motion.div>
            <h1 className="text-5xl font-bold text-primary mb-5">
              You're <span className="text-accent">in</span>.
            </h1>
            <p className="text-xl text-primary/70 mb-8 leading-relaxed font-medium">
              You've made the <span className="text-accent">commitment</span>, found your <span className="text-accent">support</span>, and initialized your store. 
              Execute the modules, use the templates, and let's get you to <span className="text-accent">$10k</span>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 mb-8 border border-primary/20">
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm text-primary/60 mb-2 font-medium">Class</p>
                <p className="text-xl font-bold text-primary">
                  {getClassName(selectedClass)}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary/60 mb-2 font-medium">Status</p>
                <p className="text-xl font-bold text-accent">
                  {storeVerified ? 'Certified' : 'Pending'}
                </p>
              </div>
              <div className="col-span-2 pt-4 border-t border-primary/10">
                <p className="text-sm text-primary/60 mb-2 font-medium">Total XP</p>
                <p className="text-3xl font-bold text-primary">{xp}</p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleEnter}
            disabled={!storeVerified}
              className={`
              w-full px-8 py-4 rounded-xl font-bold text-xl transition-all
              ${storeVerified
                ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30'
                : 'bg-primary/10 text-primary/30 cursor-not-allowed'
              }
            `}
            whileHover={storeVerified ? { scale: 1.02 } : {}}
            whileTap={storeVerified ? { scale: 0.98 } : {}}
          >
            Enter Whop University
          </motion.button>

          {!storeVerified && (
            <p className="mt-4 text-sm text-primary/60">
              Complete Step 4 to unlock Whop University
            </p>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}
