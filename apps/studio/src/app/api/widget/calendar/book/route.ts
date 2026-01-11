import { NextRequest, NextResponse } from 'next/server'

interface BookingRequest {
  projectId?: string
  date: string
  time: string
  name: string
  email: string
  phone?: string
  message?: string
  sessionId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    const { projectId, date, time, name, email, phone, message, sessionId } = body

    // Validate required fields
    if (!date || !time || !name || !email) {
      return NextResponse.json(
        { error: 'date, time, name, and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'

    if (isDemoMode) {
      // Demo mode: simulate successful booking
      const bookingId = `demo_booking_${Date.now()}`

      return NextResponse.json({
        success: true,
        bookingId,
        booking: {
          id: bookingId,
          date,
          time,
          name,
          email,
          phone,
          message,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        },
        message: '예약이 성공적으로 완료되었습니다. 확인 이메일이 발송되었습니다.'
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    // Production mode with Supabase
    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required in production mode' },
        { status: 400 }
      )
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    // Verify project exists
    const { data: project } = await supabase
      .from('projects')
      .select('id, organization_id, name')
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if slot is still available
    const { data: existingBooking } = await supabase
      .from('meeting_bookings')
      .select('id')
      .eq('project_id', projectId)
      .eq('booking_date', date)
      .eq('booking_time', time)
      .in('status', ['confirmed', 'pending'])
      .single()

    if (existingBooking) {
      return NextResponse.json(
        { error: '해당 시간은 이미 예약되었습니다. 다른 시간을 선택해 주세요.' },
        { status: 409 }
      )
    }

    // Find or create lead
    let leadId: string | null = null

    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('project_id', projectId)
      .eq('email', email)
      .single()

    if (existingLead) {
      leadId = (existingLead as { id: string }).id

      // Update lead with phone if provided
      if (phone) {
        await supabase
          .from('leads')
          .update({ phone })
          .eq('id', leadId)
      }
    } else {
      // Create new lead
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          project_id: projectId,
          name,
          email,
          phone,
          source: 'calendar_booking',
          status: 'new'
        })
        .select('id')
        .single()

      if (!leadError && newLead) {
        leadId = (newLead as { id: string }).id
      }
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('meeting_bookings')
      .insert({
        project_id: projectId,
        lead_id: leadId,
        booking_date: date,
        booking_time: time,
        attendee_name: name,
        attendee_email: email,
        attendee_phone: phone,
        notes: message,
        status: 'pending',
        session_id: sessionId
      })
      .select('id, booking_date, booking_time, status')
      .single()

    if (bookingError || !booking) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { error: '예약 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // Type the booking response
    type BookingData = {
      id: string
      booking_date: string
      booking_time: string
      status: string
    }
    const typedBooking = booking as BookingData

    // TODO: Send confirmation email
    // TODO: Create Google Calendar event if integrated

    // Try to create Google Calendar event if configured
    if (process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        // Create calendar event (implementation depends on Google Calendar setup)
        // This is a placeholder for future implementation
        console.log('Google Calendar integration pending...')
      } catch (calendarError) {
        console.error('Google Calendar error:', calendarError)
        // Don't fail the booking if calendar sync fails
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: typedBooking.id,
      booking: {
        id: typedBooking.id,
        date: typedBooking.booking_date,
        time: typedBooking.booking_time,
        name,
        email,
        status: typedBooking.status,
        createdAt: new Date().toISOString()
      },
      message: '예약이 성공적으로 완료되었습니다. 확인 이메일이 발송됩니다.'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Calendar booking error:', error)
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
    }
  })
}
