import { NextRequest, NextResponse } from 'next/server'
import { updateIncompleteUsers } from '@/lib/sheets/client'

export async function GET(request: NextRequest) {
  try {
    const result = await updateIncompleteUsers()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to check incomplete users' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      incompleteRows: result.incompleteRows || [],
      count: result.incompleteRows?.length || 0,
    })
  } catch (error: any) {
    console.error('Check incomplete users error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
