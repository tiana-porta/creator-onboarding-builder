import { NextRequest, NextResponse } from 'next/server'
import { publishDraft, getPublishedVersion, versionToConfig } from '@/lib/onboarding/service'
import { prisma } from '@/lib/db/client'
import { extractAndVerifyWhopId } from '@/lib/auth/middleware'

// POST /api/onboarding/publish
export async function POST(request: NextRequest) {
  try {
    const whopIdResult = await extractAndVerifyWhopId(request)
    if (whopIdResult.response) {
      return whopIdResult.response
    }
    const whop_id_verified = whopIdResult.whopId!

    const body = await request.json()
    const { published_by } = body

    await publishDraft(whop_id_verified, published_by)

    const published = await getPublishedVersion(whop_id_verified)
    if (!published) {
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
    }

    const fullVersion = await prisma.onboardingVersion.findUnique({
      where: { id: published.id },
      include: { onboarding: true },
    })

    const config = versionToConfig(fullVersion)
    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Error publishing:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

