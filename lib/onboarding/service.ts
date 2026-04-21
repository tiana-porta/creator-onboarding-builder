import { supabaseAdmin, DbOnboardingVersion } from '../db/supabase'
import type { OnboardingConfig, ThemeConfig, StepConfig } from './config-types'

// Get or create onboarding for a whop
export async function getOrCreateOnboarding(whopId: string) {
  // Try to find existing onboarding
  const { data: existing } = await supabaseAdmin
    .from('onboarding')
    .select('*, onboarding_version(*)')
    .eq('whop_id', whopId)
    .single()

  if (existing) {
    return existing
  }

  // Create new onboarding with initial draft version
  const { data: onboarding, error: onboardingError } = await supabaseAdmin
    .from('onboarding')
    .insert({ whop_id: whopId })
    .select()
    .single()

  if (onboardingError) throw onboardingError

  // Create initial draft version
  const { data: version, error: versionError } = await supabaseAdmin
    .from('onboarding_version')
    .insert({
      onboarding_id: onboarding.id,
      version: 1,
      status: 'draft',
      steps: [],
    })
    .select()
    .single()

  if (versionError) throw versionError

  return {
    ...onboarding,
    onboarding_version: [version],
  }
}

// Get draft version
export async function getDraftVersion(whopId: string) {
  const onboarding = await getOrCreateOnboarding(whopId)

  // Find existing draft
  const { data: draft } = await supabaseAdmin
    .from('onboarding_version')
    .select('*')
    .eq('onboarding_id', onboarding.id)
    .eq('status', 'draft')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (draft) {
    return draft
  }

  // No draft exists, create new one from latest version
  const { data: latestVersion } = await supabaseAdmin
    .from('onboarding_version')
    .select('*')
    .eq('onboarding_id', onboarding.id)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const { data: newDraft, error } = await supabaseAdmin
    .from('onboarding_version')
    .insert({
      onboarding_id: onboarding.id,
      version: (latestVersion?.version || 0) + 1,
      status: 'draft',
      steps: latestVersion?.steps || [],
      primary_color: latestVersion?.primary_color || '#141212',
      secondary_color: latestVersion?.secondary_color || '#FA4616',
      light_color: latestVersion?.light_color || '#FCF6F5',
      button_radius: latestVersion?.button_radius || 12,
      button_style: latestVersion?.button_style || 'solid',
      mode: latestVersion?.mode || 'dark',
      welcome_title: latestVersion?.welcome_title,
      welcome_subtitle: latestVersion?.welcome_subtitle,
      welcome_completed: latestVersion?.welcome_completed || false,
    })
    .select()
    .single()

  if (error) throw error
  return newDraft
}

// Get published version
export async function getPublishedVersion(whopId: string) {
  const { data: onboarding } = await supabaseAdmin
    .from('onboarding')
    .select('id')
    .eq('whop_id', whopId)
    .single()

  if (!onboarding) return null

  const { data: published } = await supabaseAdmin
    .from('onboarding_version')
    .select('*')
    .eq('onboarding_id', onboarding.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  return published
}

// Update draft theme
export async function updateDraftTheme(whopId: string, theme: Partial<ThemeConfig>) {
  const draft = await getDraftVersion(whopId)

  const { data, error } = await supabaseAdmin
    .from('onboarding_version')
    .update({
      primary_color: theme.primaryColor,
      secondary_color: theme.secondaryColor,
      light_color: theme.lightColor,
      gradient_stops: theme.gradientStops || null,
      button_radius: theme.buttonRadius,
      button_style: theme.buttonStyle,
      logo_url: theme.logoUrl,
      cover_image_url: theme.coverImageUrl,
      mode: theme.mode,
    })
    .eq('id', draft.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update draft steps
export async function updateDraftSteps(whopId: string, steps: StepConfig[]) {
  const draft = await getDraftVersion(whopId)

  const { data, error } = await supabaseAdmin
    .from('onboarding_version')
    .update({ steps })
    .eq('id', draft.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Publish draft
export async function publishDraft(whopId: string, publishedBy?: string) {
  const draft = await getDraftVersion(whopId)

  // Unpublish any existing published versions
  await supabaseAdmin
    .from('onboarding_version')
    .update({ status: 'draft' })
    .eq('onboarding_id', draft.onboarding_id)
    .eq('status', 'published')

  // Publish the draft
  const { data, error } = await supabaseAdmin
    .from('onboarding_version')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      published_by: publishedBy,
    })
    .eq('id', draft.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get version with onboarding relation
export async function getVersionWithOnboarding(versionId: string) {
  const { data, error } = await supabaseAdmin
    .from('onboarding_version')
    .select('*, onboarding(*)')
    .eq('id', versionId)
    .single()

  if (error) throw error
  return data
}

// Convert version to config format (works with snake_case DB columns)
export function versionToConfig(version: any): OnboardingConfig {
  if (!version) {
    throw new Error('Version is required')
  }

  // Get whopId from onboarding relation or fallback
  const whopId = version.onboarding?.whop_id || version.onboarding_id || ''

  // Parse steps - Supabase returns JSONB as objects already
  let steps: StepConfig[] = []
  if (version.steps) {
    steps = typeof version.steps === 'string' ? JSON.parse(version.steps) : version.steps
  }

  // Parse gradient stops
  let gradientStops = undefined
  if (version.gradient_stops) {
    gradientStops = typeof version.gradient_stops === 'string'
      ? JSON.parse(version.gradient_stops)
      : version.gradient_stops
  }

  return {
    id: version.id || '',
    whopId,
    theme: {
      primaryColor: version.primary_color || '#141212',
      secondaryColor: version.secondary_color || '#FA4616',
      lightColor: version.light_color || '#FCF6F5',
      gradientStops,
      buttonRadius: version.button_radius || 12,
      buttonStyle: (version.button_style || 'solid') as 'solid' | 'outline' | 'ghost',
      logoUrl: version.logo_url || undefined,
      coverImageUrl: version.cover_image_url || undefined,
      mode: (version.mode || 'dark') as 'light' | 'dark',
    },
    welcomeTitle: version.welcome_title || undefined,
    welcomeSubtitle: version.welcome_subtitle || undefined,
    welcomeCompleted: version.welcome_completed || false,
    steps,
  }
}
