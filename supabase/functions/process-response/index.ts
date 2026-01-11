import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseAdmin } from '../_shared/supabase.ts'

interface ProcessRequest {
  leadId: string
  responseUrl?: string
  responseText?: string
  interactionType: 'video' | 'voice' | 'text' | 'phone' | 'quick_reply'
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, responseUrl, responseText, interactionType }: ProcessRequest = await req.json()

    const supabase = getSupabaseAdmin()

    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*, projects(ai_config, organization_id)')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      throw new Error('Lead not found')
    }

    let transcription = responseText || null
    let translation = null

    // Step 1: Transcribe audio/video with Whisper
    if ((interactionType === 'video' || interactionType === 'voice') && responseUrl) {
      transcription = await transcribeWithWhisper(responseUrl)
    }

    // Step 2: Translate if not Korean
    if (transcription) {
      const detectedLanguage = detectLanguage(transcription)
      if (detectedLanguage !== 'ko') {
        translation = await translateWithRinda(transcription, detectedLanguage, 'ko')
      }
    }

    // Step 3: Analyze with Claude
    const aiAnalysis = await analyzeWithClaude(
      transcription || '',
      lead.visitor_context,
      (lead.projects as any)?.ai_config
    )

    // Update the lead with processed data
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        transcription,
        translation,
        ai_analysis: aiAnalysis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)

    if (updateError) {
      throw updateError
    }

    // Step 4: Send notifications if high-value lead
    if (aiAnalysis.lead_score >= 70) {
      await sendNotifications(lead, aiAnalysis)
    }

    // Step 5: Check if AI should auto-respond
    const projectAiConfig = (lead.projects as any)?.ai_config
    if (projectAiConfig?.enabled && projectAiConfig?.auto_respond) {
      // Check for escalation keywords
      const shouldEscalate = checkEscalationKeywords(
        transcription || '',
        projectAiConfig.escalation_keywords || []
      )

      if (!shouldEscalate) {
        // Generate AI response
        await generateAIResponse(lead, transcription || '', aiAnalysis)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcription,
        translation,
        ai_analysis: aiAnalysis,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Process response error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function transcribeWithWhisper(audioUrl: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Fetch the audio file
  const audioResponse = await fetch(audioUrl)
  const audioBlob = await audioResponse.blob()

  // Create form data for Whisper API
  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'ko') // Prioritize Korean but will auto-detect

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.text
}

async function translateWithRinda(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  const rindaApiKey = Deno.env.get('RINDA_API_KEY')

  // If Rinda API is not configured, use Claude for translation
  if (!rindaApiKey) {
    return translateWithClaude(text, fromLang, toLang)
  }

  try {
    const response = await fetch('https://api.rinda.ai/v1/translate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${rindaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source_language: fromLang,
        target_language: toLang,
      }),
    })

    if (!response.ok) {
      throw new Error('Rinda API error')
    }

    const result = await response.json()
    return result.translated_text
  } catch {
    // Fallback to Claude
    return translateWithClaude(text, fromLang, toLang)
  }
}

async function translateWithClaude(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!anthropicApiKey) {
    return text // Return original if no API key
  }

  const langNames: Record<string, string> = {
    ko: 'Korean',
    en: 'English',
    ja: 'Japanese',
    zh: 'Chinese',
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Translate the following text from ${langNames[fromLang] || fromLang} to ${langNames[toLang] || toLang}. Only output the translation, nothing else:\n\n${text}`,
        },
      ],
    }),
  })

  const result = await response.json()
  return result.content[0].text
}

interface AIAnalysis {
  summary: string
  intent: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentiment_score: number
  bant_score: {
    budget: number
    authority: number
    need: number
    timeline: number
    total: number
  }
  lead_score: number
  recommended_actions: string[]
  keywords: string[]
  language_detected: string
}

async function analyzeWithClaude(
  text: string,
  visitorContext: any,
  aiConfig: any
): Promise<AIAnalysis> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!anthropicApiKey) {
    return getDefaultAnalysis(text)
  }

  const prompt = `You are an AI sales assistant analyzing a lead's response. Analyze the following visitor response and provide insights.

Visitor Response: "${text}"

Visitor Context:
- Page visited: ${visitorContext?.page_url || 'Unknown'}
- Device: ${visitorContext?.device_type || 'Unknown'}
- Visit count: ${visitorContext?.visit_count || 1}
- Time on site: ${visitorContext?.time_on_site || 0} seconds
- Referrer: ${visitorContext?.referrer || 'Direct'}

Provide your analysis in the following JSON format (respond ONLY with valid JSON):
{
  "summary": "Brief 1-2 sentence summary of what the visitor wants",
  "intent": "Primary intent (e.g., pricing_inquiry, demo_request, support_question, general_info)",
  "sentiment": "positive" | "neutral" | "negative",
  "sentiment_score": 0-100 (100 being most positive),
  "bant_score": {
    "budget": 0-25 (score for budget qualification),
    "authority": 0-25 (score for decision-making authority),
    "need": 0-25 (score for demonstrated need),
    "timeline": 0-25 (score for urgency/timeline),
    "total": 0-100 (sum of above)
  },
  "lead_score": 0-100 (overall lead quality score),
  "recommended_actions": ["action1", "action2"],
  "keywords": ["keyword1", "keyword2"],
  "language_detected": "ko" | "en" | "ja" | "zh" | "other"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    const result = await response.json()
    const analysisText = result.content[0].text

    // Parse JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return getDefaultAnalysis(text)
  } catch (error) {
    console.error('Claude analysis error:', error)
    return getDefaultAnalysis(text)
  }
}

