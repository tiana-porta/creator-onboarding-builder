import { NextRequest, NextResponse } from 'next/server'
import { getDraftVersion, updateDraftTheme, versionToConfig } from '@/lib/onboarding/service'
import { prisma } from '@/lib/db/client'
import {
  withAuth,
  badRequest,
  notFound,
  serverError,
  type AuthenticatedContext,
} from '@/lib/auth/middleware'

// GET /api/onboarding/draft?whop_id=...
export const GET = withAuth(async (_request: NextRequest, { whopId }: AuthenticatedContext) => {
  try {
    if (!prisma) {
      return serverError('Database client not initialized')
    }

    const draft = await getDraftVersion(whopId)
    const fullVersion = await prisma.onboardingVersion.findUnique({
      where: { id: draft.id },
      include: { onboarding: true },
    })

    if (!fullVersion) {
      return notFound('Draft not found')
    }

    const config = versionToConfig(fullVersion)
    return NextResponse.json(config)
  } catch (error: unknown) {
    console.error('Error fetching draft:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch draft'
    const stack = error instanceof Error ? error.stack : undefined
    return serverError(message, stack)
  }
})

// PUT /api/onboarding/draft - Update draft theme
export const PUT = withAuth(async (request: NextRequest, { whopId }: AuthenticatedContext) => {
  try {
    if (!prisma) {
      return serverError('Database client not initialized')
    }

    let body
    try {
      body = await request.json()
    } catch {
      return badRequest('Invalid JSON in request body')
    }

    const { theme, welcomeTitle, welcomeSubtitle, welcomeCompleted } = body

    let draft
    try {
      draft = await getDraftVersion(whopId)
    } catch (e: unknown) {
      console.error('Error getting draft version:', e)
      const message = e instanceof Error ? e.message : 'Unknown error'
      return serverError(`Failed to get draft: ${message}`)
    }

    if (!draft || !draft.id) {
      return notFound('Draft not found or invalid')
    }

    if (theme) {
      try {
        await updateDraftTheme(whopId, theme)
      } catch (e: unknown) {
        console.error('Error updating theme:', e)
        const message = e instanceof Error ? e.message : 'Unknown error'
        return serverError(`Failed to update theme: ${message}`)
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
      } catch (e: unknown) {
        console.error('Error updating welcome fields:', e)
        const message = e instanceof Error ? e.message : 'Unknown error'
        return serverError(`Failed to update welcome fields: ${message}`)
      }
    }

    let updated
    try {
      updated = await prisma.onboardingVersion.findUnique({
        where: { id: draft.id },
        include: { onboarding: true },
      })
    } catch (e: unknown) {
      console.error('Error fetching updated version:', e)
      const message = e instanceof Error ? e.message : 'Unknown error'
      return serverError(`Failed to fetch updated version: ${message}`)
    }

    if (!updated) {
      return serverError('Failed to update draft')
    }

    let config
    try {
      config = versionToConfig(updated)
    } catch (e: unknown) {
      console.error('Error converting to config:', e)
      const message = e instanceof Error ? e.message : 'Unknown error'
      return serverError(`Failed to convert version: ${message}`)
    }

    return NextResponse.json(config)
  } catch (error: unknown) {
    console.error('Unexpected error updating draft:', error)
    const message = error instanceof Error ? error.message : 'Failed to update draft'
    const stack = error instanceof Error ? error.stack : undefined
    return serverError(message, stack)
  }
})
