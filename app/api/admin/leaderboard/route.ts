import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboardStats } from '@/lib/admin/storage'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const whopId = searchParams.get('whop_id')

  if (!whopId) {
    return NextResponse.json({ error: 'whop_id is required' }, { status: 400 })
  }

  try {
    const stats = await getLeaderboardStats(whopId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

