'use client'

import { useState } from 'react'
import { GlassCard } from '../onboarding/GlassCard'
import { StepEditor } from './StepEditor'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepListProps {
  steps: StepConfig[]
  onUpdate: (steps: StepConfig[]) => void
}

export function StepList({ steps, onUpdate }: StepListProps) {
  const { theme } = useTheme()
  const [editingStep, setEditingStep] = useState<StepConfig | null>(null)
  const [showAddStep, setShowAddStep] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const addStep = () => {
    const newStep: StepConfig = {
      id: `step-${Date.now()}`,
      type: 'choice',
      title: 'New Step',
      description: '',
      enabled: true,
      order: steps.length,
    }
    setEditingStep(newStep)
    setShowAddStep(true)
  }

  const updateStep = async (updated: StepConfig) => {
    setSaving(true)
    try {
      let newSteps: StepConfig[]
      if (showAddStep) {
        // Ensure order is set correctly for new step
        const maxOrder = steps.length > 0 ? Math.max(...steps.map(s => s.order)) : -1
        updated.order = maxOrder + 1
        newSteps = [...steps, updated].sort((a, b) => a.order - b.order)
        setShowAddStep(false)
      } else {
        // Preserve order when updating existing step
        newSteps = steps.map(s => s.id === updated.id ? { ...updated, order: s.order } : s)
      }
      setEditingStep(null)
      // Call onUpdate which will save to API
      await onUpdate(newSteps)
    } catch (error) {
      console.error('Error saving step:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteStep = (id: string) => {
    onUpdate(steps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })))
  }

  const toggleStep = (id: string) => {
    onUpdate(steps.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const reorderSteps = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps]
    const [moved] = newSteps.splice(fromIndex, 1)
    newSteps.splice(toIndex, 0, moved)
    onUpdate(newSteps.map((s, i) => ({ ...s, order: i })))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderSteps(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  if (editingStep) {
    return (
      <StepEditor
        step={editingStep}
        onSave={updateStep}
        onCancel={() => {
          setEditingStep(null)
          setShowAddStep(false)
        }}
      />
    )
  }

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Steps</h2>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-primary/70">Saving...</span>
          )}
          <button
            onClick={addStep}
            disabled={saving}
            className="px-4 py-2 rounded-xl font-medium bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
          >
            + Add Step
          </button>
        </div>
      </div>

      {sortedSteps.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <p className="text-primary/70 mb-4">No steps yet. Add your first step to get started.</p>
            <button
              onClick={addStep}
              className="px-6 py-3 rounded-xl font-medium bg-accent text-white hover:bg-accent/90"
            >
              Add First Step
            </button>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {sortedSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: draggedIndex === index ? 0.5 : 1,
                y: 0,
                scale: draggedIndex === index ? 0.95 : 1,
              }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                cursor-move transition-all
                ${draggedIndex === index ? 'opacity-50' : ''}
                ${dragOverIndex === index ? 'transform translate-y-2' : ''}
              `}
            >
              <GlassCard
                style={dragOverIndex === index ? {
                  borderColor: theme.secondaryColor,
                  borderWidth: '2px',
                  boxShadow: `0 0 0 4px ${theme.secondaryColor}33`,
                } : draggedIndex === index ? {
                  opacity: 0.5,
                } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="text-2xl font-bold text-primary/30 select-none"
                      >
                        {step.order + 1}
                      </div>
                      <div 
                        className="text-primary/40 hover:text-primary/60 transition-colors cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                        style={{ color: draggedIndex === index ? theme.secondaryColor : undefined }}
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 20 20" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M7 5H13M7 10H13M7 15H13" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                          <circle cx="4" cy="5" r="1" fill="currentColor" />
                          <circle cx="4" cy="10" r="1" fill="currentColor" />
                          <circle cx="4" cy="15" r="1" fill="currentColor" />
                          <circle cx="16" cy="5" r="1" fill="currentColor" />
                          <circle cx="16" cy="10" r="1" fill="currentColor" />
                          <circle cx="16" cy="15" r="1" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                        <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary/70">
                          {step.type}
                        </span>
                        {!step.enabled && (
                          <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-500">
                            Disabled
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-sm text-primary/70">{step.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        step.enabled
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}
                    >
                      {step.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => setEditingStep(step)}
                      className="px-3 py-1 rounded text-sm bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStep(step.id)}
                      className="px-3 py-1 rounded text-sm bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

