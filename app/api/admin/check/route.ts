import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { WhopAPI } from '@whop/sdk'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    
    // Get Whop authorization token from headers
    // Whop passes this in the Authorization header when in iframe
    const authHeader = headersList.get('authorization') || request.headers.get('authorization')
    const whopToken = authHeader?.replace('Bearer ', '')
    
    // Also check for Whop-specific headers
    const whopUserId = headersList.get('x-whop-user-id') || request.headers.get('x-whop-user-id')
    const whopCompanyId = headersList.get('x-whop-company-id') || request.headers.get('x-whop-company-id')
    
    // If we have a token, use Whop SDK to check admin status
    if (whopToken) {
      try {
        const whop = new WhopAPI({ token: whopToken })
        const user = await whop.users.me()
        
        // If we have a company ID, check if user is admin of that company
        if (whopCompanyId) {
          try {
            const members = await whop.companies.retrieveMembers({
              companyId: whopCompanyId,
            })
            
            const userMember = members.data?.find(
              (member: any) => member.user_id === user.id
            )
            
            const isAdmin = userMember?.role === 'admin' || userMember?.role === 'owner'
            
            return NextResponse.json({
              success: true,
              isAdmin,
              userId: user.id,
            })
          } catch (err) {
            console.error('Error checking company membership:', err)
          }
        }
        
        // Fallback: if no company ID, check all companies
        try {
          const companies = await whop.companies.list()
          let isAdmin = false
          
          for (const company of companies.data || []) {
            try {
              const members = await whop.companies.retrieveMembers({
                companyId: company.id,
              })
              
              const userMember = members.data?.find(
                (member: any) => member.user_id === user.id && (member.role === 'admin' || member.role === 'owner')
              )
              
              if (userMember) {
                isAdmin = true
                break
              }
            } catch (err) {
              continue
            }
          }
          
          return NextResponse.json({
            success: true,
            isAdmin,
            userId: user.id,
          })
        } catch (err) {
          console.error('Error listing companies:', err)
        }
      } catch (error: any) {
        console.error('Error with Whop SDK:', error)
      }
    }
    
    // Fallback: check referer to see if request is from Whop
    const referer = headersList.get('referer') || request.headers.get('referer') || ''
    const isFromWhop = referer.includes('whop.com') || referer.includes('whop.io')
    
    // For development: if request is from Whop, assume admin (can be refined later)
    // In production, this should always use proper SDK authentication
    return NextResponse.json({
      success: true,
      isAdmin: isFromWhop && !process.env.WHOP_API_KEY, // Only in dev mode
      message: isFromWhop ? 'Development mode: assuming admin' : 'Could not verify admin status',
    })
  } catch (error: any) {
    console.error('Admin check API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', isAdmin: false },
      { status: 500 }
    )
  }
}

