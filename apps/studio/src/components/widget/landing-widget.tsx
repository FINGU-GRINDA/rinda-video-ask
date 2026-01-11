'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, Video, Mic, MessageSquare, Phone, Send, Check, Calendar, ChevronRight, Volume2, VolumeX } from 'lucide-react'

interface LandingWidgetProps {
  videoUrl: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
}

export function LandingWidget({
  videoUrl,
  position = 'bottom-right',
  primaryColor = '#6366f1'
}: LandingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const [responseMode, setResponseMode] = useState<'video' | 'voice' | 'text'>('text')
  const [textMessage, setTextMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showAttentionBubble, setShowAttentionBubble] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const triggerVideoRef = useRef<HTMLVideoElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play trigger video on mount
  useEffect(() => {
    if (triggerVideoRef.current) {
      triggerVideoRef.current.play().catch(() => {
        // Autoplay might be blocked
      })
    }

    // Show attention bubble after 3 seconds
    const bubbleTimer = setTimeout(() => {
      setShowAttentionBubble(true)
    }, 3000)

    // Hide attention bubble after 8 seconds if not interacted
    const hideBubbleTimer = setTimeout(() => {
      setShowAttentionBubble(false)
    }, 10000)

    return () => {
      clearTimeout(bubbleTimer)
      clearTimeout(hideBubbleTimer)
    }
  }, [])

  // Auto-play main video when widget opens
  useEffect(() => {
    if (isOpen && mainVideoRef.current) {
      mainVideoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isOpen])

  // Cleanup recording interval
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  // Prevent body scroll when widget is open on mobile
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

  const handleTriggerClick = () => {
    setIsOpen(true)
    setShowAttentionBubble(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setVideoEnded(false)
    setIsSubmitted(false)
    setTextMessage('')
    setIsPlaying(false)
    setShowQuickActions(true)
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

  const handleSubmit = () => {
    if (textMessage.trim() || responseMode !== 'text') {
      setIsSubmitted(true)
      setTimeout(() => {
        handleClose()
      }, 3000)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    setIsSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false)
    if (action === 'phone') {
      setIsSubmitted(true)
      setTimeout(handleClose, 3000)
    } else if (action === 'calendar') {
      setIsSubmitted(true)
      setTimeout(handleClose, 3000)
    } else if (action === 'message') {
      setResponseMode('text')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const positionClass = position === 'bottom-right' ? 'right-4 sm:right-5' : 'left-4 sm:left-5'
  const bubblePositionClass = position === 'bottom-right' ? 'right-20 sm:right-24' : 'left-20 sm:left-24'

  return (
    <>
      {/* Trigger Button with Video Preview */}
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
                {/* Speech bubble arrow */}
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

          {/* Secondary Pulse for more attention */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.15,
              transform: 'scale(1.2)'
            }}
          />

          {/* Trigger Button */}
          <button
            onClick={handleTriggerClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative rounded-full overflow-hidden border-[3px] shadow-2xl transition-all duration-300 group ${
              isHovering ? 'w-20 h-20 sm:w-24 sm:h-24 scale-110' : 'w-16 h-16 sm:w-20 sm:h-20'
            }`}
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
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovering ? 'bg-black/10' : 'bg-black/30'
            }`}>
              <div className={`transition-all duration-300 ${isHovering ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" fill="white" />
              </div>
            </div>

            {/* Hover text overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}>
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

      {/* Widget Modal - Full screen on mobile */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-[9999] sm:w-[400px] sm:max-h-[85vh] bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {getGreeting()}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  지금 응답 가능
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full sm:rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {isSubmitted ? (
              // Thank You Screen
              <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">감사합니다!</h3>
                <p className="text-gray-500 text-sm sm:text-base">곧 담당자가 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                {/* Video Container */}
                <div className="relative aspect-video bg-black">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Video Controls */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </button>
                  </div>

                  {/* Replay button when video ends */}
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

                {/* Quick Actions - Always visible */}
                {showQuickActions && (
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 border-b bg-gray-50">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">어떻게 도와드릴까요?</p>

                    <button
                      onClick={() => handleQuickAction('phone')}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-[#03c75a] hover:bg-[#02b351] text-white transition-colors group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm sm:text-base">지금 바로 전화하기</div>
                        <div className="text-xs sm:text-sm opacity-90">담당자와 직접 상담하세요</div>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>

                    <button
                      onClick={() => handleQuickAction('calendar')}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">미팅 예약하기</div>
                        <div className="text-xs sm:text-sm text-gray-500">편한 시간에 상담 예약</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>

                    <button
                      onClick={() => handleQuickAction('message')}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">메시지 남기기</div>
                        <div className="text-xs sm:text-sm text-gray-500">영상, 음성, 텍스트로 답변</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>
                )}

                {/* Response Section - Shows when message mode selected */}
                {!showQuickActions && (
                  <div className="p-3 sm:p-4 border-t animate-in slide-in-from-bottom-2 duration-200">
                    {/* Response Mode Tabs */}
                    <div className="flex gap-2 mb-3">
                      {[
                        { mode: 'video' as const, icon: Video, label: '영상' },
                        { mode: 'voice' as const, icon: Mic, label: '음성' },
                        { mode: 'text' as const, icon: MessageSquare, label: '텍스트' },
                      ].map(({ mode, icon: Icon, label }) => (
                        <button
                          key={mode}
                          onClick={() => setResponseMode(mode)}
                          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium transition-all ${
                            responseMode === mode
                              ? 'text-white'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                          style={responseMode === mode ? {
                            backgroundColor: primaryColor,
                            borderColor: primaryColor
                          } : undefined}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Response Input */}
                    {responseMode === 'text' ? (
                      <div className="space-y-3">
                        <textarea
                          value={textMessage}
                          onChange={(e) => setTextMessage(e.target.value)}
                          placeholder="메시지를 입력하세요..."
                          className="w-full h-24 sm:h-28 p-3 sm:p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm resize-none focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                        />
                        <button
                          onClick={handleSubmit}
                          disabled={!textMessage.trim()}
                          className="w-full py-3.5 sm:py-4 rounded-xl text-white font-semibold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          보내기
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        {isRecording && (
                          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono">
                              {formatTime(recordingTime)}
                            </span>
                          </div>
                        )}

                        {responseMode === 'video' && !isRecording && (
                          <div className="mb-4 aspect-square max-w-[180px] sm:max-w-[200px] mx-auto rounded-2xl bg-gray-900 flex items-center justify-center">
                            <Video className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                          </div>
                        )}

                        <button
                          onClick={isRecording ? handleStopRecording : handleStartRecording}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center transition-all mx-auto ${
                            isRecording ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400'
                          }`}
                        >
                          <div
                            className={`transition-all ${
                              isRecording
                                ? 'w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-red-500'
                                : 'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500'
                            }`}
                          />
                        </button>
                        <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                          {isRecording ? '녹화 중... 클릭하여 종료' : `클릭하여 ${responseMode === 'video' ? '영상' : '음성'} 녹화 시작`}
                        </p>
                      </div>
                    )}

                    {/* Back button */}
                    <button
                      onClick={() => setShowQuickActions(true)}
                      className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← 다른 옵션 보기
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Branding */}
          <div className="py-2.5 sm:py-3 text-center border-t bg-gray-50 shrink-0">
            <a
              href="https://rindaask.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs text-gray-400 hover:text-primary-500 transition-colors"
            >
              Powered by 린다애스크
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '좋은 아침이에요!'
  if (hour < 18) return '안녕하세요!'
  return '좋은 저녁이에요!'
}
