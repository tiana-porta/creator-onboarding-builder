/**
 * Authentication Middleware for API Routes
 *
 * Provides wrapper functions for protecting API routes with authentication
 * and ownership verification.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, verifyOwnership, type AuthContext } from './ownership'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

/**
 * Standard JSON response helper
 */
function jsonResponse(data: JsonValue, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Error response helpers
 */
export const unauthorized = (message = 'Authentication required') =>
  jsonResponse({ error: message }, 401)

export const forbidden = (message = 'You do not have permission to access this resource') =>
  jsonResponse({ error: message }, 403)

export const badRequest = (message: string) => jsonResponse({ error: message }, 400)

export const notFound = (message = 'Resource not found') => jsonResponse({ error: message }, 404)

export const serverError = (message = 'Internal server error', details?: string) =>
  jsonResponse(
    {
      error: message,
      ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
    },
    500
  )

/**
 * Authenticated request context
 */
export interface AuthenticatedContext {
  user: AuthContext
  whopId: string
}

/**
 * Handler type for authenticated routes
 */
type AuthenticatedHandler<T = NextResponse> = (
  request: NextRequest,
  context: AuthenticatedContext
) => Promise<T>

/**
 * withAuth - Wrapper for routes that require authentication
 *
 * Usage:
 * ```ts
 * export const GET = withAuth(async (request, { user, whopId }) => {
 *   // user is guaranteed to be authenticated
 *   // whopId is verified to belong to the user
 *   return NextResponse.json({ data: 'protected' })
 * })
 * ```
 */
export function withAuth(handler: AuthenticatedHandler): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      // Get authenticated user
      const user = await getAuthenticatedUser()

      if (!user) {
        return unauthorized()
      }

      // Extract whopId from request
      const whopId = await extractWhopId(request)

      if (!whopId) {
        return badRequest('whop_id is required')
      }

      // Verify ownership
      const isOwner = await verifyOwnership(whopId, user)

      if (!isOwner) {
        return forbidden('You can only access your own onboarding configuration')
      }

      // Call the handler with authenticated context
      return handler(request, { user, whopId })
    } catch (error: unknown) {
      console.error('Auth middleware error:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return serverError('Authentication failed', message)
    }
  }
}

/**
 * withAuthOptional - Wrapper for routes where auth is optional
 *
 * User may or may not be authenticated. Useful for public routes
 * that have different behavior for authenticated users.
 */
export function withAuthOptional(
  handler: (request: NextRequest, user: AuthContext | null) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      const user = await getAuthenticatedUser()
      return handler(request, user)
    } catch (error: unknown) {
      console.error('Auth middleware error:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return serverError('Authentication failed', message)
    }
  }
}

/**
 * withUserAuth - Wrapper for routes that need user auth but not ownership
 *
 * Useful for routes where any authenticated user can access,
 * but we need to know who they are (e.g., saving progress for their own user)
 */
export function withUserAuth(
  handler: (request: NextRequest, user: AuthContext) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      const user = await getAuthenticatedUser()

      if (!user) {
        return unauthorized()
      }

      return handler(request, user)
    } catch (error: unknown) {
      console.error('Auth middleware error:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return serverError('Authentication failed', message)
    }
  }
}

/**
 * Extract whopId from request (query params or body)
 */
async function extractWhopId(request: NextRequest): Promise<string | null> {
  // Try query params first
  const searchParams = request.nextUrl.searchParams
  let whopId = searchParams.get('whop_id')

  // Try request body for POST/PUT/PATCH
  if (!whopId && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.clone().json()
      whopId = body.whop_id || body.whopId
    } catch {
      // Body might not be JSON
    }
  }

  return whopId
}

/**
 * Legacy helper - extractAndVerifyWhopId
 *
 * For backwards compatibility with existing routes.
 * Prefer using withAuth wrapper for new routes.
 */
export async function extractAndVerifyWhopId(
  request: NextRequest
): Promise<{ whopId: string; response?: undefined } | { whopId: null; response: NextResponse }> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return { whopId: null, response: unauthorized() }
  }

  const whopId = await extractWhopId(request)

  if (!whopId) {
    return { whopId: null, response: badRequest('whop_id is required') }
  }

  const isOwner = await verifyOwnership(whopId, user)

  if (!isOwner) {
    return {
      whopId: null,
      response: forbidden('You can only access your own onboarding configuration'),
    }
  }

  return { whopId }
}

/**
 * requireOwnership - Check ownership for a specific whopId
 *
 * Legacy helper for existing routes.
 */
export async function requireOwnership(
  _request: NextRequest,
  whopId: string
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return { authorized: false, response: unauthorized() }
  }

  const isAuthorized = await verifyOwnership(whopId, user)

  if (!isAuthorized) {
    return {
      authorized: false,
      response: forbidden('You can only access your own onboarding configuration'),
    }
  }

  return { authorized: true }
}
