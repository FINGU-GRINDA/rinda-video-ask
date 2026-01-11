'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, Video, Phone, Send, Check, Calendar, ChevronRight, Volume2, VolumeX, MessageSquare, Bot, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WidgetMode = 'video' | 'chat' | 'calendar'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TimeSlot {
  time: string
  available: boolean
}

interface UnifiedWidgetProps {
  videoUrl: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  gradient?: string
  aiEnabled?: boolean
  calendarEnabled?: boolean
  phoneNumber?: string
  companyName?: string
  demoMode?: boolean
  projectId?: string
}

export function UnifiedWidget({
  videoUrl,
  position = 'bottom-right',
  primaryColor = '#6366f1',
  gradient = 'from-indigo-500 to-purple-600',
  aiEnabled = true,
  calendarEnabled = true,
  phoneNumber = '010-6326-9009',
  companyName = '린다애스크',
  demoMode = false,
  projectId
}: UnifiedWidgetProps) {
  // Widget state
  const [isOpen, setIsOpen] = useState(false)
  const [widgetMode, setWidgetMode] = useState<WidgetMode>('video')
  const [showAttentionBubble, setShowAttentionBubble] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Video state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const triggerVideoRef = useRef<HTMLVideoElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'form' | 'success'>('date')
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' })

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Auto-play trigger video
  useEffect(() => {
    if (triggerVideoRef.current) {
      triggerVideoRef.current.play().catch(() => {})
    }

    const bubbleTimer = setTimeout(() => setShowAttentionBubble(true), 3000)
    const hideBubbleTimer = setTimeout(() => setShowAttentionBubble(false), 10000)

    return () => {
      clearTimeout(bubbleTimer)
      clearTimeout(hideBubbleTimer)
    }
  }, [])

  // Auto-play main video when widget opens
  useEffect(() => {
    if (isOpen && mainVideoRef.current && widgetMode === 'video') {
      mainVideoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isOpen, widgetMode])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Initialize chat with AI greeting
  useEffect(() => {
    if (widgetMode === 'chat' && chatMessages.length === 0) {
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `안녕하세요! ${companyName}입니다. 무엇을 도와드릴까요?`,
        timestamp: new Date()
      }])
    }
  }, [widgetMode, chatMessages.length, companyName])

  const handleTriggerClick = () => {
    setIsOpen(true)
    setShowAttentionBubble(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setWidgetMode('video')
    setVideoEnded(false)
    setIsSubmitted(false)
    setIsPlaying(false)
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0
      mainVideoRef.current.pause()
    }
  }

  const handleVideoEnd = () => {
    setVideoEnded(true)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause()
      } else {
        mainVideoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    if (demoMode) {
      // Demo mode: simulate AI response
      setTimeout(() => {
        const aiResponses = [
          '네, 물론이죠! 어떤 부분이 궁금하신가요?',
          '좋은 질문이에요. 자세히 설명해 드릴게요.',
          '담당자에게 전달해 드릴게요. 빠른 시일 내에 연락드리겠습니다.',
          '해당 내용은 저희 서비스에서 충분히 지원 가능합니다!',
          '추가로 궁금하신 점이 있으시면 말씀해 주세요.'
        ]
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date()
        }])
        setIsTyping(false)
      }, 1000 + Math.random() * 1000)
    } else {
      // Production mode: call API
      try {
        const response = await fetch('/api/widget/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            message: userMessage.content,
            sessionId: getSessionId()
          })
        })

        const data = await response.json()

        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || '죄송합니다. 잠시 후 다시 시도해 주세요.',
          timestamp: new Date()
        }])
      } catch {
        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          timestamp: new Date()
        }])
      } finally {
        setIsTyping(false)
      }
    }
  }

  const getSessionId = () => {
    let sessionId = localStorage.getItem('rinda_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('rinda_session_id', sessionId)
    }
    return sessionId
  }

  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getTimeSlots = (): TimeSlot[] => {
    // Demo mode: generate mock time slots
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3
      })
      if (hour < 18) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          available: Math.random() > 0.3
        })
      }
    }
    return slots
  }

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !bookingForm.name || !bookingForm.email) return

    if (demoMode) {
      setBookingStep('success')
      setTimeout(() => {
        setIsSubmitted(true)
        setTimeout(handleClose, 2000)
      }, 1500)
    } else {
      try {
        await fetch('/api/widget/calendar/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            date: selectedDate.toISOString(),
            time: selectedTime,
            ...bookingForm
          })
        })
        setBookingStep('success')
      } catch {
        alert('예약 중 오류가 발생했습니다.')
      }
    }
  }

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`
  }

  const positionClass = position === 'bottom-right' ? 'right-4 sm:right-5' : 'left-4 sm:left-5'
  const bubblePositionClass = position === 'bottom-right' ? 'right-20 sm:right-24' : 'left-20 sm:left-24'

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <div className={`fixed bottom-4 sm:bottom-5 ${positionClass} z-[9999]`}>
          {/* Attention Bubble */}
          {showAttentionBubble && (
            <div
              className={`absolute bottom-2 sm:bottom-4 ${bubblePositionClass} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              onClick={() => {
                setShowAttentionBubble(false)
                handleTriggerClick()
              }}
            >
              <div className="relative bg-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-xl border cursor-pointer hover:scale-105 transition-transform max-w-[200px] sm:max-w-none">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  안녕하세요! 궁금한 점이 있으신가요? 👋
                </p>
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white border-r border-b rotate-[-45deg] ${
                    position === 'bottom-right' ? '-right-1 sm:-right-1.5' : '-left-1 sm:-left-1.5 rotate-[135deg]'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Pulse Animation */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: primaryColor }}
          />

          {/* Trigger Button */}
          <button
            onClick={handleTriggerClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "relative rounded-full overflow-hidden border-[3px] shadow-2xl transition-all duration-300 group",
              isHovering ? 'w-20 h-20 sm:w-24 sm:h-24 scale-110' : 'w-16 h-16 sm:w-20 sm:h-20'
            )}
            style={{
              borderColor: primaryColor,
              boxShadow: isHovering
                ? `0 8px 35px ${primaryColor}90, 0 0 0 6px ${primaryColor}25`
                : `0 4px 25px ${primaryColor}80, 0 0 0 4px ${primaryColor}20`
            }}
            aria-label="Open video chat"
          >
            <video
              ref={triggerVideoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              isHovering ? 'bg-black/10' : 'bg-black/30'
            )}>
              <div className={cn(
                "transition-all duration-300",
                isHovering ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
              )}>
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" fill="white" />
              </div>
            </div>

            {/* Hover text */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              isHovering ? 'opacity-100' : 'opacity-0'
            )}>
              <span className="text-white text-[10px] sm:text-xs font-bold drop-shadow-lg text-center px-1 sm:px-2">
                클릭해서<br/>대화하기
              </span>
            </div>
          </button>

          {/* Online indicator */}
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Widget Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-[360px] overflow-hidden border">

            {/* Video Mode */}
            {widgetMode === 'video' && !isSubmitted && (
              <>
                {/* Video Container */}
                <div className={cn("relative aspect-[4/3]", `bg-gradient-to-br ${gradient}`)}>
                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Video Content */}
                  {videoUrl ? (
                    <video
                      ref={mainVideoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      playsInline
                      muted={isMuted}
                      onEnded={handleVideoEnd}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                        <p className="text-lg font-semibold">환영 영상</p>
                        <p className="text-sm opacity-80">방문해 주셔서 감사합니다</p>
                      </div>
                    </div>
                  )}

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="text-white hover:opacity-80">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[65%]" />
                      </div>
                      <button onClick={toggleMute} className="text-white hover:opacity-80">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">실시간 상담</span>
                  </div>

                  {/* Replay when video ends */}
                  {videoEnded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <button
                        onClick={() => {
                          if (mainVideoRef.current) {
                            mainVideoRef.current.currentTime = 0
                            mainVideoRef.current.play()
                            setVideoEnded(false)
                          }
                        }}
                        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 space-y-2">
                  {aiEnabled && (
                    <button
                      onClick={() => setWidgetMode('chat')}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all",
                        `bg-gradient-to-r ${gradient}`
                      )}
                    >
                      <MessageSquare className="w-5 h-5" />
                      채팅으로 문의하기
                    </button>
                  )}

                  <button
                    onClick={handlePhoneCall}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-500 text-green-600 font-medium hover:bg-green-50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    전화 상담 ({phoneNumber})
                  </button>

                  {calendarEnabled && (
                    <button
                      onClick={() => {
                        setWidgetMode('calendar')
                        setBookingStep('date')
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm text-gray-900">미팅 예약하기</div>
                        <div className="text-xs text-gray-500">편한 시간에 상담 예약</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Chat Mode */}
            {widgetMode === 'chat' && !isSubmitted && (
              <>
                {/* Chat Header */}
                <div className={cn("p-4 text-white", `bg-gradient-to-r ${gradient}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setWidgetMode('video')}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="font-semibold">{companyName}</div>
                        <div className="text-xs opacity-80 flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          AI 상담원 응대 중
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[300px] overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", `bg-gradient-to-br ${gradient}`)}>
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                          message.role === 'user'
                            ? "bg-primary-500 text-white rounded-br-sm"
                            : "bg-white text-foreground rounded-bl-sm shadow-sm border"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 items-start">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", `bg-gradient-to-br ${gradient}`)}>
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2.5 rounded-full border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className={cn(
                        "w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50",
                        `bg-gradient-to-r ${gradient}`
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Calendar Mode */}
            {widgetMode === 'calendar' && !isSubmitted && (
              <>
                {/* Calendar Header */}
                <div className={cn("p-4 text-white", `bg-gradient-to-r ${gradient}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (bookingStep === 'date') {
                            setWidgetMode('video')
                          } else if (bookingStep === 'time') {
                            setBookingStep('date')
                          } else if (bookingStep === 'form') {
                            setBookingStep('time')
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="font-semibold">미팅 예약</div>
                        <div className="text-xs opacity-80">
                          {bookingStep === 'date' && '날짜를 선택해주세요'}
                          {bookingStep === 'time' && '시간을 선택해주세요'}
                          {bookingStep === 'form' && '정보를 입력해주세요'}
                          {bookingStep === 'success' && '예약이 완료되었습니다'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Content */}
                <div className="p-4">
                  {/* Date Selection */}
                  {bookingStep === 'date' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-3">예약 가능한 날짜</p>
                      <div className="grid grid-cols-4 gap-2">
                        {getNext7Days().map((date, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(date)
                              setBookingStep('time')
                            }}
                            className={cn(
                              "p-3 rounded-xl border-2 text-center transition-all hover:border-primary-400",
                              selectedDate?.toDateString() === date.toDateString()
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200"
                            )}
                          >
                            <div className="text-xs text-gray-500">
                              {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                            </div>
                            <div className="text-lg font-semibold">{date.getDate()}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Selection */}
                  {bookingStep === 'time' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-1">
                        {selectedDate && formatDate(selectedDate)} 예약 가능 시간
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
                        {getTimeSlots().map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedTime(slot.time)
                                setBookingStep('form')
                              }
                            }}
                            disabled={!slot.available}
                            className={cn(
                              "py-2.5 px-3 rounded-lg border text-sm font-medium transition-all",
                              !slot.available && "opacity-40 cursor-not-allowed bg-gray-50",
                              slot.available && selectedTime === slot.time && "border-primary-500 bg-primary-50",
                              slot.available && selectedTime !== slot.time && "border-gray-200 hover:border-primary-400"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Form */}
                  {bookingStep === 'form' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-primary-50 rounded-lg text-sm">
                        <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                        <span className="mx-2">·</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="이름 *"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <input
                          type="email"
                          placeholder="이메일 *"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <input
                          type="tel"
                          placeholder="전화번호"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <textarea
                          placeholder="문의 내용 (선택)"
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm h-20 resize-none"
                        />
                      </div>

                      <button
                        onClick={handleBookingSubmit}
                        disabled={!bookingForm.name || !bookingForm.email}
                        className={cn(
                          "w-full py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50",
                          `bg-gradient-to-r ${gradient}`
                        )}
                      >
                        예약 확정하기
                      </button>
                    </div>
                  )}

                  {/* Success */}
                  {bookingStep === 'success' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">예약 완료!</h3>
                      <p className="text-gray-500 text-sm">
                        {selectedDate && formatDate(selectedDate)} {selectedTime}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        확인 메일을 발송해 드렸습니다.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Success Screen */}
            {isSubmitted && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">감사합니다!</h3>
                <p className="text-gray-500">곧 담당자가 연락드리겠습니다.</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 border-t bg-slate-50 text-center">
              <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Powered by 린다애스크
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
