'use client'

import React, { createContext, useContext, useMemo } from 'react'
import type { ThemeConfig } from '../onboarding/config-types'

interface ThemeContextValue {
  theme: ThemeConfig
  cssVariables: Record<string, string>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#141212',
  secondaryColor: '#FA4616',
  lightColor: '#FCF6F5',
  buttonRadius: 12,
  buttonStyle: 'solid',
}

interface ThemeProviderProps {
  theme?: Partial<ThemeConfig>
  children: React.ReactNode
}

export function ThemeProvider({ theme = {}, children }: ThemeProviderProps) {
  const mergedTheme = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme])

  const cssVariables = useMemo(() => {
    const vars: Record<string, string> = {
      '--color-primary': mergedTheme.primaryColor,
      '--color-secondary': mergedTheme.secondaryColor,
      '--color-light': mergedTheme.lightColor,
      '--button-radius': `${mergedTheme.buttonRadius}px`,
    }

    // Generate gradient if stops provided
    if (mergedTheme.gradientStops && mergedTheme.gradientStops.length > 0) {
      const gradient = mergedTheme.gradientStops
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ')
      vars['--gradient-primary'] = `linear-gradient(135deg, ${gradient})`
    } else {
      // Default gradient from primary to secondary
      vars['--gradient-primary'] = `linear-gradient(135deg, ${mergedTheme.primaryColor}, ${mergedTheme.secondaryColor})`
    }

    return vars
  }, [mergedTheme])

  const value = useMemo(
    () => ({
      theme: mergedTheme,
      cssVariables,
    }),
    [mergedTheme, cssVariables]
  )

  return (
    <ThemeContext.Provider value={value}>
      <div
        style={cssVariables as React.CSSProperties}
        className="min-h-screen"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: DEFAULT_THEME,
      cssVariables: {},
    }
  }
  return context
}

// Helper to get button classes based on theme
export function getButtonClasses(theme: ThemeConfig, variant: 'primary' | 'secondary' = 'primary') {
  const baseClasses = 'font-medium transition-all duration-300'
  const radiusClass = `rounded-[var(--button-radius)]`
  
  if (theme.buttonStyle === 'outline') {
    const borderColor = variant === 'primary' ? theme.primaryColor : theme.secondaryColor
    const textColor = variant === 'primary' ? theme.primaryColor : theme.secondaryColor
    return `${baseClasses} ${radiusClass} border-2 bg-transparent hover:bg-opacity-10`
  }
  
  if (theme.buttonStyle === 'ghost') {
    const textColor = variant === 'primary' ? theme.primaryColor : theme.secondaryColor
    return `${baseClasses} ${radiusClass} border-0 bg-transparent hover:bg-opacity-10`
  }
  
  // Solid (default)
  const bgColor = variant === 'primary' ? theme.secondaryColor : theme.primaryColor
  const textColor = variant === 'primary' ? theme.lightColor : theme.lightColor
  return `${baseClasses} ${radiusClass} bg-[${bgColor}] text-[${textColor}] hover:opacity-90 shadow-lg`
}

