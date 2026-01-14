import { NextRequest, NextResponse } from 'next/server'
import { verifyOwnership, getAuthFromRequest } from './ownership'

/**
 * Middleware to verify ownership before allowing access to onboarding resources
 */
export async function requireOwnership(
  request: NextRequest,
  whopId: string
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const authContext = await getAuthFromRequest(request)
  
  const isAuthorized = await verifyOwnership(whopId, authContext || undefined)
  
  if (!isAuthorized) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: You can only access your own onboarding configuration' },
        { status: 403 }
      ),
    }
  }
  
  return { authorized: true }
}

/**
 * Helper to extract whopId from request and verify ownership
 */
export async function extractAndVerifyWhopId(
  request: NextRequest
): Promise<{ whopId: string; response?: NextResponse } | { whopId: null; response: NextResponse }> {
  // Try to get whopId from query params
  const searchParams = request.nextUrl.searchParams
  let whopId = searchParams.get('whop_id')
  
  // Or from request body (for POST/PUT)
  if (!whopId) {
    try {
      const body = await request.clone().json()
      whopId = body.whop_id || body.whopId
    } catch {
      // Body might not be JSON, that's okay
    }
  }
  
  if (!whopId) {
    return {
      whopId: null,
      response: NextResponse.json(
        { error: 'whop_id is required' },
        { status: 400 }
      ),
    }
  }
  
  // Verify ownership
  const authCheck = await requireOwnership(request, whopId)
  if (!authCheck.authorized) {
    return {
      whopId: null,
      response: authCheck.response!,
    }
  }
  
  return { whopId }
}

