export interface WidgetConfig {
  projectId: string
  apiUrl: string
  position: 'bottom-right' | 'bottom-left' | 'center'
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  accentColor: string
  borderRadius: number
  showBranding: boolean
  mobileFullscreen: boolean
  autoPlay: boolean
  soundEnabled: boolean
  language: string
  customCss: string | null
  zIndex: number
  previewVideoUrl?: string
  previewThumbnailUrl?: string
}

export interface VideoMessage {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl: string | null
  duration: number
  triggerRules: TriggerRule[]
  responseOptions: ResponseOption[]
  nextVideoMap: Record<string, string>
}

export interface TriggerRule {
  id: string
  type: 'page_url' | 'time_on_page' | 'scroll_depth' | 'exit_intent' | 'visit_count' | 'utm_param' | 'returning_visitor' | 'device' | 'custom'
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'regex'
  value: string | number | boolean
  andConditions?: TriggerRule[]
  orConditions?: TriggerRule[]
  priority: number
}

export interface ResponseOption {
  id: string
  label: string
  icon?: string
  action: 'next_video' | 'phone_call' | 'calendar' | 'url' | 'close'
  actionValue?: string
  nextVideoId?: string
}

export interface VisitorContext {
  pageUrl: string
  pageTitle: string
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  deviceType: 'desktop' | 'tablet' | 'mobile'
  browser: string
  os: string
  country: string | null
  city: string | null
  visitCount: number
  pagesViewed: string[]
  timeOnSite: number
  scrollDepth: number
}

export interface LeadSubmission {
  projectId: string
  videoMessageId: string | null
  visitorId: string
  sessionId: string
  interactionType: 'video' | 'voice' | 'text' | 'phone' | 'quick_reply'
  responseUrl?: string
  responseText?: string
  visitorContext: VisitorContext
  contactInfo?: {
    name?: string
    email?: string
    phone?: string
  }
}
