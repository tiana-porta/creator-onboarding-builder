import { NextRequest, NextResponse } from 'next/server'
import { publishDraft, getPublishedVersion, versionToConfig } from '@/lib/onboarding/service'
import { prisma } from '@/lib/db/client'
// import { extractAndVerifyWhopId } from '@/lib/auth/middleware' // TODO: Re-enable when ready for multi-tenancy

// POST /api/onboarding/publish
export async function POST(request: NextRequest) {
  try {
    // TODO: Re-enable ownership verification when ready for multi-tenancy
    // const whopIdResult = await extractAndVerifyWhopId(request)
    // if (whopIdResult.response) {
    //   return whopIdResult.response
    // }
    // const whop_id_verified = whopIdResult.whopId!

    const body = await request.json()
    const { whop_id, published_by } = body

    if (!whop_id) {
      return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
    }

    // TODO: Re-enable ownership check
    // if (whop_id && whop_id !== whop_id_verified) {
    //   return NextResponse.json({ error: 'whop_id mismatch: You can only publish your own onboarding' }, { status: 403 })
    // }

    await publishDraft(whop_id, published_by) // Using whop_id from body (no verification)

    const published = await getPublishedVersion(whop_id)
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

