import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectId,
      videoMessageId,
      visitorId,
      sessionId,
      eventType,
      eventData,
    } = body

    const supabase = await createServiceClient()

    // Insert analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        project_id: projectId,
        video_message_id: videoMessageId,
        visitor_id: visitorId,
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData || {},
      })

    if (error) {
      console.error('Analytics event error:', error)
      // Don't fail the request for analytics errors
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ success: false }, {
      status: 200, // Return 200 to not block the widget
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
