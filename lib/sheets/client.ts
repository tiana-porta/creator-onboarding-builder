import { google } from 'googleapis'

export interface OnboardingData {
  email?: string
  step: number
  xp: number
  selectedClass: string | null
  storeUrl: string | null
  storeVerified: boolean
  commitmentAccepted: boolean
  notifMission: boolean
  notifSauce: boolean
  notifAudit: boolean
  notifDaily: boolean
  startedAt: string
  completedAt: string | null
  timestamp: string
}

let sheetsClient: any = null

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  sheetsClient = google.sheets({ version: 'v4', auth })
  return sheetsClient
}

export async function appendToSheet(data: OnboardingData) {
  try {
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      console.error('GOOGLE_SHEETS_SPREADSHEET_ID not set')
      return { success: false, error: 'Spreadsheet ID not configured' }
    }

    const values = [
      [
        data.timestamp,
        data.email || '',
        data.step,
        data.xp,
        data.selectedClass || '',
        data.storeUrl || '',
        data.storeVerified ? 'Yes' : 'No',
        data.commitmentAccepted ? 'Yes' : 'No',
        data.notifMission ? 'Yes' : 'No',
        data.notifSauce ? 'Yes' : 'No',
        data.notifAudit ? 'Yes' : 'No',
        data.notifDaily ? 'Yes' : 'No',
        data.startedAt,
        data.completedAt || '',
        data.completedAt ? 'Completed' : 'In Progress',
        '', // Follow-up Sent (column P)
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:P',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error appending to sheet:', error)
    return { success: false, error: error.message }
  }
}

export async function initializeSheet() {
  try {
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      console.error('GOOGLE_SHEETS_SPREADSHEET_ID not set')
      return { success: false }
    }

    // Set header row
    const headers = [
      'Timestamp',
      'Email',
      'Step',
      'XP',
      'Class',
      'Store URL',
      'Store Verified',
      'Commitment Accepted',
      'Notif: Mission',
      'Notif: Sauce',
      'Notif: Audit',
      'Notif: Daily',
      'Started At',
      'Completed At',
      'Status',
      'Follow-up Sent',
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:P1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error initializing sheet:', error)
    return { success: false, error: error.message }
  }
}

export async function updateIncompleteUsers() {
  try {
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      return { success: false, error: 'Spreadsheet ID not configured' }
    }

    // Get all rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:P',
    })

    const rows = response.data.values || []
    if (rows.length <= 1) return { success: true, updated: 0 } // No data rows

    // Find incomplete users (Status != 'Completed' and started more than 24h ago)
    const now = new Date()
    const incompleteRows: number[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const status = row[14] || ''
      const startedAt = row[12]

      if (status !== 'Completed' && startedAt) {
        const startDate = new Date(startedAt)
        const hoursSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60)

        if (hoursSinceStart > 24) {
          incompleteRows.push(i + 1) // +1 because sheets are 1-indexed
        }
      }
    }

    // Add a note/flag column for incomplete users
    // This is a simplified version - you might want to add a dedicated "Follow-up" column
    if (incompleteRows.length > 0) {
      // You could update a specific column with a flag
      // For now, we'll just return the list
      return { success: true, incompleteRows }
    }

    return { success: true, updated: 0 }
  } catch (error: any) {
    console.error('Error updating incomplete users:', error)
    return { success: false, error: error.message }
  }
}
