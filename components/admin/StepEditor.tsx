'use client'

import { useState } from 'react'
import { GlassCard } from '../onboarding/GlassCard'
import type { StepConfig, ChoiceOption } from '@/lib/onboarding/config-types'

interface StepEditorProps {
  step: StepConfig
  onSave: (step: StepConfig) => void
  onCancel: () => void
}

export function StepEditor({ step, onSave, onCancel }: StepEditorProps) {
  const [localStep, setLocalStep] = useState({
    ...step,
    order: step.order !== undefined ? step.order : 0,
  })

  const updateField = (field: keyof StepConfig, value: any) => {
    setLocalStep(prev => {
      const updated = { ...prev, [field]: value }
      // If switching to form type and no formFields exist, add a default field
      if (field === 'type' && value === 'form' && (!prev.formFields || prev.formFields.length === 0)) {
        updated.formFields = [{
          id: `field-${Date.now()}`,
          label: 'Field 1',
          type: 'text',
          required: false,
          placeholder: 'Enter text...',
        }]
      }
      // If switching to checklist type and no checklistItems exist, add a default item
      if (field === 'type' && value === 'checklist' && (!prev.checklistItems || prev.checklistItems.length === 0)) {
        updated.checklistItems = [{
          id: `item-${Date.now()}`,
          label: 'Checklist Item 1',
          description: 'Complete this task',
          required: true,
          stepNumber: '1',
          highlightWord: '',
        }]
      }
      // If switching to tour type and no tourItems exist, add a default item
      if (field === 'type' && value === 'tour' && (!prev.tourItems || prev.tourItems.length === 0)) {
        updated.tourItems = [{
          id: `tour-item-${Date.now()}`,
          title: 'Tour Item 1',
          description: 'Description of this tour item',
          imageUrl: '',
        }]
      }
      return updated
    })
  }

  const handleSave = () => {
    onSave(localStep)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Edit Step</h2>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl font-medium bg-accent text-white hover:bg-accent/90"
          >
            Save
          </button>
        </div>
      </div>

      <GlassCard>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Step Type</label>
            <select
              value={localStep.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            >
              <option value="choice">Choice</option>
              <option value="video">Video</option>
              <option value="tour">Tour</option>
              <option value="form">Form</option>
              <option value="checklist">Checklist</option>
              <option value="finale">Finale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Title</label>
            <input
              type="text"
              value={localStep.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Description</label>
            <textarea
              value={localStep.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localStep.enabled}
              onChange={(e) => updateField('enabled', e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-primary">Enabled</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">XP Reward</label>
            <input
              type="number"
              value={localStep.xpReward || 0}
              onChange={(e) => updateField('xpReward', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">CTA Label</label>
            <input
              type="text"
              value={localStep.ctaLabel || ''}
              onChange={(e) => updateField('ctaLabel', e.target.value)}
              placeholder="Continue"
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">CTA URL (for finale)</label>
            <input
              type="text"
              value={localStep.ctaUrl || ''}
              onChange={(e) => updateField('ctaUrl', e.target.value)}
              placeholder="/university"
              className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
            />
          </div>
        </div>
      </GlassCard>

      {/* Type-specific fields */}
      {localStep.type === 'choice' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Choice Options</h3>
          <div className="space-y-4">
            {(localStep.options || []).map((option, index) => (
              <div key={index} className="p-4 border border-primary/20 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={option.title}
                    onChange={(e) => {
                      const newOptions = [...(localStep.options || [])]
                      newOptions[index] = { ...option, title: e.target.value }
                      updateField('options', newOptions)
                    }}
                    className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle (optional)"
                    value={option.subtitle || ''}
                    onChange={(e) => {
                      const newOptions = [...(localStep.options || [])]
                      newOptions[index] = { ...option, subtitle: e.target.value }
                      updateField('options', newOptions)
                    }}
                    className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={option.description || ''}
                  onChange={(e) => {
                    const newOptions = [...(localStep.options || [])]
                    newOptions[index] = { ...option, description: e.target.value }
                    updateField('options', newOptions)
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary mb-2"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Image URL or Emoji"
                  value={option.imageUrl || option.emoji || ''}
                  onChange={(e) => {
                    const newOptions = [...(localStep.options || [])]
                    const value = e.target.value
                    if (value.match(/[\u{1F300}-\u{1F9FF}]/u)) {
                      newOptions[index] = { ...option, emoji: value, imageUrl: undefined }
                    } else {
                      newOptions[index] = { ...option, imageUrl: value, emoji: undefined }
                    }
                    updateField('options', newOptions)
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                />
                <button
                  onClick={() => {
                    const newOptions = (localStep.options || []).filter((_, i) => i !== index)
                    updateField('options', newOptions)
                  }}
                  className="mt-2 text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(localStep.options || []), {
                  id: `option-${Date.now()}`,
                  title: '',
                }]
                updateField('options', newOptions)
              }}
              className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              + Add Option
            </button>
          </div>
        </GlassCard>
      )}

      {localStep.type === 'video' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Video Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Video URL</label>
              <input
                type="text"
                value={localStep.videoUrl || ''}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                placeholder="/videos/video.mp4 or https://..."
                className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Embed URL (YouTube, etc.)</label>
              <input
                type="text"
                value={localStep.videoEmbedUrl || ''}
                onChange={(e) => updateField('videoEmbedUrl', e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localStep.requireWatch || false}
                onChange={(e) => updateField('requireWatch', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-primary">Require watch</label>
            </div>
            {localStep.requireWatch && (
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Min Watch Time (seconds)</label>
                <input
                  type="number"
                  value={localStep.minWatchTime || 0}
                  onChange={(e) => updateField('minWatchTime', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                />
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {localStep.type === 'form' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Form Fields</h3>
          <div className="space-y-4">
            {(!localStep.formFields || localStep.formFields.length === 0) && (
              <p className="text-sm text-primary/70 mb-4">No form fields yet. Add a field to get started.</p>
            )}
            {(localStep.formFields || []).map((field: any, index: number) => (
              <div key={index} className="p-4 border border-primary/20 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Field Label</label>
                    <input
                      type="text"
                      value={field.label || ''}
                      onChange={(e) => {
                        const newFields = [...(localStep.formFields || [])]
                        newFields[index] = { ...field, label: e.target.value }
                        updateField('formFields', newFields)
                      }}
                      placeholder="Field label"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Field Type</label>
                    <select
                      value={field.type || 'text'}
                      onChange={(e) => {
                        const newFields = [...(localStep.formFields || [])]
                        newFields[index] = { ...field, type: e.target.value }
                        updateField('formFields', newFields)
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="url">URL</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-primary mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => {
                      const newFields = [...(localStep.formFields || [])]
                      newFields[index] = { ...field, placeholder: e.target.value }
                      updateField('formFields', newFields)
                    }}
                    placeholder="Placeholder text"
                    className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => {
                        const newFields = [...(localStep.formFields || [])]
                        newFields[index] = { ...field, required: e.target.checked }
                        updateField('formFields', newFields)
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-primary">Required</span>
                  </label>
                  <button
                    onClick={() => {
                      const newFields = (localStep.formFields || []).filter((_: any, i: number) => i !== index)
                      updateField('formFields', newFields)
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newFields = [...(localStep.formFields || []), {
                  id: `field-${Date.now()}`,
                  label: '',
                  type: 'text',
                  required: false,
                  placeholder: '',
                }]
                updateField('formFields', newFields)
              }}
              className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              + Add Field
            </button>
          </div>
        </GlassCard>
      )}

      {localStep.type === 'checklist' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Checklist Items</h3>
          <div className="space-y-4">
            {(!localStep.checklistItems || localStep.checklistItems.length === 0) && (
              <p className="text-sm text-primary/70 mb-4">No checklist items yet. Add an item to get started.</p>
            )}
            {(localStep.checklistItems || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border border-primary/20 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Step Number (optional)</label>
                    <input
                      type="text"
                      value={item.stepNumber || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.checklistItems || [])]
                        newItems[index] = { ...item, stepNumber: e.target.value }
                        updateField('checklistItems', newItems)
                      }}
                      placeholder="1, 2, 3..."
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Highlight Word (optional)</label>
                    <input
                      type="text"
                      value={item.highlightWord || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.checklistItems || [])]
                        newItems[index] = { ...item, highlightWord: e.target.value }
                        updateField('checklistItems', newItems)
                      }}
                      placeholder="Word to highlight"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-primary mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => {
                      const newItems = [...(localStep.checklistItems || [])]
                      newItems[index] = { ...item, label: e.target.value }
                      updateField('checklistItems', newItems)
                    }}
                    placeholder="Item label"
                    className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-primary mb-1">Description</label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const newItems = [...(localStep.checklistItems || [])]
                      newItems[index] = { ...item, description: e.target.value }
                      updateField('checklistItems', newItems)
                    }}
                    placeholder="Item description (highlight word will be highlighted)"
                    className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.required || false}
                      onChange={(e) => {
                        const newItems = [...(localStep.checklistItems || [])]
                        newItems[index] = { ...item, required: e.target.checked }
                        updateField('checklistItems', newItems)
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-primary">Required</span>
                  </label>
                  <button
                    onClick={() => {
                      const newItems = (localStep.checklistItems || []).filter((_: any, i: number) => i !== index)
                      updateField('checklistItems', newItems)
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(localStep.checklistItems || []), {
                  id: `item-${Date.now()}`,
                  label: '',
                  description: '',
                  required: false,
                  stepNumber: '',
                  highlightWord: '',
                }]
                updateField('checklistItems', newItems)
              }}
              className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              + Add Item
            </button>
          </div>
        </GlassCard>
      )}

      {localStep.type === 'tour' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Tour Items</h3>
          <div className="space-y-4">
            {(!localStep.tourItems || localStep.tourItems.length === 0) && (
              <p className="text-sm text-primary/70 mb-4">No tour items yet. Add an item to get started.</p>
            )}
            {(localStep.tourItems || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border border-primary/20 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.tourItems || [])]
                        newItems[index] = { ...item, title: e.target.value }
                        updateField('tourItems', newItems)
                      }}
                      placeholder="Item title"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Subtitle (optional)</label>
                    <input
                      type="text"
                      value={item.subtitle || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.tourItems || [])]
                        newItems[index] = { ...item, subtitle: e.target.value }
                        updateField('tourItems', newItems)
                      }}
                      placeholder="Subtitle"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-primary mb-1">Description</label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const newItems = [...(localStep.tourItems || [])]
                      newItems[index] = { ...item, description: e.target.value }
                      updateField('tourItems', newItems)
                    }}
                    placeholder="Item description"
                    className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Image URL</label>
                    <input
                      type="text"
                      value={item.imageUrl || item.image || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.tourItems || [])]
                        newItems[index] = { ...item, imageUrl: e.target.value, image: e.target.value }
                        updateField('tourItems', newItems)
                      }}
                      placeholder="https://example.com/image.png or /images/step3-1.png"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                    <p className="text-xs text-primary/60 mt-1">Use a full URL or path to an image</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Video URL or Embed (optional)</label>
                    <input
                      type="text"
                      value={item.videoUrl || ''}
                      onChange={(e) => {
                        const newItems = [...(localStep.tourItems || [])]
                        newItems[index] = { ...item, videoUrl: e.target.value }
                        updateField('tourItems', newItems)
                      }}
                      placeholder="YouTube URL, embed URL, or /videos/video.mp4"
                      className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                    />
                    <p className="text-xs text-primary/60 mt-1">YouTube URLs will be converted to embeds</p>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-primary mb-1">Live Info (optional)</label>
                  <input
                    type="text"
                    value={item.live || ''}
                    onChange={(e) => {
                      const newItems = [...(localStep.tourItems || [])]
                      newItems[index] = { ...item, live: e.target.value }
                      updateField('tourItems', newItems)
                    }}
                    placeholder="Tuesday & Thursday at 4PM EST"
                    className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                  />
                </div>
                <button
                  onClick={() => {
                    const newItems = (localStep.tourItems || []).filter((_: any, i: number) => i !== index)
                    updateField('tourItems', newItems)
                  }}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(localStep.tourItems || []), {
                  id: `tour-item-${Date.now()}`,
                  title: '',
                  description: '',
                  imageUrl: '',
                }]
                updateField('tourItems', newItems)
              }}
              className="px-4 py-2 rounded-xl font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              + Add Tour Item
            </button>
          </div>
        </GlassCard>
      )}

      {localStep.type === 'finale' && (
        <GlassCard>
          <h3 className="text-lg font-bold text-primary mb-4">Finale Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Completion Message</label>
              <textarea
                value={localStep.completionMessage || ''}
                onChange={(e) => updateField('completionMessage', e.target.value)}
                placeholder="Message shown on completion (use **text** to highlight words)"
                className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
                rows={4}
              />
              <p className="text-xs text-primary/60 mt-1">Use **text** to highlight words in accent color</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Emoji</label>
              <input
                type="text"
                value={localStep.emoji || ''}
                onChange={(e) => updateField('emoji', e.target.value)}
                placeholder="🎉"
                className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
              <input
                type="text"
                value={localStep.mediaUrl || ''}
                onChange={(e) => updateField('mediaUrl', e.target.value)}
                placeholder="/images/graduate.png or https://..."
                className="w-full px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localStep.showConfetti !== false}
                onChange={(e) => updateField('showConfetti', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-primary">Show confetti on completion</label>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

