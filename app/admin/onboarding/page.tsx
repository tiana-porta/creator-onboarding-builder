'use client'

import { useState, useEffect } from 'react'
import { ThemeEditor } from '@/components/admin/ThemeEditor'
import { StepList } from '@/components/admin/StepList'
import { PreviewPanel } from '@/components/admin/PreviewPanel'
// import { useWhopAuth } from '@/lib/auth/useWhopAuth' // TODO: Re-enable when ready for multi-tenancy
import type { OnboardingConfig, ThemeConfig, StepConfig } from '@/lib/onboarding/config-types'

export default function OnboardingAdminPage() {
  // TODO: Re-enable when ready for multi-tenancy
  // const { whopId, loading: authLoading } = useWhopAuth()
  const [whopId, setWhopId] = useState('demo-whop-1') // Fallback for development
  const authLoading = false
  const [config, setConfig] = useState<OnboardingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'theme' | 'steps' | 'preview'>('theme')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (whopId && !authLoading) {
      loadDraft()
    }
  }, [whopId, authLoading])

  const loadDraft = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/onboarding/draft?whop_id=${whopId}`)
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        // Create new draft if none exists
        const newConfig: OnboardingConfig = {
          id: '',
          whopId,
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
          whop_id: whopId,
          theme: { ...config.theme, ...theme },
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Check console for details.')
      }

      if (response.ok) {
        const updated = await response.json()
        setConfig(updated)
        console.log('Theme saved successfully')
      } else {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        console.error('Error saving theme:', error)
        alert(`Failed to save theme: ${error.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Error updating theme:', error)
      alert(`Failed to save theme: ${error.message || 'Please try again.'}`)
    }
  }

  const updateSteps = async (steps: StepConfig[]) => {
    if (!config) return

    try {
      // Ensure all steps have proper order
      const orderedSteps = steps.map((step, index) => ({
        ...step,
        order: step.order !== undefined ? step.order : index,
      })).sort((a, b) => a.order - b.order)

      const response = await fetch('/api/onboarding/draft/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whop_id: whopId,
          steps: orderedSteps,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Check console for details.')
      }

      if (response.ok) {
        const updated = await response.json()
        setConfig({ ...config, steps: updated })
        console.log('Steps saved successfully', updated)
      } else {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        console.error('Error saving steps:', error)
        alert(`Failed to save steps: ${error.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Error updating steps:', error)
      alert(`Failed to save steps: ${error.message || 'Please try again.'}`)
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
          whop_id: whopId,
          published_by: 'admin', // TODO: Get from auth
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
      console.error('Error publishing:', error)
      alert('Failed to publish onboarding')
    } finally {
      setPublishing(false)
    }
  }

  if (authLoading || !whopId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Authenticating...</div>
      </div>
    )
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-primary">Loading onboarding...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Onboarding Builder</h1>
            <p className="text-primary/70">Customize your onboarding experience</p>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-primary/20">
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'theme'
                ? 'text-accent border-b-2 border-accent'
                : 'text-primary/70 hover:text-primary'
            }`}
          >
            Theme & Branding
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'steps'
                ? 'text-accent border-b-2 border-accent'
                : 'text-primary/70 hover:text-primary'
            }`}
          >
            Steps
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-accent border-b-2 border-accent'
                : 'text-primary/70 hover:text-primary'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
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
                    body: JSON.stringify({
                      whop_id: whopId,
                      welcomeTitle,
                      welcomeSubtitle,
                    }),
                  })

                  const contentType = res.headers.get('content-type')
                  if (!contentType || !contentType.includes('application/json')) {
                    const text = await res.text()
                    console.error('Non-JSON response:', text.substring(0, 200))
                    throw new Error('Server returned non-JSON response. Check console for details.')
                  }

                  if (res.ok) {
                    const updated = await res.json()
                    setConfig(updated)
                    console.log('Welcome page saved successfully')
                  } else {
                    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
                    alert(`Failed to save: ${error.error || 'Unknown error'}`)
                  }
                } catch (err: any) {
                  console.error('Error saving welcome page:', err)
                  alert(`Failed to save welcome page: ${err.message || 'Please try again.'}`)
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

