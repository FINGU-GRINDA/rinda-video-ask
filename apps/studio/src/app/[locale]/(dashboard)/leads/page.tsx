import { createClient } from '@/lib/supabase/server'
import { LeadInbox } from '@/components/leads/lead-inbox'

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user!.id)
    .single()

  const orgId = membership?.organization_id as string | undefined

  // Get projects for the organization
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('organization_id', orgId || '')

  const projectIds = (projects as { id: string }[] | null)?.map(p => p.id) || []

  // Fetch leads
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      video_messages (
        id,
        title,
        thumbnail_url
      )
    `)
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get team members for assignment
  const { data: teamMembers } = await supabase
    .from('organization_members')
    .select(`
      user_id,
      role,
      users:user_id (
        email,
        raw_user_meta_data
      )
    `)
    .eq('organization_id', orgId || '')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">리드 인박스</h1>
        <p className="text-muted-foreground">방문자 응답을 확인하고 관리하세요</p>
      </div>

      <LeadInbox
        initialLeads={(leads || []) as unknown as Parameters<typeof LeadInbox>[0]['initialLeads']}
        teamMembers={(teamMembers || []) as unknown as Parameters<typeof LeadInbox>[0]['teamMembers']}
        currentUserId={user!.id}
      />
    </div>
  )
}
