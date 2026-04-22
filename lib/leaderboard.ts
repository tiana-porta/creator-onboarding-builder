import { supabaseAdmin } from '@/lib/db/supabase'
import type { OnboardingRecord } from '@/lib/admin/types'

// Get record by userId and whopId
export async function getRecordByUserId(userId: string, whopId: string): Promise<OnboardingRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('onboarding_progress')
    .select(`
      *,
      version:onboarding_version!inner(
        onboarding:onboarding!inner(whop_id)
      )
    `)
    .eq('user_id', userId)
    .eq('version.onboarding.whop_id', whopId)
    .single()

  if (error || !data) return null

  return mapToRecord(data)
}

// Create or update record
export async function upsertRecord(record: Partial<OnboardingRecord> & { userId: string; whopId: string }): Promise<OnboardingRecord> {
  // First, get the published version for this whopId
  const { data: version } = await supabaseAdmin
    .from('onboarding_version')
    .select('id, onboarding!inner(whop_id)')
    .eq('onboarding.whop_id', record.whopId)
    .eq('status', 'published')
    .single()

  if (!version) {
    throw new Error(`No published version found for whopId: ${record.whopId}`)
  }

  const stepData = {
    selectedClass: record.selectedClass || null,
    storeUrl: record.storeUrl || null,
    storeVerified: record.storeVerified || false,
  }

  const { data, error } = await supabaseAdmin
    .from('onboarding_progress')
    .upsert({
      version_id: version.id,
      user_id: record.userId,
      email: record.email || null,
      current_step: record.step || 1,
      xp: record.xp || 0,
      completed: !!record.completedAt,
      step_data: stepData,
      started_at: record.startedAt || new Date().toISOString(),
      completed_at: record.completedAt || null,
    }, {
      onConflict: 'version_id,user_id',
    })
    .select()
    .single()

  if (error) throw error

  return {
    userId: data.user_id,
    whopId: record.whopId,
    email: data.email || undefined,
    step: data.current_step,
    xp: data.xp,
    selectedClass: stepData.selectedClass,
    storeUrl: stepData.storeUrl,
    storeVerified: stepData.storeVerified,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    createdAt: data.started_at,
    updatedAt: data.updated_at,
  }
}

// Get leaderboard stats for a company (aggregates all experiences)
export async function getLeaderboardStats(companyId: string): Promise<{
  totalStarted: number
  totalCompleted: number
  completionRate: number
  averageXP: number
  users: OnboardingRecord[]
}> {
  const { data: records, error } = await supabaseAdmin
    .from('onboarding_progress')
    .select(`
      *,
      version:onboarding_version!inner(
        onboarding:onboarding!inner(whop_id, company_id)
      )
    `)
    .eq('version.onboarding.company_id', companyId)

  if (error) throw error

  const users = (records || []).map(r => mapToRecord(r))

  const totalStarted = users.length
  const totalCompleted = users.filter(r => r.completedAt !== null).length
  const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0
  const averageXP = users.length > 0
    ? users.reduce((sum, r) => sum + r.xp, 0) / users.length
    : 0

  // Sort by completed first, then by XP, then by completion time
  const sortedUsers = [...users].sort((a, b) => {
    if (a.completedAt && !b.completedAt) return -1
    if (!a.completedAt && b.completedAt) return 1
    if (a.xp !== b.xp) return b.xp - a.xp
    if (a.completedAt && b.completedAt) {
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    }
    return 0
  })

  return {
    totalStarted,
    totalCompleted,
    completionRate,
    averageXP,
    users: sortedUsers,
  }
}

function mapToRecord(data: any, whopId?: string): OnboardingRecord {
  const stepData = data.step_data || {}
  return {
    userId: data.user_id,
    whopId: whopId || data.version?.onboarding?.whop_id || '',
    email: data.email || undefined,
    step: data.current_step,
    xp: data.xp,
    selectedClass: stepData.selectedClass || null,
    storeUrl: stepData.storeUrl || null,
    storeVerified: stepData.storeVerified || false,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    createdAt: data.started_at,
    updatedAt: data.updated_at,
  }
}
