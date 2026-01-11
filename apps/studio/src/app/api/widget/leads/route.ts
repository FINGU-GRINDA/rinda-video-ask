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
      interactionType,
      responseUrl,
      responseText,
      visitorContext,
      contactInfo,
    } = body

    const supabase = await createServiceClient()

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('is_active', true)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        project_id: projectId,
        video_message_id: videoMessageId,
        visitor_id: visitorId,
        session_id: sessionId,
        interaction_type: interactionType,
        response_url: responseUrl,
        response_text: responseText,
        visitor_context: {
          page_url: visitorContext?.pageUrl || '',
          page_title: visitorContext?.pageTitle || '',
          referrer: visitorContext?.referrer || null,
          utm_source: visitorContext?.utmSource || null,
          utm_medium: visitorContext?.utmMedium || null,
          utm_campaign: visitorContext?.utmCampaign || null,
          utm_content: visitorContext?.utmContent || null,
          utm_term: visitorContext?.utmTerm || null,
          device_type: visitorContext?.deviceType || 'desktop',
          browser: visitorContext?.browser || '',
          os: visitorContext?.os || '',
          country: visitorContext?.country || null,
          city: visitorContext?.city || null,
          company_info: visitorContext?.companyInfo || null,
          visit_count: visitorContext?.visitCount || 1,
          pages_viewed: visitorContext?.pagesViewed || [],
          time_on_site: visitorContext?.timeOnSite || 0,
          scroll_depth: visitorContext?.scrollDepth || 0,
        },
        contact_info: contactInfo ? {
          name: contactInfo.name || null,
          email: contactInfo.email || null,
          phone: contactInfo.phone || null,
        } : null,
        status: 'new',
      })
      .select('id')
      .single()

    if (leadError) {
      console.error('Lead insert error:', leadError)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // Trigger AI processing asynchronously
    if (responseUrl || responseText) {
      // In production, this would call a Supabase Edge Function
      // For now, we'll just return the lead ID
      // fetch(`${process.env.SUPABASE_URL}/functions/v1/process-response`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     leadId: lead.id,
      //     responseUrl,
      //     responseText,
      //     interactionType,
      //   }),
      // })
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Lead creation error:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
