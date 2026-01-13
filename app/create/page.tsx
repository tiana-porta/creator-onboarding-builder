'use client'

import { GlassCard } from '@/components/onboarding/GlassCard'
import { motion } from 'framer-motion'

export default function CreateStorePage() {
  return (
    <div className="min-h-screen bg-dark py-12 px-4 relative overflow-hidden">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <div className="text-center">
              <div className="text-6xl mb-6">🏪</div>
              <h1 className="text-4xl font-bold text-primary mb-4">
                Create Your Whop Store
              </h1>
              <p className="text-lg text-primary/70 mb-8">
                This is a placeholder page for creating a Whop store. 
                In production, this would redirect to the actual Whop store creation flow.
              </p>
              <div className="bg-primary/5 rounded-xl p-6 mb-6 text-left">
                <p className="text-sm text-primary/60 mb-2">Quick Steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-primary/80">
                  <li>Visit whop.com and sign up</li>
                  <li>Create a new store</li>
                  <li>Copy your store URL</li>
                  <li>Return to onboarding and paste it</li>
                </ol>
              </div>
              <a
                href="https://whop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-xl font-bold text-lg bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30 transition-all"
              >
                Go to Whop.com
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
