import { NextRequest, NextResponse } from 'next/server'
import { publishDraft, getPublishedVersion, getVersionWithOnboarding, versionToConfig } from '@/lib/onboarding/service'

// POST /api/onboarding/publish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { whop_id, published_by } = body

    if (!whop_id) {
      return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
    }

    await publishDraft(whop_id, published_by)

    const published = await getPublishedVersion(whop_id)
    if (!published) {
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
    }

    const fullVersion = await getVersionWithOnboarding(published.id)
    const config = versionToConfig(fullVersion)
    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Error publishing:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