function getDefaultAnalysis(text: string): AIAnalysis {
  return {
    summary: 'Unable to analyze - manual review required',
    intent: 'unknown',
    sentiment: 'neutral',
    sentiment_score: 50,
    bant_score: {
      budget: 0,
      authority: 0,
      need: 0,
      timeline: 0,
      total: 0,
    },
    lead_score: 50,
    recommended_actions: ['Review manually', 'Follow up within 24 hours'],
    keywords: text.split(' ').slice(0, 5),
    language_detected: detectLanguage(text),
  }
}

function detectLanguage(text: string): string {
  // Simple language detection based on character sets
  const koreanRegex = /[\uAC00-\uD7AF]/
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/
  const chineseRegex = /[\u4E00-\u9FFF]/

  if (koreanRegex.test(text)) return 'ko'
  if (japaneseRegex.test(text)) return 'ja'
  if (chineseRegex.test(text)) return 'zh'
  return 'en'
}

function checkEscalationKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
}

async function sendNotifications(lead: any, analysis: AIAnalysis): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Get organization settings
  const { data: org } = await supabase
    .from('organizations')
    .select('settings')
    .eq('id', (lead.projects as any)?.organization_id)
    .single()

  const settings = org?.settings as any

  // Send Slack notification
  if (settings?.slack_webhook_url) {
    await fetch(settings.slack_webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🔥 High-value lead detected!`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Lead Alert*\n\n*Summary:* ${analysis.summary}\n*Lead Score:* ${analysis.lead_score}/100\n*Intent:* ${analysis.intent}\n*Sentiment:* ${analysis.sentiment}`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View Lead' },
                url: `https://app.rindaask.com/leads/${lead.id}`,
              },
            ],
          },
        ],
      }),
    })
  }

  // Send KakaoTalk notification (KakaoWork webhook)
  if (settings?.kakao_webhook_url) {
    await fetch(settings.kakao_webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[린다애스크] 새로운 리드가 접수되었습니다!\n\n요약: ${analysis.summary}\n리드 점수: ${analysis.lead_score}/100\n의도: ${analysis.intent}`,
      }),
    })
  }
}

async function generateAIResponse(
  lead: any,
  userMessage: string,
  analysis: AIAnalysis
): Promise<void> {
  const supabase = getSupabaseAdmin()
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

  if (!anthropicApiKey) return

  const projectAiConfig = (lead.projects as any)?.ai_config

  // Get relevant knowledge base entries
  let knowledgeContext = ''
  if (projectAiConfig?.knowledge_base_enabled) {
    const { data: kbEntries } = await supabase.rpc('match_knowledge_base', {
      query_embedding: await generateEmbedding(userMessage),
      match_threshold: 0.7,
      match_count: 3,
      p_project_id: lead.project_id,
    })

    if (kbEntries?.length) {
      knowledgeContext = `\n\nRelevant knowledge base entries:\n${kbEntries.map((e: any) => `- ${e.title}: ${e.content}`).join('\n')}`
    }
  }

  const toneInstructions: Record<string, string> = {
    formal: 'Use formal, professional language with proper honorifics.',
    casual: 'Use casual, friendly language but remain professional.',
    friendly: 'Use warm, approachable language with a helpful tone.',
  }

  const prompt = `You are an AI assistant for a Korean B2B company. Respond to the customer's message in ${projectAiConfig?.language || 'Korean'}.

Tone: ${toneInstructions[projectAiConfig?.tone || 'friendly']}

Customer message: "${userMessage}"

Customer context:
- Intent: ${analysis.intent}
- Sentiment: ${analysis.sentiment}
${knowledgeContext}

Provide a helpful, concise response (2-3 sentences max). If you cannot fully answer, offer to connect them with a human representative.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    const result = await response.json()
    const aiResponse = result.content[0].text

    // Store AI conversation
    await supabase.from('ai_conversations').insert({
      lead_id: lead.id,
      project_id: lead.project_id,
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        },
      ],
      resolved: false,
    })
  } catch (error) {
    console.error('AI response generation error:', error)
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    return new Array(1536).fill(0) // Return zero vector if no API key
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    })

    const result = await response.json()
    return result.data[0].embedding
  } catch {
    return new Array(1536).fill(0)
  }
}
