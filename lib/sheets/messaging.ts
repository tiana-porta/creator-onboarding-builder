import { google } from 'googleapis'

/**
 * This utility handles sending messages to users who haven't completed onboarding.
 * In a real implementation, this would integrate with your messaging system (email, SMS, etc.)
 */

export interface IncompleteUser {
  email?: string
  startedAt: string
  step: number
  rowNumber: number
}

export async function getIncompleteUsers(): Promise<IncompleteUser[]> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set')
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:P',
    })

    const rows = response.data.values || []
    if (rows.length <= 1) return []

    const now = new Date()
    const incompleteUsers: IncompleteUser[] = []

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const email = row[1] || ''
      const status = row[14] || ''
      const startedAt = row[12]
      const followUpSent = row[15] || '' // Column P

      if (status !== 'Completed' && startedAt) {
        const startDate = new Date(startedAt)
        const hoursSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60)

        // Users who started more than 24 hours ago and haven't completed
        // and haven't been contacted yet
        if (hoursSinceStart > 24 && !followUpSent) {
          incompleteUsers.push({
            email: email || `user-row-${i + 1}`,
            startedAt,
            step: parseInt(row[2] || '0'),
            rowNumber: i + 1,
          })
        }
      }
    }

    return incompleteUsers
  } catch (error: any) {
    console.error('Error getting incomplete users:', error)
    throw error
  }
}

export async function markAsContacted(rowNumber: number) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set')
    }

    // Add a "Contacted" column (column P) to track if we've sent a message
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!P${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Yes']],
      },
    })
  } catch (error: any) {
    console.error('Error marking as contacted:', error)
    throw error
  }
}

export function generateFollowUpMessage(user: IncompleteUser): string {
  return `Hi there! 👋

I noticed you joined Whop University and didn't complete onboarding. This is very vital for your success!

You were on step ${user.step} of 6. Complete your onboarding to unlock:
- Access to all course modules
- Community discussions
- Live sessions
- $10k Architecture blueprint

Continue here: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/onboarding

Let's get you to $10k! 🚀`
}
