import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { getPublishedVersion } from '@/lib/onboarding/service'

// GET /api/onboarding/progress?whop_id=...&user_id=...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const whopId = searchParams.get('whop_id')
    const userId = searchParams.get('user_id')

    if (!whopId || !userId) {
      return NextResponse.json({ error: 'whop_id and user_id are required' }, { status: 400 })
    }

    const version = await getPublishedVersion(whopId)
    if (!version) {
      return NextResponse.json({ error: 'No published onboarding found' }, { status: 404 })
    }

    const { data: progress } = await supabaseAdmin
      .from('onboarding_progress')
      .select('*')
      .eq('version_id', version.id)
      .eq('user_id', userId)
      .single()

    if (!progress) {
      return NextResponse.json({
        currentStep: 1,
        xp: 0,
        completed: false,
        stepData: {},
      })
    }

    return NextResponse.json({
      currentStep: progress.current_step,
      xp: progress.xp,
      completed: progress.completed,
      stepData: progress.step_data || {},
      startedAt: progress.started_at,
      completedAt: progress.completed_at,
    })
  } catch (error: any) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/onboarding/progress - Update progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { whop_id, user_id, email, currentStep, xp, stepData, completed } = body

    if (!whop_id || !user_id) {
      return NextResponse.json({ error: 'whop_id and user_id are required' }, { status: 400 })
    }

    const version = await getPublishedVersion(whop_id)
    if (!version) {
      return NextResponse.json({ error: 'No published onboarding found' }, { status: 404 })
    }

    // Try to find existing progress
    const { data: existing } = await supabaseAdmin
      .from('onboarding_progress')
      .select('id')
      .eq('version_id', version.id)
      .eq('user_id', user_id)
      .single()

    let progress
    if (existing) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from('onboarding_progress')
        .update({
          current_step: currentStep,
          xp,
          step_data: stepData || null,
          completed: completed || false,
          completed_at: completed ? new Date().toISOString() : null,
          email: email || null,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      progress = data
    } else {
      // Create new
      const { data, error } = await supabaseAdmin
        .from('onboarding_progress')
        .insert({
          version_id: version.id,
          user_id,
          email: email || null,
          current_step: currentStep || 1,
          xp: xp || 0,
          step_data: stepData || null,
          completed: completed || false,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error
      progress = data
    }

    return NextResponse.json({
      currentStep: progress.current_step,
      xp: progress.xp,
      completed: progress.completed,
      stepData: progress.step_data || {},
    })
  } catch (error: any) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
