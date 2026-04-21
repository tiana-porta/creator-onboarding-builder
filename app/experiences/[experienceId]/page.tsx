'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ThemeEditor } from '@/components/admin/ThemeEditor'
import { StepList } from '@/components/admin/StepList'
import { PreviewPanel } from '@/components/admin/PreviewPanel'
import type { OnboardingConfig, ThemeConfig, StepConfig } from '@/lib/onboarding/config-types'

export default function ExperienceAdminPage() {
  const params = useParams()
  const experienceId = params.experienceId as string

  const [config, setConfig] = useState<OnboardingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'theme' | 'steps' | 'preview'>('theme')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (experienceId) {
      loadDraft()
    }
  }, [experienceId])

  const loadDraft = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/onboarding/draft?whop_id=${experienceId}`)
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        const newConfig: OnboardingConfig = {
          id: '',
          whopId: experienceId,
          theme: {
            primaryColor: '#141212',
            secondaryColor: '#FA4616',
            lightColor: '#FCF6F5',
            buttonRadius: 12,
            buttonStyle: 'solid',
            mode: 'dark',
          },
          welcomeCompleted: false,
          steps: [],
        }
        setConfig(newConfig)
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTheme = async (theme: Partial<ThemeConfig>) => {
    if (!config) return

    try {
      const response = await fetch('/api/onboarding/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whop_id: experienceId,
          theme: { ...config.theme, ...theme },
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setConfig(updated)
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed to save theme: ${error.error}`)
      }
    } catch (error: any) {
      alert(`Failed to save theme: ${error.message}`)
    }
  }

  const updateSteps = async (steps: StepConfig[]) => {
    if (!config) return

    try {
      const orderedSteps = steps.map((step, index) => ({
        ...step,
        order: step.order !== undefined ? step.order : index,
      })).sort((a, b) => a.order - b.order)

      const response = await fetch('/api/onboarding/draft/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whop_id: experienceId,
          steps: orderedSteps,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setConfig({ ...config, steps: updated })
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed to save steps: ${error.error}`)
      }
    } catch (error: any) {
      alert(`Failed to save steps: ${error.message}`)
    }
  }

  const handlePublish = async () => {
    if (!config) return

    try {
      setPublishing(true)
      const response = await fetch('/api/onboarding/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whop_id: experienceId,
          published_by: 'admin',
        }),
      })

      if (response.ok) {
        alert('Onboarding published successfully!')
        await loadDraft()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Failed to publish onboarding')
    } finally {
      setPublishing(false)
    }
  }

  if (!experienceId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Missing experience ID</div>
      </div>
    )
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading onboarding...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Onboarding Builder</h1>
            <p className="opacity-70">Customize your onboarding experience</p>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-a4">
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'theme' ? 'text-accent border-b-2 border-accent' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Theme & Branding
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'steps' ? 'text-accent border-b-2 border-accent' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Steps
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'preview' ? 'text-accent border-b-2 border-accent' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Preview
          </button>
        </div>

        <div>
          {activeTab === 'theme' && (
            <ThemeEditor
              theme={config.theme}
              welcomeTitle={config.welcomeTitle}
              welcomeSubtitle={config.welcomeSubtitle}
              onUpdate={updateTheme}
              onUpdateWelcome={async (welcomeTitle, welcomeSubtitle) => {
                if (!config) return
                try {
                  const res = await fetch('/api/onboarding/draft', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ whop_id: experienceId, welcomeTitle, welcomeSubtitle }),
                  })
                  if (res.ok) {
                    const updated = await res.json()
                    setConfig(updated)
                  }
                } catch (err) {
                  console.error('Error saving welcome page:', err)
                }
              }}
            />
          )}
          {activeTab === 'steps' && (
            <StepList steps={config.steps} onUpdate={updateSteps} />
          )}
          {activeTab === 'preview' && (
            <PreviewPanel config={config} />
          )}
        </div>
      </div>
    </div>
  )
}
