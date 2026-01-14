import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, updateDraftTheme, versionToConfig } from '@/lib/onboarding/service'
import { prisma } from '@/lib/db/client'
// import { extractAndVerifyWhopId } from '@/lib/auth/middleware' // TODO: Re-enable when ready for multi-tenancy

// Ensure we always return JSON, even on errors
function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// GET /api/onboarding/draft?whop_id=...
export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return jsonResponse({ error: 'Database client not initialized' }, 500)
    }

    // TODO: Re-enable ownership verification when ready for multi-tenancy
    // const whopIdResult = await extractAndVerifyWhopId(request)
    // if (whopIdResult.response) {
    //   return whopIdResult.response
    // }
    // const whopId = whopIdResult.whopId!
    
    const searchParams = request.nextUrl.searchParams
    const whopId = searchParams.get('whop_id')
    
    if (!whopId) {
      return jsonResponse({ error: 'whop_id is required' }, 400)
    }

    const draft = await getDraftVersion(whopId)
    const fullVersion = await prisma.onboardingVersion.findUnique({
      where: { id: draft.id },
      include: { onboarding: true },
    })

    if (!fullVersion) {
      return jsonResponse({ error: 'Draft not found' }, 404)
    }

    const config = versionToConfig(fullVersion)
    return jsonResponse(config)
  } catch (error: any) {
    console.error('Error fetching draft:', error)
    return jsonResponse({ 
      error: error.message || 'Failed to fetch draft',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, 500)
  }
}

// PUT /api/onboarding/draft - Update draft theme
export async function PUT(request: NextRequest) {
  try {
    if (!prisma) {
      return jsonResponse({ error: 'Database client not initialized' }, 500)
    }

    let body
    try {
      body = await request.json()
    } catch (e) {
      return jsonResponse({ error: 'Invalid JSON in request body' }, 400)
    }

    const { whop_id, theme, welcomeTitle, welcomeSubtitle, welcomeCompleted } = body

    // TODO: Re-enable ownership verification when ready for multi-tenancy
    // const whopIdResult = await extractAndVerifyWhopId(request)
    // if (whopIdResult.response) {
    //   return whopIdResult.response
    // }
    // const whop_id_verified = whopIdResult.whopId!
    // if (whop_id && whop_id !== whop_id_verified) {
    //   return jsonResponse({ error: 'whop_id mismatch: You can only modify your own onboarding' }, 403)
    // }

    if (!whop_id) {
      return jsonResponse({ error: 'whop_id is required' }, 400)
    }

    let draft
    try {
      draft = await getDraftVersion(whop_id) // Using whop_id from body (no verification)
    } catch (e: any) {
      console.error('Error getting draft version:', e)
      return jsonResponse({ 
        error: `Failed to get draft: ${e.message || 'Unknown error'}` 
      }, 500)
    }

    if (!draft || !draft.id) {
      return jsonResponse({ error: 'Draft not found or invalid' }, 404)
    }

    if (theme) {
      try {
        await updateDraftTheme(whop_id, theme)
      } catch (e: any) {
        console.error('Error updating theme:', e)
        return jsonResponse({ 
          error: `Failed to update theme: ${e.message || 'Unknown error'}` 
        }, 500)
      }
    }

    if (welcomeTitle !== undefined || welcomeSubtitle !== undefined || welcomeCompleted !== undefined) {
      try {
        await prisma.onboardingVersion.update({
          where: { id: draft.id },
          data: {
            welcomeTitle: welcomeTitle !== undefined ? welcomeTitle : draft.welcomeTitle,
            welcomeSubtitle: welcomeSubtitle !== undefined ? welcomeSubtitle : draft.welcomeSubtitle,
            welcomeCompleted: welcomeCompleted !== undefined ? welcomeCompleted : draft.welcomeCompleted,
          },
        })
      } catch (e: any) {
        console.error('Error updating welcome fields:', e)
        return jsonResponse({ 
          error: `Failed to update welcome fields: ${e.message || 'Unknown error'}` 
        }, 500)
      }
    }

    let updated
    try {
      updated = await prisma.onboardingVersion.findUnique({
        where: { id: draft.id },
        include: { onboarding: true },
      })
    } catch (e: any) {
      console.error('Error fetching updated version:', e)
      return jsonResponse({ 
        error: `Failed to fetch updated version: ${e.message || 'Unknown error'}` 
      }, 500)
    }

    if (!updated) {
      return jsonResponse({ error: 'Failed to update draft' }, 500)
    }

    let config
    try {
      config = versionToConfig(updated)
    } catch (e: any) {
      console.error('Error converting to config:', e)
      return jsonResponse({ 
        error: `Failed to convert version: ${e.message || 'Unknown error'}` 
      }, 500)
    }

    return jsonResponse(config)
  } catch (error: any) {
    console.error('Unexpected error updating draft:', error)
    return jsonResponse({ 
      error: error.message || 'Failed to update draft',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, 500)
  }
}
