import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Lazy initialization to prevent build errors
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) {
      if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return (_supabase as any)[prop]
  },
})

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabaseAdmin) {
      if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    }
    return (_supabaseAdmin as any)[prop]
  },
})

// Database types matching our schema
export interface DbOnboarding {
  id: string
  whop_id: string
  created_at: string
  updated_at: string
}

export interface DbOnboardingVersion {
  id: string
  onboarding_id: string
  version: number
  status: 'draft' | 'published'
  published_at: string | null
  published_by: string | null
  primary_color: string
  secondary_color: string
  light_color: string
  gradient_stops: any | null
  button_radius: number
  button_style: 'solid' | 'outline' | 'ghost'
  logo_url: string | null
  cover_image_url: string | null
  mode: 'light' | 'dark'
  welcome_title: string | null
  welcome_subtitle: string | null
  welcome_completed: boolean
  steps: any
  created_at: string
  updated_at: string
}

export interface DbOnboardingProgress {
  id: string
  version_id: string
  user_id: string
  email: string | null
  current_step: number
  xp: number
  completed: boolean
  step_data: any | null
  started_at: string
  completed_at: string | null
  updated_at: string
}

export interface DbStepProgress {
  id: string
  progress_id: string
  step_index: number
  step_type: string
  completed: boolean
  xp_earned: number
  completed_at: string | null
}
