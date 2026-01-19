import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, updateDraftSteps, versionToConfig } from '@/lib/onboarding/service'
import { prisma } from '@/lib/db/client'
import { extractAndVerifyWhopId } from '@/lib/auth/middleware'
import type { StepConfig } from '@/lib/onboarding/config-types'

// GET /api/onboarding/draft/steps?whop_id=...
export async function GET(request: NextRequest) {
  try {
    const whopIdResult = await extractAndVerifyWhopId(request)
    if (whopIdResult.response) {
      return whopIdResult.response
    }
    const whopId = whopIdResult.whopId!

    const draft = await getDraftVersion(whopId)
    const steps = JSON.parse(draft.steps || '[]') as StepConfig[]
    return NextResponse.json(steps)
  } catch (error: any) {
    console.error('Error fetching steps:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/onboarding/draft/steps - Add or update steps
export async function POST(request: NextRequest) {
  try {
    const whopIdResult = await extractAndVerifyWhopId(request)
    if (whopIdResult.response) {
      return whopIdResult.response
    }
    const whop_id_verified = whopIdResult.whopId!

    const body = await request.json()
    const { steps } = body

    if (!steps) {
      return NextResponse.json({ error: 'steps are required' }, { status: 400 })
    }

    if (!Array.isArray(steps)) {
      return NextResponse.json({ error: 'steps must be an array' }, { status: 400 })
    }

    await updateDraftSteps(whop_id_verified, steps as StepConfig[])

    const draft = await getDraftVersion(whop_id_verified)
    let updatedSteps: StepConfig[] = []
    try {
      updatedSteps = JSON.parse(draft.steps || '[]')
    } catch (e) {
      console.error('Error parsing steps:', e)
      updatedSteps = []
    }
    return NextResponse.json(updatedSteps)
  } catch (error: any) {
    console.error('Error updating steps:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update steps',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

