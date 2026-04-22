import { NextRequest, NextResponse } from 'next/server'
import { appendToSheet, updateIncompleteUsers, type OnboardingData } from '@/lib/sheets/client'
import { upsertRecord } from '@/lib/leaderboard'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data, timestamp, userId, whopId } = body

    // Verify webhook secret if needed
    const secret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!whopId) {
      return NextResponse.json({ error: 'whopId is required' }, { status: 400 })
    }

    // Generate userId if not provided
    const recordUserId = userId || data.email || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    switch (event) {
      case 'step_progress':
        const progressData: OnboardingData = {
          ...data,
          timestamp: timestamp || new Date().toISOString(),
        }
        await appendToSheet(progressData)

        await upsertRecord({
          userId: recordUserId,
          whopId,
          email: data.email,
          step: data.step || 0,
          xp: data.xp || 0,
          selectedClass: data.selectedClass || null,
          storeUrl: data.storeUrl || null,
          storeVerified: data.storeVerified || false,
          startedAt: data.startedAt || timestamp || new Date().toISOString(),
        })
        break

      case 'onboarding_completed':
        const completedData: OnboardingData = {
          ...data,
          timestamp: timestamp || new Date().toISOString(),
        }
        await appendToSheet(completedData)

        await upsertRecord({
          userId: recordUserId,
          whopId,
          email: data.email,
          step: data.step || 6,
          xp: data.xp || 0,
          selectedClass: data.selectedClass || null,
          storeUrl: data.storeUrl || null,
          storeVerified: data.storeVerified || false,
          startedAt: data.startedAt || timestamp || new Date().toISOString(),
          completedAt: data.completedAt || timestamp || new Date().toISOString(),
        })
        break

      case 'onboarding_started':
        await upsertRecord({
          userId: recordUserId,
          whopId,
          email: data.email,
          step: 1,
          xp: 0,
          startedAt: data.startedAt || timestamp || new Date().toISOString(),
        })
        break

      case 'check_incomplete':
        await updateIncompleteUsers()
        break

      default:
        console.log('Unknown event type:', event)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
