#!/usr/bin/env node

/**
 * Standalone script to check for incomplete onboarding users and send follow-up messages.
 * Can be run as a cron job or scheduled task.
 * 
 * Usage:
 *   npm run followup -- --dry-run
 *   npm run followup -- --send
 */

import { getIncompleteUsers, generateFollowUpMessage, markAsContacted } from '../lib/sheets/messaging'

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run') || args.includes('-d')
  const send = args.includes('--send') || args.includes('-s')

  try {
    console.log('🔍 Checking for incomplete onboarding users...')
    const incompleteUsers = await getIncompleteUsers()

    if (incompleteUsers.length === 0) {
      console.log('✅ All users have completed onboarding!')
      return
    }

    console.log(`\n📊 Found ${incompleteUsers.length} incomplete user(s):\n`)

    incompleteUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'} (Step ${user.step}/6)`)
      console.log(`   Started: ${new Date(user.startedAt).toLocaleString()}`)
    })

    if (dryRun) {
      console.log('\n📝 Preview of follow-up messages:\n')
      incompleteUsers.forEach((user, index) => {
        const message = generateFollowUpMessage(user)
        console.log(`\n--- Message ${index + 1} ---`)
        console.log(`To: ${user.email || 'N/A'}`)
        console.log(`Message:\n${message}`)
      })
      console.log('\n✅ Dry run complete. Use --send to actually send messages.')
      return
    }

    if (send) {
      console.log('\n📤 Sending follow-up messages...\n')

      for (const user of incompleteUsers) {
        try {
          const message = generateFollowUpMessage(user)
          
          // TODO: Integrate with your actual messaging service
          // Example:
          // await sendEmail(user.email, message)
          // await sendDiscordDM(user.discordId, message)
          
          console.log(`✅ Message prepared for ${user.email || user.rowNumber}`)
          console.log(`   Message: ${message.substring(0, 100)}...`)
          
          // Mark as contacted in sheet
          await markAsContacted(user.rowNumber)
          
        } catch (error: any) {
          console.error(`❌ Failed to process ${user.email || user.rowNumber}:`, error.message)
        }
      }

      console.log('\n✅ Follow-up process complete!')
    } else {
      console.log('\n💡 Use --dry-run to preview messages or --send to actually send them.')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
