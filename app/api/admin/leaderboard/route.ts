import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboardStats } from '@/lib/admin/storage'

export async function GET(request: NextRequest) {
  try {
    // For development: allow access without auth if WHOP_API_KEY is not set
    // In production, implement proper Whop SDK authentication
    const apiKey = request.headers.get('x-admin-api-key')
    const expectedKey = process.env.WHOP_API_KEY
    
    // Only enforce auth if API key is configured
    if (expectedKey) {
      if (!apiKey || apiKey !== expectedKey) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 401 }
        )
      }
    }

    // Get leaderboard stats
    const stats = await getLeaderboardStats()

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

