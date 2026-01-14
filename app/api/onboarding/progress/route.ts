import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
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

    const progress = await prisma.onboardingProgress.findUnique({
      where: {
        versionId_userId: {
          versionId: version.id,
          userId,
        },
      },
    })

    if (!progress) {
      return NextResponse.json({
        currentStep: 1,
        xp: 0,
        completed: false,
        stepData: {},
      })
    }

    return NextResponse.json({
      currentStep: progress.currentStep,
      xp: progress.xp,
      completed: progress.completed,
      stepData: progress.stepData ? JSON.parse(progress.stepData) : {},
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
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

    const progress = await prisma.onboardingProgress.upsert({
      where: {
        versionId_userId: {
          versionId: version.id,
          userId: user_id,
        },
      },
      update: {
        currentStep,
        xp,
        stepData: stepData ? JSON.stringify(stepData) : undefined,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        email: email || undefined,
      },
      create: {
        versionId: version.id,
        userId: user_id,
        email: email || undefined,
        currentStep: currentStep || 1,
        xp: xp || 0,
        stepData: stepData ? JSON.stringify(stepData) : null,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
      },
    })

    return NextResponse.json({
      currentStep: progress.currentStep,
      xp: progress.xp,
      completed: progress.completed,
      stepData: progress.stepData ? JSON.parse(progress.stepData) : {},
    })
  } catch (error: any) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

