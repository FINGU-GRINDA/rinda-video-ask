import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  projectId?: string
  message: string
  sessionId: string
  visitorId?: string
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

// In-memory store for demo conversations (replace with DB in production)
const conversationStore = new Map<string, ConversationMessage[]>()

// Demo AI responses based on keywords
function generateDemoResponse(message: string, history: ConversationMessage[]): string {
  const lowercaseMsg = message.toLowerCase()

  // Check for greetings
  if (lowercaseMsg.includes('안녕') || lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
    return '안녕하세요! 무엇을 도와드릴까요? 😊'
  }

  // Check for pricing questions
  if (lowercaseMsg.includes('가격') || lowercaseMsg.includes('요금') || lowercaseMsg.includes('비용') || lowercaseMsg.includes('price')) {
    return '요금제에 대해 문의해 주셨네요! 저희는 무료 체험부터 시작할 수 있고, 프로 플랜은 월 49,000원부터 시작합니다. 자세한 내용은 담당자와 상담 예약을 통해 안내받으실 수 있어요.'
  }

  // Check for feature questions
  if (lowercaseMsg.includes('기능') || lowercaseMsg.includes('feature') || lowercaseMsg.includes('할 수 있')) {
    return '린다애스크는 영상 메시지, AI 챗봇, 미팅 예약 기능을 제공합니다. 웹사이트에 위젯을 설치하면 방문자와 실시간으로 소통하고 리드를 수집할 수 있어요!'
  }

  // Check for contact/support
  if (lowercaseMsg.includes('연락') || lowercaseMsg.includes('전화') || lowercaseMsg.includes('상담') || lowercaseMsg.includes('문의')) {
    return '상담을 원하시면 전화(010-6326-9009)로 연락 주시거나, 미팅 예약을 통해 편한 시간에 상담받으실 수 있습니다. 제가 도움을 드릴 수 있는 부분이 있으면 말씀해 주세요!'
  }

  // Check for demo/trial
  if (lowercaseMsg.includes('데모') || lowercaseMsg.includes('체험') || lowercaseMsg.includes('무료') || lowercaseMsg.includes('trial')) {
    return '네! 무료 체험을 바로 시작하실 수 있어요. 회원가입 후 바로 영상 녹화와 위젯 설정이 가능합니다. 도움이 필요하시면 언제든 물어봐 주세요!'
  }

  // Check for integration
  if (lowercaseMsg.includes('연동') || lowercaseMsg.includes('설치') || lowercaseMsg.includes('integration') || lowercaseMsg.includes('install')) {
    return '위젯 설치는 간단한 스크립트 한 줄을 웹사이트에 추가하면 됩니다. WordPress, Shopify 등 다양한 플랫폼과 호환되며, 기술적인 도움이 필요하시면 말씀해 주세요!'
  }

  // Check for thanks
  if (lowercaseMsg.includes('감사') || lowercaseMsg.includes('고마') || lowercaseMsg.includes('thank')) {
    return '도움이 되어 기뻐요! 다른 궁금한 점이 있으시면 언제든 물어봐 주세요. 😊'
  }

  // Default responses
  const defaultResponses = [
    '좋은 질문이에요! 조금 더 자세히 말씀해 주시면 정확한 답변을 드릴 수 있을 것 같아요.',
    '네, 말씀하신 내용 확인했습니다. 추가로 궁금한 점이 있으시면 알려주세요!',
    '해당 내용은 담당자가 더 자세히 안내해 드릴 수 있어요. 미팅 예약을 원하시면 말씀해 주세요!',
    '잘 이해했습니다. 다른 도움이 필요하신 부분이 있으신가요?'
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { projectId, message, sessionId, visitorId } = body

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    // Check if this is demo mode (no real Supabase)
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'

    if (isDemoMode) {
      // Get or create conversation history
      let history = conversationStore.get(sessionId) || []

      // Add user message to history
      history.push({ role: 'user', content: message })

      // Generate demo response
      const response = generateDemoResponse(message, history)

      // Add assistant response to history
      history.push({ role: 'assistant', content: response })

      // Keep only last 20 messages
      if (history.length > 20) {
        history = history.slice(-20)
      }

      // Store updated history
      conversationStore.set(sessionId, history)

      return NextResponse.json({
        response,
        sessionId,
        conversationId: `demo_conv_${sessionId}`
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    // Production mode with actual Supabase
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    // Get project info for knowledge base
    const { data: project } = await supabase
      .from('projects')
      .select('id, organization_id, name')
      .eq('id', projectId || '')
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check for existing conversation or create new one
    let conversationId: string

    const { data: existingConversation } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('session_id', sessionId)
      .eq('project_id', projectId || '')
      .single()

    if (existingConversation) {
      conversationId = (existingConversation as { id: string }).id
    } else {
      const { data: newConversation, error: createError } = await supabase
        .from('ai_conversations')
        .insert({
          project_id: projectId,
          session_id: sessionId,
          visitor_id: visitorId,
          status: 'active'
        })
        .select('id')
        .single()

      if (createError || !newConversation) {
        console.error('Failed to create conversation:', createError)
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        )
      }
      conversationId = (newConversation as { id: string }).id
    }

    // Save user message
    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    })

    // Try to use Claude API for response if available
    let aiResponse: string

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        // Get conversation history
        const { data: messages } = await supabase
          .from('ai_messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(10)

        // Get knowledge base context
        const { data: knowledge } = await supabase
          .rpc('match_knowledge_base', {
            query_embedding: [], // Would need actual embedding
            match_threshold: 0.7,
            match_count: 3,
            p_project_id: projectId
          })

        const knowledgeContext = knowledge?.map((k: { content: string }) => k.content).join('\n') || ''

        // Call Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            system: `You are a helpful customer service AI assistant for ${project.name}.
Be friendly, helpful, and concise. Answer in Korean.
${knowledgeContext ? `\nRelevant information:\n${knowledgeContext}` : ''}`,
            messages: messages?.map(m => ({
              role: m.role,
              content: m.content
            })) || [{ role: 'user', content: message }]
          })
        })

        const claudeData = await claudeResponse.json()
        aiResponse = claudeData.content?.[0]?.text || generateDemoResponse(message, [])
      } catch (error) {
        console.error('Claude API error:', error)
        aiResponse = generateDemoResponse(message, [])
      }
    } else {
      aiResponse = generateDemoResponse(message, [])
    }

    // Save AI response
    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse
    })

    return NextResponse.json({
      response: aiResponse,
      sessionId,
      conversationId
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
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
