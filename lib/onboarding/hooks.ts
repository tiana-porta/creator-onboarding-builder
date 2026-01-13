'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OnboardingState, ClassType } from './types'
import { DEFAULT_STATE, STORAGE_KEY } from './types'

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Ensure welcomeCompleted defaults to false for old data (reset it for testing)
          setState({ 
            ...DEFAULT_STATE, 
            ...parsed,
            welcomeCompleted: parsed.welcomeCompleted === undefined ? false : parsed.welcomeCompleted
          })
        } else {
          // Initialize with startedAt timestamp
          const initialState = {
            ...DEFAULT_STATE,
            startedAt: new Date().toISOString(),
            welcomeCompleted: false,
          }
          setState(initialState)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error)
      }
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage whenever state changes
  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch (error) {
          console.error('Failed to save onboarding state:', error)
        }
      }
      return next
    })
  }, [])

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const next = { ...prev, xp: prev.xp + amount }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch (error) {
          console.error('Failed to save XP:', error)
        }
      }
      return next
    })
  }, [])

  const selectClass = useCallback((classType: ClassType) => {
    updateState({ selectedClass: classType })
    addXP(50)
  }, [updateState, addXP])

  const nextStep = useCallback(() => {
    updateState({ step: state.step + 1 })
  }, [state.step, updateState])

  const previousStep = useCallback(() => {
    if (state.step > 1) {
      updateState({ step: state.step - 1 })
    }
  }, [state.step, updateState])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      updateState({ step })
    }
  }, [updateState])

  const completeOnboarding = useCallback(() => {
    updateState({
      completedAt: new Date().toISOString(),
      step: 6,
    })
  }, [updateState])

  return {
    state,
    isHydrated,
    updateState,
    addXP,
    selectClass,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
  }
}
