/**
 * Whop SDK Authentication
 *
 * Server-side authentication using the Whop SDK
 */

import Whop from '@whop/sdk'
import { headers } from 'next/headers'

// Initialize Whop SDK client
const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY,
})

export interface WhopUser {
  userId: string
  companyId?: string
  email?: string
}

/**
 * Verify user token from request headers (server-side)
 *
 * Use in Server Components or API routes:
 * ```ts
 * const user = await verifyUser()
 * if (!user) return unauthorized()
 * ```
 */
export async function verifyUser(): Promise<WhopUser | null> {
  try {
    const headersList = await headers()

    // The Whop SDK injects user info via headers when running in a Whop app context
    // verifyUserToken validates the token and returns user info
    const result = await whop.verifyUserToken(headersList, { dontThrow: true })

    if (!result || !result.userId) {
      return null
    }

    return {
      userId: result.userId,
      // companyId may be available for dashboard/admin apps
    }
  } catch (error) {
    console.error('Error verifying user token:', error)
    return null
  }
}

/**
 * Get user with access check for a specific experience/company
 *
 * Use when you need to verify the user has access to a specific resource
 */
export async function verifyUserWithAccess(
  resourceId: string,
  resourceType: 'experience' | 'company' = 'experience'
): Promise<{ user: WhopUser; hasAccess: boolean; accessLevel?: string } | null> {
  const user = await verifyUser()

  if (!user) {
    return null
  }

  try {
    const access = await whop.users.checkAccess(resourceId, { id: user.userId })

    return {
      user,
      hasAccess: access.has_access,
      accessLevel: access.access_level,
    }
  } catch (error) {
    console.error('Error checking user access:', error)
    return {
      user,
      hasAccess: false,
    }
  }
}

/**
 * Check if user is an admin for a company
 */
export async function isUserAdmin(companyId: string): Promise<boolean> {
  const result = await verifyUserWithAccess(companyId, 'company')
  return result?.accessLevel === 'admin'
}

/**
 * Development fallback - returns mock user in dev mode
 * Use sparingly and only for local development
 */
export function getDevUser(): WhopUser | null {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return {
    userId: process.env.DEV_USER_ID || 'dev-user-1',
    companyId: process.env.DEV_COMPANY_ID || 'demo-whop-1',
  }
}

export { whop }
