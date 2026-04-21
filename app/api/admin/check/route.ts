import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { whopsdk } from '@/lib/whop-sdk'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const resourceId = searchParams.get('resource_id')

  if (!resourceId) {
    return NextResponse.json({ error: 'resource_id is required' }, { status: 400 })
  }

  try {
    const headersList = await headers()
    const { userId } = await whopsdk.verifyUserToken(headersList)
    const access = await whopsdk.users.checkAccess(resourceId, { id: userId })

    return NextResponse.json({
      success: true,
      isAdmin: access.has_access,
      userId,
    })
  } catch (error: any) {
    console.error('Admin check API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', isAdmin: false },
      { status: 500 }
    )
  }
}
