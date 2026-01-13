import { NextRequest, NextResponse } from 'next/server'
import { initializeSheet } from '@/lib/sheets/client'

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication here
    const result = await initializeSheet()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to initialize sheet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Sheet initialized' })
  } catch (error: any) {
    console.error('Initialize sheet error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
