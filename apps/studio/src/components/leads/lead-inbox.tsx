'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Video,
  Mic,
  MessageSquare,
  Phone,
  Zap,
  Star,
  StarOff,
  MoreHorizontal,
  Play,
  User,
  Building2,
  Globe,
  Clock,
  TrendingUp,
  ChevronRight,
  Check,
  X,
} from 'lucide-react'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { AIAnalysis, VisitorContext } from '@rinda/database'

interface Lead {
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
  contact_info: { name?: string; email?: string; phone?: string } | null
  status: 'new' | 'viewed' | 'contacted' | 'qualified' | 'converted' | 'archived'
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
  video_messages: {
    id: string
    title: string
    thumbnail_url: string | null
  } | null
}

interface TeamMember {
  user_id: string
  role: string
  users: {
    email: string
    raw_user_meta_data: {
      full_name?: string
      avatar_url?: string
    }
  }
}

interface LeadInboxProps {
  initialLeads: Lead[]
  teamMembers: TeamMember[]
  currentUserId: string
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  viewed: 'bg-gray-100 text-gray-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-purple-100 text-purple-700',
  archived: 'bg-gray-100 text-gray-500',
}

const statusLabels: Record<string, string> = {
  new: '신규',
  viewed: '확인됨',
  contacted: '연락함',
  qualified: '검증됨',
  converted: '전환됨',
  archived: '보관됨',
}

const interactionIcons = {
  video: Video,
  voice: Mic,
  text: MessageSquare,
  phone: Phone,
  quick_reply: Zap,
}

