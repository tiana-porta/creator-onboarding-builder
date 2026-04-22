'use client'

import { useState, useRef, useEffect } from 'react'
import { GlassCard } from '../onboarding/GlassCard'
import type { ThemeConfig } from '@/lib/onboarding/config-types'

interface ThemeEditorProps {
  theme: ThemeConfig
  welcomeTitle?: string
  welcomeSubtitle?: string
  onUpdate: (theme: Partial<ThemeConfig>) => void
  onUpdateWelcome?: (title: string, subtitle: string) => void
}

export function ThemeEditor({ theme, welcomeTitle, welcomeSubtitle, onUpdate, onUpdateWelcome }: ThemeEditorProps) {
  const [localTheme, setLocalTheme] = useState(theme)
  const [localWelcomeTitle, setLocalWelcomeTitle] = useState(welcomeTitle || '')
  const [localWelcomeSubtitle, setLocalWelcomeSubtitle] = useState(welcomeSubtitle || '')


  // Use ref to track timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const updateField = (field: keyof ThemeConfig, value: any) => {
    const updated = { ...localTheme, [field]: value }
    setLocalTheme(updated)
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // Debounce API calls - wait 800ms after last change
    timeoutRef.current = setTimeout(() => {
      onUpdate({ [field]: value })
    }, 800)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleWelcomeUpdate = () => {
    if (onUpdateWelcome) {
      onUpdateWelcome(localWelcomeTitle, localWelcomeSubtitle)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-2xl font-bold text-primary mb-6">Welcome Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Welcome Title</label>
            <input
              type="text"
              value={localWelcomeTitle}
              onChange={(e) => {
                setLocalWelcomeTitle(e.target.value)
                if (onUpdateWelcome) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    onUpdateWelcome(e.target.value, localWelcomeSubtitle)
                  }, 800)
                }
              }}
              placeholder="Welcome to [Store Name]"
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Welcome Subtitle</label>
            <textarea
              value={localWelcomeSubtitle}
              onChange={(e) => {
                setLocalWelcomeSubtitle(e.target.value)
                if (onUpdateWelcome) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    onUpdateWelcome(localWelcomeTitle, e.target.value)
                  }, 800)
                }
              }}
              placeholder="Where the future of [your business] begins"
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-bold text-primary mb-6">Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localTheme.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localTheme.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localTheme.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localTheme.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Light Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localTheme.lightColor}
                onChange={(e) => updateField('lightColor', e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localTheme.lightColor}
                onChange={(e) => updateField('lightColor', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-bold text-primary mb-6">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Button Radius</label>
            <input
              type="range"
              min="0"
              max="24"
              value={localTheme.buttonRadius}
              onChange={(e) => updateField('buttonRadius', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-primary/70 mt-1">{localTheme.buttonRadius}px</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Button Style</label>
            <select
              value={localTheme.buttonStyle}
              onChange={(e) => updateField('buttonStyle', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-bold text-primary mb-6">Assets</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Logo URL</label>
            <input
              type="text"
              value={localTheme.logoUrl || ''}
              onChange={(e) => updateField('logoUrl', e.target.value || undefined)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Cover Image URL</label>
            <input
              type="text"
              value={localTheme.coverImageUrl || ''}
              onChange={(e) => updateField('coverImageUrl', e.target.value || undefined)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

