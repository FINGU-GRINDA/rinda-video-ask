import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Play, MoreHorizontal, Eye, MessageSquare, Clock, Calendar } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

export default async function VideosPage() {
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

  // Fetch videos
  const { data: videosData } = await supabase
    .from('video_messages')
    .select('*')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })

  // Type the videos data
  type VideoType = {
    id: string
    title: string
    description?: string
    thumbnail_url?: string | null
    duration: number
    is_active: boolean
    view_count: number
    response_count: number
    trigger_rules?: { type: string; value: unknown }[]
    created_at: string
  }
  const videos = videosData as VideoType[] | null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">영상 관리</h1>
          <p className="text-muted-foreground">녹화한 영상을 관리하고 트리거를 설정하세요</p>
        </div>
        <Link
          href="/videos/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 영상 녹화
        </Link>
      </div>

      {/* Videos Grid */}
      {videos && videos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div
              key={video.id}
              className="bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <Link href={`/videos/${video.id}`} className="relative aspect-video bg-gray-100 flex items-center justify-center group">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/80" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-600 ml-1" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
                {/* Status Badge */}
                {!video.is_active && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    비활성
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/videos/${video.id}`} className="font-medium hover:text-primary-500 transition-colors">
                    {video.title}
                  </Link>
                  <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {video.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {video.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {video.response_count}
                  </span>
                </div>

                {/* Triggers */}
                {video.trigger_rules && (video.trigger_rules as any[]).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(video.trigger_rules as any[]).slice(0, 3).map((rule: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full"
                      >
                        {rule.type === 'page_url' && `URL: ${rule.value}`}
                        {rule.type === 'time_on_page' && `${rule.value}초 후`}
                        {rule.type === 'scroll_depth' && `스크롤 ${rule.value}%`}
                        {rule.type === 'exit_intent' && '이탈 시도'}
                        {rule.type === 'returning_visitor' && '재방문자'}
                      </span>
                    ))}
                    {(video.trigger_rules as any[]).length > 3 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        +{(video.trigger_rules as any[]).length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(video.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-background rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">아직 영상이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 환영 영상을 녹화하고 방문자와 소통을 시작하세요
          </p>
          <Link
            href="/videos/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 영상 녹화하기
          </Link>
        </div>
      )}
    </div>
  )
}
