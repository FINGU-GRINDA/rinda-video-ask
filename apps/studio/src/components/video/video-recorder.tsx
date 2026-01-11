'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Circle,
  Square,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Type,
  Play,
  Pause,
  Timer,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  maxDuration?: number
  showTeleprompter?: boolean
}

export function VideoRecorder({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
  showTeleprompter: initialShowTeleprompter = true,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showTeleprompter, setShowTeleprompter] = useState(initialShowTeleprompter)

  // Teleprompter state
  const [teleprompterText, setTeleprompterText] = useState(
    '안녕하세요! 저희 서비스를 찾아주셔서 감사합니다.\n\n오늘 어떤 부분이 궁금하셔서 방문하셨나요?\n\n가격, 기능, 데모 등 무엇이든 편하게 말씀해주세요.'
  )
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(30) // pixels per second
  const [teleprompterFontSize, setTeleprompterFontSize] = useState(24)
  const [isTeleprompterScrolling, setIsTeleprompterScrolling] = useState(false)
  const teleprompterRef = useRef<HTMLDivElement>(null)

  // Initialize camera
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setHasVideo(stream.getVideoTracks().length > 0)
        setHasAudio(stream.getAudioTracks().length > 0)
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Toggle video track
  const toggleVideo = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }, [videoEnabled])

  // Toggle audio track
  const toggleAudio = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }, [audioEnabled])

  // Start recording
  const startRecording = useCallback(() => {
    if (!videoRef.current?.srcObject) return

    chunksRef.current = []
    const stream = videoRef.current.srcObject as MediaStream

    const options: MediaRecorderOptions = {
      mimeType: 'video/webm;codecs=vp9,opus',
    }

    // Fallback for Safari
    if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
      options.mimeType = 'video/webm'
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/mp4'
      }
    }

    const mediaRecorder = new MediaRecorder(stream, options)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: options.mimeType })
      setRecordedBlob(blob)
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
      onRecordingComplete(blob, recordingTime)
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(1000) // Collect data every second
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration) {
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)

    // Auto-start teleprompter
    if (showTeleprompter) {
      setIsTeleprompterScrolling(true)
    }
  }, [maxDuration, onRecordingComplete, recordingTime, showTeleprompter])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setIsTeleprompterScrolling(false)
    }
  }, [isRecording])

  // Pause/Resume recording
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return

    if (isPaused) {
      mediaRecorderRef.current.resume()
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      setIsTeleprompterScrolling(true)
    } else {
      mediaRecorderRef.current.pause()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setIsTeleprompterScrolling(false)
    }

    setIsPaused(!isPaused)
  }, [isPaused])

  // Reset recording
  const resetRecording = useCallback(() => {
    setRecordedBlob(null)
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl)
    }
    setRecordedUrl(null)
    setRecordingTime(0)

    // Reset teleprompter scroll position
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0
    }
  }, [recordedUrl])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Teleprompter auto-scroll
  useEffect(() => {
    if (!isTeleprompterScrolling || !teleprompterRef.current) return

    const interval = setInterval(() => {
      if (teleprompterRef.current) {
        teleprompterRef.current.scrollTop += teleprompterSpeed / 60
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [isTeleprompterScrolling, teleprompterSpeed])

  return (
    <div className="space-y-4">
      {/* Main Video Container */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
        {recordedUrl ? (
          <video
            src={recordedUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'w-full h-full object-cover',
                !videoEnabled && 'opacity-0'
              )}
            />

            {/* Video off overlay */}
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">카메라가 꺼져 있습니다</p>
                </div>
              </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  isPaused ? 'bg-yellow-500' : 'bg-red-500 recording-indicator'
                )} />
                <span className="text-white text-sm font-medium">
                  {formatTime(recordingTime)} / {formatTime(maxDuration)}
                </span>
              </div>
            )}

            {/* Teleprompter Overlay */}
            {showTeleprompter && (
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <div
                  ref={teleprompterRef}
                  className="absolute bottom-4 left-4 right-4 h-24 overflow-hidden"
                  style={{ fontSize: teleprompterFontSize }}
                >
                  <div className="text-white text-center whitespace-pre-wrap leading-relaxed">
                    {teleprompterText}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Camera toggle */}
          <button
            onClick={toggleVideo}
            disabled={isRecording}
            className={cn(
              'p-3 rounded-full transition-colors',
              videoEnabled
                ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                : 'bg-red-100 text-red-600 hover:bg-red-200',
              isRecording && 'opacity-50 cursor-not-allowed'
            )}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Mic toggle */}
          <button
            onClick={toggleAudio}
            disabled={isRecording}
            className={cn(
              'p-3 rounded-full transition-colors',
              audioEnabled
                ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                : 'bg-red-100 text-red-600 hover:bg-red-200',
              isRecording && 'opacity-50 cursor-not-allowed'
            )}
          >
            {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Teleprompter toggle */}
          <button
            onClick={() => setShowTeleprompter(!showTeleprompter)}
            className={cn(
              'p-3 rounded-full transition-colors',
              showTeleprompter
                ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Type className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Recording controls */}
        <div className="flex items-center gap-3">
          {recordedBlob ? (
            <>
              <button
                onClick={resetRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                다시 녹화
              </button>
              <a
                href={recordedUrl || undefined}
                download="recording.webm"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                다운로드
              </a>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                <Upload className="w-4 h-4" />
                업로드
              </button>
            </>
          ) : isRecording ? (
            <>
              <button
                onClick={togglePause}
                className="p-3 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                녹화 종료
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              disabled={!hasVideo || !hasAudio}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Circle className="w-4 h-4 fill-current" />
              녹화 시작
            </button>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="w-4 h-4" />
          최대 {Math.floor(maxDuration / 60)}분
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-muted/50 rounded-xl p-4 space-y-4">
          <h3 className="font-medium">녹화 설정</h3>

          {/* Teleprompter settings */}
          {showTeleprompter && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  텔레프롬프터 스크립트
                </label>
                <textarea
                  value={teleprompterText}
                  onChange={(e) => setTeleprompterText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="녹화 중 읽을 스크립트를 입력하세요..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    스크롤 속도: {teleprompterSpeed}px/s
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTeleprompterSpeed(Math.max(10, teleprompterSpeed - 5))}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={teleprompterSpeed}
                      onChange={(e) => setTeleprompterSpeed(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => setTeleprompterSpeed(Math.min(100, teleprompterSpeed + 5))}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    글자 크기: {teleprompterFontSize}px
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTeleprompterFontSize(Math.max(16, teleprompterFontSize - 2))}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={teleprompterFontSize}
                      onChange={(e) => setTeleprompterFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => setTeleprompterFontSize(Math.min(48, teleprompterFontSize + 2))}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsTeleprompterScrolling(!isTeleprompterScrolling)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
              >
                {isTeleprompterScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTeleprompterScrolling ? '스크롤 중지' : '스크롤 미리보기'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
