import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const supabase = await createServiceClient()

    // Verify project exists and is active
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, widget_config')
      .eq('id', projectId)
      .eq('is_active', true)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get active videos with their trigger rules
    const { data: videos, error: videosError } = await supabase
      .from('video_messages')
      .select(`
        id,
        title,
        video_url,
        thumbnail_url,
        duration,
        trigger_rules,
        response_options,
        next_video_map
      `)
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (videosError) {
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }

    // Type for video data
    type VideoData = {
      id: string
      title: string
      video_url: string
      thumbnail_url?: string | null
      duration: number
      trigger_rules?: unknown[]
      response_options?: unknown[]
      next_video_map?: Record<string, string>
    }

    // Transform to camelCase for widget
    const typedVideos = videos as VideoData[] | null
    const transformedVideos = typedVideos?.map(video => ({
      id: video.id,
      title: video.title,
      videoUrl: video.video_url,
      thumbnailUrl: video.thumbnail_url,
      duration: video.duration,
      triggerRules: video.trigger_rules || [],
      responseOptions: video.response_options || [],
      nextVideoMap: video.next_video_map || {},
    })) || []

    const typedProject = project as { id: string; widget_config?: unknown } | null
    return NextResponse.json({
      videos: transformedVideos,
      config: typedProject?.widget_config,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (error) {
    console.error('Widget videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
