import { NextRequest, NextResponse } from 'next/server'
import { appendToSheet, updateIncompleteUsers, type OnboardingData } from '@/lib/sheets/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data, timestamp } = body

    // Verify webhook secret if needed
    const secret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    switch (event) {
      case 'step_progress':
      case 'onboarding_completed':
        const progressData: OnboardingData = {
          ...data,
          timestamp: timestamp || new Date().toISOString(),
        }
        await appendToSheet(progressData)
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
