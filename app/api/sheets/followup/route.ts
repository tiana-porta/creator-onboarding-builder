import { NextRequest, NextResponse } from 'next/server'
import { getIncompleteUsers, markAsContacted, generateFollowUpMessage } from '@/lib/sheets/messaging'

/**
 * This endpoint:
 * 1. Finds users who started onboarding >24h ago but haven't completed
 * 2. Generates follow-up messages
 * 3. Marks them as contacted in the sheet
 * 
 * In production, you'd integrate this with your actual messaging system
 * (email service, SMS, Discord bot, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization
    const { dryRun = false, sendMessages = false } = await request.json().catch(() => ({}))

    // getIncompleteUsers already filters out users who have been contacted
    const incompleteUsers = await getIncompleteUsers()

    const messages = incompleteUsers.map((user) => ({
      user,
      message: generateFollowUpMessage(user),
    }))

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        count: messages.length,
        messages: messages.map((m) => ({
          email: m.user.email,
          step: m.user.step,
          messagePreview: m.message.substring(0, 100) + '...',
        })),
      })
    }

    if (sendMessages) {
      // In production, send actual messages here
      // For now, we'll just log them and mark as contacted
      const results = await Promise.allSettled(
        messages.map(async (item) => {
          try {
            // TODO: Integrate with your messaging service
            // Example: await sendEmail(item.user.email, item.message)
            // Example: await sendDiscordDM(item.user.discordId, item.message)
            
            console.log(`Would send message to ${item.user.email}:`, item.message)
            
            // Mark as contacted
            await markAsContacted(item.user.rowNumber)
            
            return { success: true, email: item.user.email }
          } catch (error: any) {
            console.error(`Failed to send to ${item.user.email}:`, error)
            return { success: false, email: item.user.email, error: error.message }
          }
        })
      )

      return NextResponse.json({
        success: true,
        sent: results.filter((r) => r.status === 'fulfilled' && r.value.success).length,
        failed: results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length,
        results: results.map((r) => 
          r.status === 'fulfilled' ? r.value : { success: false, error: r.reason }
        ),
      })
    }

    return NextResponse.json({
      success: true,
      count: messages.length,
      message: 'Use dryRun=true to preview or sendMessages=true to actually send',
      users: messages.map((m) => ({
        email: m.user.email,
        step: m.user.step,
        startedAt: m.user.startedAt,
      })),
    })
  } catch (error: any) {
    console.error('Follow-up error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
