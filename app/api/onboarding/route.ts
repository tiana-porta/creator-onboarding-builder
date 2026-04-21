import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, getPublishedVersion, getVersionWithOnboarding, versionToConfig } from '@/lib/onboarding/service'

// GET /api/onboarding?whop_id=...&type=draft|published
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const whopId = searchParams.get('whop_id')
    const type = searchParams.get('type') || 'published'

    if (!whopId) {
      return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
    }

    let version
    if (type === 'draft') {
      version = await getDraftVersion(whopId)
    } else {
      version = await getPublishedVersion(whopId)
    }

    if (!version) {
      return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 })
    }

    // Include onboarding relation for whopId
    const fullVersion = await getVersionWithOnboarding(version.id)

    const config = versionToConfig(fullVersion)
    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Error fetching onboarding:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
