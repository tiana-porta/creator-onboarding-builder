import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getAuthenticatedUser } from '@/lib/auth/ownership'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()

    // Try to get authenticated user
    const user = await getAuthenticatedUser()

    if (user) {
      // User is authenticated - for now, assume they're admin if they have a company
      return NextResponse.json({
        success: true,
        isAdmin: !!user.companyId,
        userId: user.userId,
      })
    }

    // Fallback: check referer to see if request is from Whop
    const referer = headersList.get('referer') || request.headers.get('referer') || ''
    const isFromWhop = referer.includes('whop.com') || referer.includes('whop.io')

    // For development: if request is from Whop, assume admin (can be refined later)
    return NextResponse.json({
      success: true,
      isAdmin: isFromWhop && process.env.NODE_ENV === 'development',
      message: isFromWhop ? 'Development mode: assuming admin' : 'Could not verify admin status',
    })
  } catch (error: any) {
    console.error('Admin check API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', isAdmin: false },
      { status: 500 }
    )
  }
}
