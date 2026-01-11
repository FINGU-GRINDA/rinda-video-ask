import { NextRequest, NextResponse } from 'next/server'

interface TimeSlot {
  time: string
  available: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

// Generate demo availability (9 AM - 6 PM, 30-min slots)
function generateDemoAvailability(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const dayOfWeek = date.getDay()

  // Weekends have less availability
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  for (let hour = 9; hour <= 18; hour++) {
    // Random availability, less on weekends
    const baseAvailability = isWeekend ? 0.3 : 0.7

    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: Math.random() < baseAvailability
    })

    if (hour < 18) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        available: Math.random() < baseAvailability
      })
    }
  }

  return slots
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const dateStr = searchParams.get('date')
    const daysCount = parseInt(searchParams.get('days') || '7')

    // Check demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'

    if (isDemoMode) {
      // Generate demo availability for requested days
      const availability: DayAvailability[] = []
      const startDate = dateStr ? new Date(dateStr) : new Date()

      for (let i = 0; i < Math.min(daysCount, 14); i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        availability.push({
          date: date.toISOString().split('T')[0],
          slots: generateDemoAvailability(date)
        })
      }

      return NextResponse.json({
        availability,
        timezone: 'Asia/Seoul',
        projectId: projectId || 'demo'
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        }
      })
    }

    // Production mode with Supabase
    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    // Get project's booking settings
    const { data: project } = await supabase
      .from('projects')
      .select('id, organization_id, widget_config')
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get existing bookings for the date range
    const startDate = dateStr ? new Date(dateStr) : new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + daysCount)

    const { data: bookings } = await supabase
      .from('meeting_bookings')
      .select('booking_date, booking_time, status')
      .eq('project_id', projectId)
      .gte('booking_date', startDate.toISOString().split('T')[0])
      .lte('booking_date', endDate.toISOString().split('T')[0])
      .in('status', ['confirmed', 'pending'])

    // Get availability settings (if exists)
    const { data: availabilitySettings } = await supabase
      .from('booking_availability')
      .select('*')
      .eq('project_id', projectId)

    // Build availability response
    const availability: DayAvailability[] = []

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      const dayOfWeek = date.getDay()

      // Get day-specific settings or use defaults
      type AvailabilitySetting = {
        day_of_week: number
        start_hour?: number
        end_hour?: number
        slot_duration?: number
        is_available?: boolean
      }
      const daySetting = (availabilitySettings as AvailabilitySetting[] | null)?.find(
        (s: AvailabilitySetting) => s.day_of_week === dayOfWeek
      )

      const startHour = daySetting?.start_hour ?? 9
      const endHour = daySetting?.end_hour ?? 18
      const slotDuration = daySetting?.slot_duration ?? 30
      const isAvailable = daySetting?.is_available ?? (dayOfWeek !== 0 && dayOfWeek !== 6)

      const slots: TimeSlot[] = []

      if (isAvailable) {
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += slotDuration) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

            // Check if slot is already booked
            type Booking = { booking_date: string; booking_time: string; status: string }
            const isBooked = (bookings as Booking[] | null)?.some(
              (b: Booking) => b.booking_date === dateKey && b.booking_time === time
            )

            slots.push({
              time,
              available: !isBooked
            })
          }
        }
      }

      availability.push({
        date: dateKey,
        slots
      })
    }

    return NextResponse.json({
      availability,
      timezone: 'Asia/Seoul',
      projectId
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=60'
      }
    })

  } catch (error) {
    console.error('Calendar availability error:', error)
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
    }
  })
}
