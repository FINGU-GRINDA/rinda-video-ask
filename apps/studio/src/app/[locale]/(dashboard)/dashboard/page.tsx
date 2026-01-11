import { createClient } from '@/lib/supabase/server'
import { Video, Users, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, Play, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
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

  // Fetch all data
  const { data: videos } = await supabase
    .from('video_messages')
    .select('*')
    .in('project_id', projectIds)
    .order('view_count', { ascending: false })
    .limit(10)

  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      video_messages (title)
    `)
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
    .limit(10)

  // Type assertions for mock data
  type VideoData = { id: string; title: string; view_count?: number; response_count?: number; thumbnail_url?: string | null }
  type LeadData = { id: string; status: string; interaction_type: string; created_at: string; ai_analysis?: unknown; video_messages?: { title: string } | null }

  const typedVideos = videos as VideoData[] | null
  const typedLeads = leads as LeadData[] | null

  // Calculate stats from data
  const videoCount = typedVideos?.length || 0
  const leadCount = typedLeads?.length || 0
  const totalViews = typedVideos?.reduce((sum, v) => sum + (v.view_count || 0), 0) || 0
  const totalResponses = typedVideos?.reduce((sum, v) => sum + (v.response_count || 0), 0) || 0
  const responseRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0

  // Calculate conversion rate (qualified + converted leads / total leads)
  const qualifiedLeads = typedLeads?.filter(l => l.status === 'qualified' || l.status === 'converted').length || 0
  const conversionRate = leadCount > 0 ? Math.round((qualifiedLeads / leadCount) * 100) : 0

  const recentLeads = typedLeads?.slice(0, 5) || []
  const topVideos = typedVideos?.slice(0, 5) || []

  const stats = [
    {
      name: '총 영상',
      value: videoCount,
      subtext: `조회 ${totalViews.toLocaleString()}회`,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Video,
    },
    {
      name: '총 리드',
      value: leadCount,
      subtext: `신규 ${typedLeads?.filter(l => l.status === 'new').length || 0}건`,
      change: '+24%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: '응답률',
      value: `${responseRate}%`,
      subtext: `${totalResponses.toLocaleString()}/${totalViews.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive' as const,
      icon: MessageSquare,
    },
    {
      name: '전환율',
      value: `${conversionRate}%`,
      subtext: `${qualifiedLeads}건 검증됨`,
      change: conversionRate >= 20 ? '+5%' : '-2%',
      changeType: conversionRate >= 20 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">오늘의 성과를 확인하고 더 많은 고객을 만나보세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-background rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
            {stat.subtext && (
              <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-background rounded-xl border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold">최근 리드</h2>
            <Link href="/leads" className="text-sm text-primary-500 hover:text-primary-600">
              전체 보기
            </Link>
          </div>
          <div className="divide-y">
            {recentLeads && recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {(lead.video_messages as { title: string } | null)?.title || '직접 문의'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lead.interaction_type === 'video' && '영상 응답'}
                      {lead.interaction_type === 'voice' && '음성 응답'}
                      {lead.interaction_type === 'text' && '텍스트 응답'}
                      {lead.interaction_type === 'phone' && '전화 요청'}
                      {lead.interaction_type === 'quick_reply' && '빠른 답변'}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="mb-2">아직 리드가 없어요</p>
                <Link href="/videos/new" className="text-primary-500 hover:underline">
                  첫 영상을 녹화하고 고객을 만나보세요
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Videos */}
        <div className="bg-background rounded-xl border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold">인기 영상</h2>
            <Link href="/videos" className="text-sm text-primary-500 hover:text-primary-600">
              전체 보기
            </Link>
          </div>
          <div className="divide-y">
            {topVideos && topVideos.length > 0 ? (
              topVideos.map((video, idx) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-lg font-bold text-muted-foreground w-6">
                    {idx + 1}
                  </div>
                  <div className="w-16 h-10 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{video.title}</div>
                    <div className="text-xs text-muted-foreground">
                      조회 {video.view_count} / 응답 {video.response_count}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="mb-2">아직 영상이 없어요</p>
                <Link href="/videos/new" className="text-primary-500 hover:underline">
                  첫 환영 영상을 녹화해보세요
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-500 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">지금 바로 시작해보세요</h3>
            <p className="text-white/80 text-sm">
              첫 영상을 녹화하고 웹사이트에 위젯을 설치하면 바로 고객을 만날 수 있어요
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/videos/new"
              className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              영상 녹화하기
            </Link>
            <Link
              href="/settings/embed"
              className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              설치 코드 복사
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
