/**
 * Ownership verification for multi-tenancy
 *
 * Ensures creators can only access and modify their own onboarding configs.
 */

import { verifyUser, getDevUser } from './whop'

export interface AuthContext {
  userId: string
  companyId?: string
  email?: string
}

/**
 * Get authenticated user from request context
 *
 * Returns the authenticated user or null if not authenticated.
 * In development mode, returns a mock user if no real auth is available.
 */
export async function getAuthenticatedUser(): Promise<AuthContext | null> {
  // Try to get real user from Whop SDK
  const user = await verifyUser()

  if (user) {
    return {
      userId: user.userId,
      companyId: user.companyId,
    }
  }

  // Fall back to dev user in development mode only
  if (process.env.NODE_ENV === 'development') {
    const devUser = getDevUser()
    if (devUser) {
      return {
        userId: devUser.userId,
        companyId: devUser.companyId,
      }
    }
  }

  return null
}

/**
 * Verify that a user owns the whopId they're trying to access
 *
 * For multi-tenancy, the user's companyId must match the requested whopId
 */
export async function verifyOwnership(
  requestedWhopId: string,
  authContext?: AuthContext
): Promise<boolean> {
  if (!authContext) {
    return false
  }

  // The companyId from Whop represents the whopId for this context
  return authContext.companyId === requestedWhopId
}

/**
 * Get the authenticated user's whopId (companyId in Whop terms)
 */
export async function getAuthenticatedWhopId(): Promise<string | null> {
  const user = await getAuthenticatedUser()
  return user?.companyId || null
}
