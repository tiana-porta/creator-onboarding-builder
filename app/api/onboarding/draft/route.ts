import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, updateDraftTheme, getVersionWithOnboarding, versionToConfig } from '@/lib/onboarding/service'
import { supabaseAdmin } from '@/lib/db/supabase'

// GET /api/onboarding/draft?whop_id=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const whopId = searchParams.get('whop_id')

  if (!whopId) {
    return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
  }

  try {
    const draft = await getDraftVersion(whopId)
    const fullVersion = await getVersionWithOnboarding(draft.id)

    if (!fullVersion) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const config = versionToConfig(fullVersion)
    return NextResponse.json(config)
  } catch (error: unknown) {
    console.error('Error fetching draft:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch draft'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT /api/onboarding/draft - Update draft theme
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let whopId = searchParams.get('whop_id')

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
  }

  // Allow whop_id in body as fallback
  if (!whopId && body.whop_id) {
    whopId = body.whop_id
  }

  if (!whopId) {
    return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
  }

  try {
    const { theme, welcomeTitle, welcomeSubtitle, welcomeCompleted } = body

    const draft = await getDraftVersion(whopId)
    if (!draft || !draft.id) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    if (theme) {
      await updateDraftTheme(whopId, theme)
    }

    if (welcomeTitle !== undefined || welcomeSubtitle !== undefined || welcomeCompleted !== undefined) {
      const { error } = await supabaseAdmin
        .from('onboarding_version')
        .update({
          welcome_title: welcomeTitle !== undefined ? welcomeTitle : draft.welcome_title,
          welcome_subtitle: welcomeSubtitle !== undefined ? welcomeSubtitle : draft.welcome_subtitle,
          welcome_completed: welcomeCompleted !== undefined ? welcomeCompleted : draft.welcome_completed,
        })
        .eq('id', draft.id)

      if (error) throw error
    }

    const updated = await getVersionWithOnboarding(draft.id)
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
    }

    const config = versionToConfig(updated)
    return NextResponse.json(config)
  } catch (error: unknown) {
    console.error('Error updating draft:', error)
    const message = error instanceof Error ? error.message : 'Failed to update draft'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