export function LeadInbox({ initialLeads, teamMembers, currentUserId }: LeadInboxProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        lead.transcription?.toLowerCase().includes(query) ||
        lead.response_text?.toLowerCase().includes(query) ||
        lead.ai_analysis?.summary?.toLowerCase().includes(query) ||
        lead.contact_info?.name?.toLowerCase().includes(query) ||
        lead.contact_info?.email?.toLowerCase().includes(query)

      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false

    // Type filter
    if (typeFilter !== 'all' && lead.interaction_type !== typeFilter) return false

    return true
  })

  const InteractionIcon = selectedLead ? interactionIcons[selectedLead.interaction_type] : MessageSquare

  return (
    <div className="flex h-[calc(100vh-200px)] bg-background rounded-xl border overflow-hidden">
      {/* Lead List */}
      <div className="w-96 border-r flex flex-col">
        {/* Search & Filter Header */}
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'hover:bg-muted'
              )}
            >
              <Filter className="w-4 h-4" />
              필터
            </button>

            {/* Quick status filters */}
            <div className="flex gap-1">
              {['all', 'new', 'qualified'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg transition-colors',
                    statusFilter === status
                      ? 'bg-primary-100 text-primary-600'
                      : 'hover:bg-muted'
                  )}
                >
                  {status === 'all' ? '전체' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="pt-2 border-t space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground w-full">응답 유형</span>
                {['all', 'video', 'voice', 'text', 'phone', 'quick_reply'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors',
                      typeFilter === type
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {type === 'all' ? '전체' : type === 'quick_reply' ? '빠른답변' : type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>리드가 없습니다</p>
            </div>
          ) : (
            filteredLeads.map(lead => {
              const Icon = interactionIcons[lead.interaction_type]
              const isSelected = selectedLead?.id === lead.id

              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={cn(
                    'w-full p-4 text-left border-b hover:bg-muted/50 transition-colors',
                    isSelected && 'bg-primary-50',
                    lead.status === 'new' && 'border-l-4 border-l-primary-500'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      lead.ai_analysis && lead.ai_analysis.lead_score >= 70
                        ? 'bg-green-100'
                        : 'bg-muted'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        lead.ai_analysis && lead.ai_analysis.lead_score >= 70
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">
                          {lead.video_messages?.title || '직접 문의'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(lead.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {lead.ai_analysis?.summary || lead.transcription || lead.response_text || '응답 분석 중...'}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          statusColors[lead.status]
                        )}>
                          {statusLabels[lead.status]}
                        </span>

                        {lead.ai_analysis && (
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            lead.ai_analysis.lead_score >= 70
                              ? 'bg-green-100 text-green-700'
                              : lead.ai_analysis.lead_score >= 40
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                          )}>
                            점수 {lead.ai_analysis.lead_score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Lead Detail */}
      <div className="flex-1 flex flex-col">
        {selectedLead ? (
          <>
            {/* Detail Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <InteractionIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {selectedLead.contact_info?.name || `방문자 ${selectedLead.visitor_id.slice(0, 8)}`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedLead.contact_info?.email || formatRelativeTime(selectedLead.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    // Update status
                    const newStatus = e.target.value as Lead['status']
                    setLeads(leads.map(l =>
                      l.id === selectedLead.id ? { ...l, status: newStatus } : l
                    ))
                    setSelectedLead({ ...selectedLead, status: newStatus })
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg border bg-background"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Response Content */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <InteractionIcon className="w-4 h-4" />
                  {selectedLead.interaction_type === 'video' && '영상 응답'}
                  {selectedLead.interaction_type === 'voice' && '음성 응답'}
                  {selectedLead.interaction_type === 'text' && '텍스트 응답'}
                  {selectedLead.interaction_type === 'phone' && '전화 요청'}
                  {selectedLead.interaction_type === 'quick_reply' && '빠른 답변'}
                </h3>

                {selectedLead.response_url && (
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    {selectedLead.interaction_type === 'video' ? (
                      <video
                        src={selectedLead.response_url}
                        controls
                        className="w-full h-full"
                      />
                    ) : (
                      <audio
                        src={selectedLead.response_url}
                        controls
                        className="w-full mt-8"
                      />
                    )}
                  </div>
                )}

                {selectedLead.transcription && (
                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground block mb-1">원문 (자동 변환)</span>
                    <p className="text-sm">{selectedLead.transcription}</p>
                  </div>
                )}

                {selectedLead.translation && (
                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground block mb-1">번역</span>
                    <p className="text-sm">{selectedLead.translation}</p>
                  </div>
                )}

                {selectedLead.response_text && (
                  <p className="text-sm">{selectedLead.response_text}</p>
                )}
              </div>

              {/* AI Analysis */}
              {selectedLead.ai_analysis && (
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-500" />
                    AI 분석
                  </h3>

                  <div className="space-y-4">
                    {/* Summary */}
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">요약</span>
                      <p className="text-sm">{selectedLead.ai_analysis.summary}</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-primary-600">
                          {selectedLead.ai_analysis.lead_score}
                        </div>
                        <div className="text-xs text-muted-foreground">리드 점수</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className={cn(
                          'text-lg font-semibold',
                          selectedLead.ai_analysis.sentiment === 'positive' && 'text-green-600',
                          selectedLead.ai_analysis.sentiment === 'negative' && 'text-red-600',
                          selectedLead.ai_analysis.sentiment === 'neutral' && 'text-gray-600'
                        )}>
                          {selectedLead.ai_analysis.sentiment === 'positive' && '긍정적'}
                          {selectedLead.ai_analysis.sentiment === 'negative' && '부정적'}
                          {selectedLead.ai_analysis.sentiment === 'neutral' && '중립'}
                        </div>
                        <div className="text-xs text-muted-foreground">감정</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-primary-600">
                          {selectedLead.ai_analysis.intent}
                        </div>
                        <div className="text-xs text-muted-foreground">의도</div>
                      </div>
                    </div>

                    {/* BANT Score */}
                    <div>
                      <span className="text-xs text-muted-foreground block mb-2">BANT 점수</span>
                      <div className="grid grid-cols-4 gap-2">
                        {['budget', 'authority', 'need', 'timeline'].map(key => (
                          <div key={key} className="bg-white rounded-lg p-2 text-center">
                            <div className="text-sm font-medium">
                              {selectedLead.ai_analysis!.bant_score[key as keyof typeof selectedLead.ai_analysis.bant_score]}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {key === 'budget' && '예산'}
                              {key === 'authority' && '권한'}
                              {key === 'need' && '필요성'}
                              {key === 'timeline' && '일정'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    {selectedLead.ai_analysis.recommended_actions.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground block mb-2">추천 액션</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.ai_analysis.recommended_actions.map((action, idx) => (
                            <button
                              key={idx}
                              className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm hover:bg-muted transition-colors"
                            >
                              <ChevronRight className="w-3 h-3" />
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visitor Context */}
              <div className="rounded-xl border p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  방문자 정보
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">페이지:</span>
                    <span className="truncate">{selectedLead.visitor_context.page_url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">체류시간:</span>
                    <span>{selectedLead.visitor_context.time_on_site}초</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">방문횟수:</span>
                    <span>{selectedLead.visitor_context.visit_count}회</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">디바이스:</span>
                    <span>{selectedLead.visitor_context.device_type}</span>
                  </div>
                  {selectedLead.visitor_context.utm_source && (
                    <div className="flex items-center gap-2 col-span-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">UTM:</span>
                      <span>
                        {selectedLead.visitor_context.utm_source} / {selectedLead.visitor_context.utm_medium || '-'} / {selectedLead.visitor_context.utm_campaign || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Phone className="w-4 h-4" />
                전화하기
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                <MessageSquare className="w-4 h-4" />
                이메일 보내기
              </button>
              <button className="p-2 border rounded-lg hover:bg-muted transition-colors">
                <Star className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>리드를 선택하여 상세 정보를 확인하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
