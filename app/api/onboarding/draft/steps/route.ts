import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, updateDraftSteps } from '@/lib/onboarding/service'
import type { StepConfig } from '@/lib/onboarding/config-types'

// GET /api/onboarding/draft/steps?whop_id=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const whopId = searchParams.get('whop_id')

  if (!whopId) {
    return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
  }

  try {
    const draft = await getDraftVersion(whopId)
    const steps = typeof draft.steps === 'string' ? JSON.parse(draft.steps || '[]') : (draft.steps || [])
    return NextResponse.json(steps)
  } catch (error: any) {
    console.error('Error fetching steps:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/onboarding/draft/steps - Add or update steps
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let whopId = searchParams.get('whop_id')

  try {
    const body = await request.json()
    const { steps, whop_id: bodyWhopId } = body

    // Allow whop_id in body as fallback
    if (!whopId && bodyWhopId) {
      whopId = bodyWhopId
    }

    if (!whopId) {
      return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
    }

    if (!steps) {
      return NextResponse.json({ error: 'steps are required' }, { status: 400 })
    }

    if (!Array.isArray(steps)) {
      return NextResponse.json({ error: 'steps must be an array' }, { status: 400 })
    }

    await updateDraftSteps(whopId, steps as StepConfig[])

    const draft = await getDraftVersion(whopId)
    const updatedSteps = typeof draft.steps === 'string' ? JSON.parse(draft.steps || '[]') : (draft.steps || [])
    return NextResponse.json(updatedSteps)
  } catch (error: any) {
    console.error('Error updating steps:', error)
    return NextResponse.json({ error: error.message || 'Failed to update steps' }, { status: 500 })
  }
}
