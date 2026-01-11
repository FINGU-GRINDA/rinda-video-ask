// Mock Supabase server client for demo purposes

type MockUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    company?: string
    avatar_url?: string
  }
}

type MockSession = {
  user: MockUser
  access_token: string
}

// Demo mock data
const MOCK_USER: MockUser = {
  id: 'demo-user-123',
  email: 'demo@rindaask.com',
  user_metadata: {
    full_name: '데모 사용자',
    company: '린다애스크'
  }
}

const MOCK_ORG_ID = 'demo-org-123'

const MOCK_ORGANIZATION = {
  id: MOCK_ORG_ID,
  name: '린다애스크',
  slug: 'rindaask-demo',
  logo_url: null,
  plan: 'pro'
}

export async function createClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: MOCK_USER },
        error: null
      }),
      getSession: async () => ({
        data: { session: { user: MOCK_USER, access_token: 'mock-token' } as MockSession },
        error: null
      }),
      exchangeCodeForSession: async (_code: string) => ({
        data: { session: { user: MOCK_USER, access_token: 'mock-token' } as MockSession },
        error: null
      })
    },
    from: (table: string) => createMockQueryBuilder(table),
    rpc: async (functionName: string, params?: Record<string, unknown>) => ({
      data: [],
      error: null
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, data: unknown, options?: Record<string, unknown>) => ({
          data: { path },
          error: null
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/mock-storage/${bucket}/${path}` }
        }),
        remove: async (paths: string[]) => ({ data: null, error: null })
      })
    }
  }
}

export async function createServiceClient() {
  return createClient()
}

function createMockQueryBuilder(table: string) {
  const mockData = getMockDataForTable(table)

  // Helper to create chainable query methods
  const createChainableQuery = (data: Record<string, unknown>[]) => {
    const chainable = {
      eq: (column: string, value: string | boolean | number) => createChainableQuery(data),
      neq: (column: string, value: string | boolean | number) => createChainableQuery(data),
      gt: (column: string, value: string | number) => createChainableQuery(data),
      gte: (column: string, value: string | number) => createChainableQuery(data),
      lt: (column: string, value: string | number) => createChainableQuery(data),
      lte: (column: string, value: string | number) => createChainableQuery(data),
      in: (column: string, values: string[]) => createChainableQuery(data),
      order: (column: string, options?: { ascending?: boolean }) => createChainableQuery(data),
      limit: (count: number) => Promise.resolve({ data: data.slice(0, count), error: null, count: data.length }),
      single: async () => ({ data: data[0] || null, error: null }),
      then: (resolve: (val: { data: unknown[]; error: null; count?: number }) => void) =>
        resolve({ data, error: null, count: data.length })
    }
    return chainable
  }

  return {
    select: (columns?: string, options?: { count?: 'exact'; head?: boolean }) => createChainableQuery(mockData),
    insert: (data: Record<string, unknown>) => {
      const insertResult = { id: 'mock-id', ...data }
      return {
        select: (_cols?: string) => ({
          single: async () => ({ data: insertResult, error: null })
        }),
        then: (resolve: (val: { data: unknown; error: null }) => void) => resolve({ data: insertResult, error: null })
      }
    },
    update: (data: Record<string, unknown>) => ({
      eq: (column: string, value: string) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: string) => Promise.resolve({ data: null, error: null })
    })
  }
}

function getMockDataForTable(table: string): Record<string, unknown>[] {
  switch (table) {
    case 'organization_members':
      return [{
        organization_id: MOCK_ORG_ID,
        user_id: MOCK_USER.id,
        role: 'owner',
        organizations: MOCK_ORGANIZATION,
        users: {
          email: MOCK_USER.email,
          raw_user_meta_data: {
            full_name: MOCK_USER.user_metadata.full_name,
            avatar_url: null
          }
        }
      }]
    case 'organizations':
      return [MOCK_ORGANIZATION]
    case 'projects':
      return [{
        id: 'project-1',
        organization_id: MOCK_ORG_ID,
        name: '메인 프로젝트',
        domain: 'example.com'
      }]
    case 'video_messages':
      return [
        {
          id: 'video-1',
          project_id: 'project-1',
          title: '환영 메시지',
          description: '새로운 방문자를 위한 환영 인사',
          video_url: '/videos/hojin_demo.mp4',
          thumbnail_url: null,
          duration: 45,
          view_count: 1523,
          response_count: 234,
          is_active: true,
          trigger_rules: [
            { type: 'time_on_page', value: 5 },
            { type: 'page_url', value: '/' }
          ],
          created_at: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          id: 'video-2',
          project_id: 'project-1',
          title: '제품 소개 영상',
          description: '주요 기능과 혜택 설명',
          video_url: '/videos/hojin_demo.mp4',
          thumbnail_url: null,
          duration: 120,
          view_count: 892,
          response_count: 156,
          is_active: true,
          trigger_rules: [
            { type: 'page_url', value: '/features' },
            { type: 'scroll_depth', value: 50 }
          ],
          created_at: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          id: 'video-3',
          project_id: 'project-1',
          title: '가격 안내',
          description: '요금제 및 혜택 안내',
          video_url: '/videos/hojin_demo.mp4',
          thumbnail_url: null,
          duration: 60,
          view_count: 654,
          response_count: 98,
          is_active: true,
          trigger_rules: [
            { type: 'page_url', value: '/pricing' },
            { type: 'exit_intent', value: true }
          ],
          created_at: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          id: 'video-4',
          project_id: 'project-1',
          title: '데모 요청 안내',
          description: '데모 신청 방법 안내',
          video_url: '/videos/hojin_demo.mp4',
          thumbnail_url: null,
          duration: 30,
          view_count: 321,
          response_count: 67,
          is_active: false,
          trigger_rules: [],
          created_at: new Date(Date.now() - 1 * 86400000).toISOString()
        }
      ]
    case 'leads':
      return [
        {
          id: 'lead-1',
          project_id: 'project-1',
          video_message_id: 'video-1',
          visitor_id: 'visitor-001',
          session_id: 'session-001',
          interaction_type: 'video',
          response_url: '/videos/response-1.webm',
          response_text: null,
          transcription: '안녕하세요, 저는 김철수입니다. 귀사의 서비스에 관심이 있어서 연락드립니다.',
          translation: null,
          ai_analysis: {
            summary: '서비스 도입에 관심이 높은 잠재 고객. 예산과 일정 협의 필요',
            sentiment: 'positive',
            intent: '구매 문의',
            lead_score: 85,
            bant_score: { budget: 70, authority: 80, need: 90, timeline: 75 },
            recommended_actions: ['데모 일정 제안', '가격 협의', '담당자 연결']
          },
          visitor_context: {
            page_url: 'https://example.com/pricing',
            page_title: '가격 안내 - Example',
            referrer: 'https://google.com',
            device_type: 'desktop',
            browser: 'Chrome',
            os: 'Windows',
            country: '한국',
            city: '서울',
            company_info: null,
            time_on_site: 320,
            visit_count: 3,
            pages_viewed: ['/pricing', '/features', '/'],
            scroll_depth: 75,
            utm_source: 'google',
            utm_medium: 'cpc',
            utm_campaign: 'spring_promo',
            utm_content: null,
            utm_term: null
          },
          contact_info: { name: '김철수', email: 'kim@company.com', phone: '010-1234-5678' },
          status: 'new',
          assigned_to: null,
          notes: null,
          created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
          video_messages: { id: 'video-1', title: '환영 메시지', thumbnail_url: null }
        },
        {
          id: 'lead-2',
          project_id: 'project-1',
          video_message_id: 'video-2',
          visitor_id: 'visitor-002',
          session_id: 'session-002',
          interaction_type: 'text',
          response_url: null,
          response_text: '가격이 어떻게 되나요? 스타트업을 위한 할인이 있나요?',
          transcription: null,
          translation: null,
          ai_analysis: {
            summary: '가격에 민감한 스타트업 고객. 할인 정책 안내 필요',
            sentiment: 'neutral',
            intent: '가격 문의',
            lead_score: 65,
            bant_score: { budget: 50, authority: 60, need: 80, timeline: 70 },
            recommended_actions: ['스타트업 요금제 안내', '무료 체험 제안']
          },
          visitor_context: {
            page_url: 'https://example.com/pricing',
            page_title: '가격 안내 - Example',
            referrer: null,
            device_type: 'mobile',
            browser: 'Safari',
            os: 'iOS',
            country: '한국',
            city: '부산',
            company_info: null,
            time_on_site: 180,
            visit_count: 1,
            pages_viewed: ['/pricing'],
            scroll_depth: 50,
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            utm_content: null,
            utm_term: null
          },
          contact_info: { email: 'park@startup.io' },
          status: 'viewed',
          assigned_to: null,
          notes: null,
          created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 20 * 3600000).toISOString(),
          video_messages: { id: 'video-2', title: '제품 소개 영상', thumbnail_url: null }
        },
        {
          id: 'lead-3',
          project_id: 'project-1',
          video_message_id: 'video-3',
          visitor_id: 'visitor-003',
          session_id: 'session-003',
          interaction_type: 'voice',
          response_url: '/audio/response-3.webm',
          response_text: null,
          transcription: '다음 주에 팀 미팅이 있는데, 그 전에 데모를 볼 수 있을까요?',
          translation: null,
          ai_analysis: {
            summary: '긴급한 데모 요청. 의사결정권자로 추정됨',
            sentiment: 'positive',
            intent: '데모 요청',
            lead_score: 92,
            bant_score: { budget: 85, authority: 95, need: 90, timeline: 95 },
            recommended_actions: ['즉시 데모 일정 조율', 'VIP 대응']
          },
          visitor_context: {
            page_url: 'https://example.com/demo',
            page_title: '데모 신청 - Example',
            referrer: 'https://linkedin.com',
            device_type: 'desktop',
            browser: 'Chrome',
            os: 'macOS',
            country: '한국',
            city: '서울',
            company_info: { name: '엔터프라이즈 주식회사', domain: 'enterprise.co.kr', industry: 'IT', employee_count: '100-500', revenue: null, linkedin_url: null },
            time_on_site: 540,
            visit_count: 5,
            pages_viewed: ['/demo', '/pricing', '/features', '/about', '/'],
            scroll_depth: 100,
            utm_source: 'linkedin',
            utm_medium: 'social',
            utm_campaign: 'enterprise',
            utm_content: null,
            utm_term: null
          },
          contact_info: { name: '이영희', email: 'lee@enterprise.co.kr', phone: '010-9876-5432' },
          status: 'qualified',
          assigned_to: MOCK_USER.id,
          notes: '다음주 수요일 데모 예정',
          created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
          video_messages: { id: 'video-3', title: '가격 안내', thumbnail_url: null }
        },
        {
          id: 'lead-4',
          project_id: 'project-1',
          video_message_id: 'video-1',
          visitor_id: 'visitor-004',
          session_id: 'session-004',
          interaction_type: 'quick_reply',
          response_url: null,
          response_text: '네, 관심있어요!',
          transcription: null,
          translation: null,
          ai_analysis: {
            summary: '빠른 관심 표명. 추가 정보 제공 필요',
            sentiment: 'positive',
            intent: '관심 표명',
            lead_score: 55,
            bant_score: { budget: 40, authority: 50, need: 70, timeline: 40 },
            recommended_actions: ['이메일 팔로업', '자료 발송']
          },
          visitor_context: {
            page_url: 'https://example.com',
            page_title: 'Example - 홈페이지',
            referrer: 'https://naver.com',
            device_type: 'mobile',
            browser: 'Samsung Internet',
            os: 'Android',
            country: '한국',
            city: '대전',
            company_info: null,
            time_on_site: 60,
            visit_count: 1,
            pages_viewed: ['/'],
            scroll_depth: 30,
            utm_source: 'naver',
            utm_medium: 'organic',
            utm_campaign: null,
            utm_content: null,
            utm_term: null
          },
          contact_info: null,
          status: 'new',
          assigned_to: null,
          notes: null,
          created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
          video_messages: { id: 'video-1', title: '환영 메시지', thumbnail_url: null }
        },
        {
          id: 'lead-5',
          project_id: 'project-1',
          video_message_id: 'video-2',
          visitor_id: 'visitor-005',
          session_id: 'session-005',
          interaction_type: 'phone',
          response_url: null,
          response_text: null,
          transcription: null,
          translation: null,
          ai_analysis: {
            summary: '전화 상담 요청. 즉각적인 관심도 높음',
            sentiment: 'positive',
            intent: '전화 상담',
            lead_score: 78,
            bant_score: { budget: 65, authority: 70, need: 85, timeline: 80 },
            recommended_actions: ['즉시 콜백', '전화번호 확인']
          },
          visitor_context: {
            page_url: 'https://example.com/contact',
            page_title: '문의하기 - Example',
            referrer: null,
            device_type: 'desktop',
            browser: 'Edge',
            os: 'Windows',
            country: '한국',
            city: '인천',
            company_info: null,
            time_on_site: 420,
            visit_count: 2,
            pages_viewed: ['/contact', '/pricing'],
            scroll_depth: 80,
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            utm_content: null,
            utm_term: null
          },
          contact_info: { phone: '010-5555-6666' },
          status: 'contacted',
          assigned_to: MOCK_USER.id,
          notes: '전화 완료, 자료 발송 예정',
          created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 48 * 3600000).toISOString(),
          video_messages: { id: 'video-2', title: '제품 소개 영상', thumbnail_url: null }
        }
      ]
    default:
      return []
  }
}
