'use client'

import { GlassCard } from '../GlassCard'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeProvider'
import type { StepConfig } from '@/lib/onboarding/config-types'

interface StepFormProps {
  config: StepConfig
  initialData?: Record<string, string>
  onContinue: (data: Record<string, string>) => void
}

export function StepForm({ config, initialData = {}, onContinue }: StepFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<Record<string, string>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formFields = config.formFields || []

  const validateField = (fieldId: string, value: string): string | null => {
    const field = formFields.find(f => f.id === fieldId)
    if (!field) return null

    if (field.required && !value.trim()) {
      return `${field.label} is required`
    }

    if (field.validation) {
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} format is invalid`
      }
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be at most ${field.validation.maxLength} characters`
      }
    }

    return null
  }

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    const error = validateField(fieldId, value)
    if (error) {
      setErrors(prev => ({ ...prev, [fieldId]: error }))
    } else {
      setErrors(prev => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    formFields.forEach(field => {
      const error = validateField(field.id, formData[field.id] || '')
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onContinue(formData)
  }

  const canContinue = formFields.every(field => {
    if (!field.required) return true
    return formData[field.id] && formData[field.id].trim()
  }) && Object.keys(errors).length === 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {config.title}
        </h1>
        {config.description && (
          <p className="text-lg text-primary/70">
            {config.description}
          </p>
        )}
      </div>

      <GlassCard className="mb-10">
        <div className="space-y-6">
          {formFields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-primary/70">No form fields configured. Please add fields in the admin dashboard.</p>
            </div>
          ) : (
            formFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-primary mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 bg-dark/90 backdrop-blur-sm
                    text-primary placeholder:text-primary/40
                    ${errors[field.id] ? 'border-red-500 focus:border-red-500' : 'border-primary/20'}
                    focus:outline-none transition-all
                  `}
                  style={!errors[field.id] ? {
                    '--focus-border': theme.secondaryColor,
                    '--focus-ring': `${theme.secondaryColor}33`,
                  } as React.CSSProperties & { '--focus-border': string; '--focus-ring': string } : {}}
                  onFocus={(e) => {
                    if (!errors[field.id]) {
                      e.currentTarget.style.borderColor = theme.secondaryColor
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.secondaryColor}33`
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors[field.id]) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                  rows={4}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className={`
                    flex-1 px-4 py-3 rounded-xl border-2 bg-dark/90 backdrop-blur-sm
                    text-primary placeholder:text-primary/40
                    ${errors[field.id] ? 'border-red-500 focus:border-red-500' : 'border-primary/20'}
                    focus:outline-none transition-all
                  `}
                  style={!errors[field.id] ? {
                    '--focus-border': theme.secondaryColor,
                    '--focus-ring': `${theme.secondaryColor}33`,
                  } as React.CSSProperties & { '--focus-border': string; '--focus-ring': string } : {}}
                  onFocus={(e) => {
                    if (!errors[field.id]) {
                      e.currentTarget.style.borderColor = theme.secondaryColor
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.secondaryColor}33`
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors[field.id]) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                />
              )}
              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors[field.id]}</p>
              )}
            </div>
          ))
          )}
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <motion.button
          onClick={handleSubmit}
          disabled={!canContinue}
          className={`
            px-10 py-4 rounded-xl font-semibold text-lg transition-all
            ${canContinue
              ? `bg-[${theme.secondaryColor}] text-white hover:opacity-90 shadow-lg`
              : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }
          `}
          style={canContinue ? { backgroundColor: theme.secondaryColor } : {}}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
        >
          {config.ctaLabel || 'Continue'}
        </motion.button>
      </div>
    </div>
  )
}

