'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import type { ClassType } from '@/lib/onboarding/types'

interface Step1IdentityProps {
  selectedClass: ClassType
  onSelectClass: (classType: ClassType) => void
  onContinue: () => void
}

export function Step1Identity({ selectedClass, onSelectClass, onContinue }: Step1IdentityProps) {
  const classes = [
    {
      id: 'architect' as ClassType,
      title: 'The Architect',
      subtitle: 'Paid Groups/Communities',
      description: 'Recurring revenue & engagement loops',
      image: '/images/step1-1.png',
    },
    {
      id: 'sensei' as ClassType,
      title: 'The Sensei',
      subtitle: 'Coaching & Courses',
      description: 'High-ticket transformations & content delivery',
      image: '/images/step1-2.png',
    },
    {
      id: 'builder' as ClassType,
      title: 'The Builder',
      subtitle: 'SaaS/Software',
      description: 'Technical utility & scale',
      image: '/images/step1-3.png',
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to the <span className="text-accent">inner circle</span>.
        </h1>
        <p className="text-lg text-primary/70">
          Before we open the <span className="text-accent">gates</span>, tell us who you are so we can tailor the <span className="text-accent">blueprint</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {classes.map((classOption) => (
          <GlassCard
            key={classOption.id}
            selected={selectedClass === classOption.id}
            onClick={() => onSelectClass(classOption.id)}
            hover={true}
          >
            <div className="text-center">
              <motion.div 
                className="mb-4 flex justify-center"
                animate={selectedClass === classOption.id ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img 
                  src={classOption.image} 
                  alt={classOption.title}
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
              <h3 className="text-2xl font-bold text-primary mb-2">{classOption.title}</h3>
              <p className="text-sm text-accent font-semibold mb-3">{classOption.subtitle}</p>
              <p className="text-sm text-primary/70 leading-relaxed">{classOption.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={onContinue}
          disabled={!selectedClass}
            className={`
            px-10 py-4 rounded-xl font-semibold text-lg transition-all
            ${selectedClass
              ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30'
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          whileHover={selectedClass ? { scale: 1.05 } : {}}
          whileTap={selectedClass ? { scale: 0.95 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}
