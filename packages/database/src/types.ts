export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          phone: string | null
          email: string | null
          website: string | null
          business_hours: BusinessHours | null
          timezone: string
          plan: 'free' | 'starter' | 'pro' | 'enterprise'
          settings: OrganizationSettings | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          business_hours?: BusinessHours | null
          timezone?: string
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          settings?: OrganizationSettings | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          business_hours?: BusinessHours | null
          timezone?: string
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          settings?: OrganizationSettings | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          domain: string | null
          widget_config: WidgetConfig
          ai_config: AIConfig
          embed_code: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          domain?: string | null
          widget_config?: WidgetConfig
          ai_config?: AIConfig
          embed_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          domain?: string | null
          widget_config?: WidgetConfig
          ai_config?: AIConfig
          embed_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      video_messages: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          duration: number
          transcription: string | null
          translations: Record<string, string> | null
          captions: CaptionTrack[] | null
          trigger_rules: TriggerRule[]
          response_options: ResponseOption[] | null
          next_video_map: Record<string, string> | null
          is_active: boolean
          view_count: number
          response_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          duration?: number
          transcription?: string | null
          translations?: Record<string, string> | null
          captions?: CaptionTrack[] | null
          trigger_rules?: TriggerRule[]
          response_options?: ResponseOption[] | null
          next_video_map?: Record<string, string> | null
          is_active?: boolean
          view_count?: number
          response_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duration?: number
          transcription?: string | null
          translations?: Record<string, string> | null
          captions?: CaptionTrack[] | null
          trigger_rules?: TriggerRule[]
          response_options?: ResponseOption[] | null
          next_video_map?: Record<string, string> | null
          is_active?: boolean
          view_count?: number
          response_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          project_id: string
          video_message_id: string | null
          visitor_id: string
          session_id: string
          interaction_type: 'video' | 'voice' | 'text' | 'phone' | 'quick_reply'
          response_url: string | null
          response_text: string | null
          transcription: string | null
          translation: string | null
          ai_analysis: AIAnalysis | null
          visitor_context: VisitorContext
          contact_info: ContactInfo | null
          status: 'new' | 'viewed' | 'contacted' | 'qualified' | 'converted' | 'archived'
          assigned_to: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          video_message_id?: string | null
          visitor_id: string
          session_id: string
          interaction_type: 'video' | 'voice' | 'text' | 'phone' | 'quick_reply'
          response_url?: string | null
          response_text?: string | null
          transcription?: string | null
          translation?: string | null
          ai_analysis?: AIAnalysis | null
          visitor_context?: VisitorContext
          contact_info?: ContactInfo | null
          status?: 'new' | 'viewed' | 'contacted' | 'qualified' | 'converted' | 'archived'
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          video_message_id?: string | null
          visitor_id?: string
          session_id?: string
          interaction_type?: 'video' | 'voice' | 'text' | 'phone' | 'quick_reply'
          response_url?: string | null
          response_text?: string | null
          transcription?: string | null
          translation?: string | null
          ai_analysis?: AIAnalysis | null
          visitor_context?: VisitorContext
          contact_info?: ContactInfo | null
          status?: 'new' | 'viewed' | 'contacted' | 'qualified' | 'converted' | 'archived'
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          source_type: 'pdf' | 'url' | 'text' | 'faq'
          source_url: string | null
          embedding: number[] | null
          metadata: Record<string, unknown> | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          source_type: 'pdf' | 'url' | 'text' | 'faq'
          source_url?: string | null
          embedding?: number[] | null
          metadata?: Record<string, unknown> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          source_type?: 'pdf' | 'url' | 'text' | 'faq'
          source_url?: string | null
          embedding?: number[] | null
          metadata?: Record<string, unknown> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          lead_id: string
          project_id: string
          messages: AIMessage[]
          context: Record<string, unknown> | null
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          project_id: string
          messages?: AIMessage[]
          context?: Record<string, unknown> | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          project_id?: string
          messages?: AIMessage[]
          context?: Record<string, unknown> | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          project_id: string
          video_message_id: string | null
          visitor_id: string
          session_id: string
          event_type: string
          event_data: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          video_message_id?: string | null
          visitor_id: string
          session_id: string
          event_type: string
          event_data?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          video_message_id?: string | null
          visitor_id?: string
          session_id?: string
          event_type?: string
          event_data?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_knowledge_base: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
          p_project_id: string
        }
        Returns: {
          id: string
          title: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Custom types for JSON columns

export interface BusinessHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

export interface DayHours {
  open: string // "09:00"
  close: string // "18:00"
  closed?: boolean
}

export interface OrganizationSettings {
  default_language: string
  notification_email: string | null
  slack_webhook_url: string | null
  kakao_webhook_url: string | null
  hubspot_api_key: string | null
  salesforce_config: Record<string, unknown> | null
}

export interface WidgetConfig {
  position: 'bottom-right' | 'bottom-left' | 'center'
  theme: 'light' | 'dark' | 'auto'
  primary_color: string
  accent_color: string
  border_radius: number
  show_branding: boolean
  mobile_fullscreen: boolean
  auto_play: boolean
  sound_enabled: boolean
  language: string
  custom_css: string | null
  z_index: number
}

export interface AIConfig {
  enabled: boolean
  auto_respond: boolean
  response_delay_ms: number
  tone: 'formal' | 'casual' | 'friendly'
  language: string
  max_auto_responses: number
  escalation_keywords: string[]
  knowledge_base_enabled: boolean
}

export interface TriggerRule {
  id: string
  type: 'page_url' | 'time_on_page' | 'scroll_depth' | 'exit_intent' | 'visit_count' | 'utm_param' | 'returning_visitor' | 'device' | 'custom'
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'regex'
  value: string | number | boolean
  and_conditions?: TriggerRule[]
  or_conditions?: TriggerRule[]
  priority: number
}

export interface ResponseOption {
  id: string
  label: string
  icon?: string
  action: 'next_video' | 'phone_call' | 'calendar' | 'url' | 'close'
  action_value?: string
  next_video_id?: string
}

export interface CaptionTrack {
  language: string
  label: string
  src: string
  default?: boolean
}

export interface AIAnalysis {
  summary: string
  intent: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentiment_score: number
  bant_score: BANTScore
  lead_score: number
  recommended_actions: string[]
  keywords: string[]
  language_detected: string
}

export interface BANTScore {
  budget: number
  authority: number
  need: number
  timeline: number
  total: number
}

export interface VisitorContext {
  page_url: string
  page_title: string
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  device_type: 'desktop' | 'tablet' | 'mobile'
  browser: string
  os: string
  country: string | null
  city: string | null
  company_info: CompanyInfo | null
  visit_count: number
  pages_viewed: string[]
  time_on_site: number
  scroll_depth: number
}

export interface CompanyInfo {
  name: string | null
  domain: string | null
  industry: string | null
  employee_count: string | null
  revenue: string | null
  linkedin_url: string | null
}

export interface ContactInfo {
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  job_title: string | null
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Utility types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
