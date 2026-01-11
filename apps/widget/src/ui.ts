import { WidgetConfig, VideoMessage } from './types'
import { MediaHandler } from './media'

interface UICallbacks {
  onOpen: () => void
  onClose: () => void
  onVideoEnd: () => void
  onResponse: (type: 'video' | 'voice' | 'text', data: Blob | string) => void
  onQuickReply: (optionId: string) => void
  onPhoneClick: () => void
}

export class WidgetUI {
  private container: HTMLElement
  private config: WidgetConfig
  private callbacks: UICallbacks
  private mediaHandler: MediaHandler
  private isOpen = false
  private currentVideo: VideoMessage | null = null
  private responseMode: 'video' | 'voice' | 'text' = 'text'
  private isRecording = false

  constructor(container: HTMLElement, config: WidgetConfig, callbacks: UICallbacks) {
    this.container = container
    this.config = config
    this.callbacks = callbacks
    this.mediaHandler = new MediaHandler()

    this.render()
  }

  private render() {
    const hasPreviewVideo = this.config.previewVideoUrl

    this.container.innerHTML = `
      <div class="rinda-ask-trigger-pulse"></div>
      <button class="rinda-ask-trigger ${hasPreviewVideo ? 'has-preview' : ''}" aria-label="Open chat">
        ${hasPreviewVideo ? `
          <video
            class="rinda-ask-trigger-video"
            src="${this.config.previewVideoUrl}"
            muted
            loop
            playsinline
            preload="metadata"
          ></video>
          <div class="rinda-ask-trigger-video-overlay">
            <svg class="rinda-ask-trigger-play-icon" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        ` : `
          <svg class="rinda-ask-trigger-play" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `}
      </button>
      <div class="rinda-ask-container">
        <div class="rinda-ask-content"></div>
      </div>
    `

    this.setupEventListeners()

    // Setup video preview hover behavior
    if (hasPreviewVideo) {
      this.setupVideoPreviewHover()
    }
  }

  private setupVideoPreviewHover() {
    const trigger = this.container.querySelector('.rinda-ask-trigger') as HTMLElement
    const video = this.container.querySelector('.rinda-ask-trigger-video') as HTMLVideoElement
    const overlay = this.container.querySelector('.rinda-ask-trigger-video-overlay') as HTMLElement

    if (!trigger || !video) return

    // Auto-play video on page load (muted)
    video.play().catch(() => {
      // Autoplay might be blocked, will play on hover
    })

    trigger.addEventListener('mouseenter', () => {
      video.play().catch(() => {})
      if (overlay) overlay.classList.add('hidden')
    })

    trigger.addEventListener('mouseleave', () => {
      // Keep video playing for engagement
      if (overlay) overlay.classList.remove('hidden')
    })
  }

  private setupEventListeners() {
    const trigger = this.container.querySelector('.rinda-ask-trigger')
    trigger?.addEventListener('click', () => this.toggle())
  }

  public open() {
    this.isOpen = true
    this.container.querySelector('.rinda-ask-container')?.classList.add('open')
    this.callbacks.onOpen()
  }

  public close() {
    this.isOpen = false
    this.container.querySelector('.rinda-ask-container')?.classList.remove('open')
    this.callbacks.onClose()
  }

  public toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  public showVideo(video: VideoMessage) {
    this.currentVideo = video
    const content = this.container.querySelector('.rinda-ask-content')
    if (!content) return

    content.innerHTML = `
      <div class="rinda-ask-header">
        <div class="rinda-ask-header-info">
          <div class="rinda-ask-header-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${this.config.primaryColor}">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <div class="rinda-ask-header-name">${this.getGreeting()}</div>
            <div class="rinda-ask-header-status">지금 응답 가능</div>
          </div>
        </div>
        <button class="rinda-ask-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="rinda-ask-video-container">
        <video
          class="rinda-ask-video"
          src="${video.videoUrl}"
          ${this.config.autoPlay ? 'autoplay' : ''}
          ${!this.config.soundEnabled ? 'muted' : ''}
          playsinline
        ></video>
        <div class="rinda-ask-video-overlay"></div>
      </div>
    `

    // Setup video events
    const videoEl = content.querySelector('video')
    videoEl?.addEventListener('ended', () => this.callbacks.onVideoEnd())

    // Setup close button
    const closeBtn = content.querySelector('.rinda-ask-close')
    closeBtn?.addEventListener('click', () => this.close())
  }

  public showResponseOptions() {
    const content = this.container.querySelector('.rinda-ask-content')
    if (!content || !this.currentVideo) return

    const optionsHtml = this.currentVideo.responseOptions.length > 0
      ? `
        <div class="rinda-ask-options">
          ${this.currentVideo.responseOptions.map(opt => `
            <button class="rinda-ask-option" data-option-id="${opt.id}">
              <span class="rinda-ask-option-icon">${this.getOptionIcon(opt.icon)}</span>
              <span>${opt.label}</span>
            </button>
          `).join('')}
        </div>
      `
      : ''

    content.innerHTML += `
      ${optionsHtml}
      <div class="rinda-ask-response">
        <div class="rinda-ask-response-tabs">
          <button class="rinda-ask-response-tab ${this.responseMode === 'video' ? 'active' : ''}" data-mode="video">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
            영상
          </button>
          <button class="rinda-ask-response-tab ${this.responseMode === 'voice' ? 'active' : ''}" data-mode="voice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            음성
          </button>
          <button class="rinda-ask-response-tab ${this.responseMode === 'text' ? 'active' : ''}" data-mode="text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            텍스트
          </button>
        </div>
        <div class="rinda-ask-response-content"></div>
        <button class="rinda-ask-phone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          지금 전화하기
        </button>
      </div>
      ${this.config.showBranding ? `
        <div class="rinda-ask-branding">
          <a href="https://rindaask.com" target="_blank">Powered by 린다애스크</a>
        </div>
      ` : ''}
    `

    this.setupResponseListeners()
    this.showResponseContent()
  }

  private setupResponseListeners() {
    // Quick reply options
    const options = this.container.querySelectorAll('.rinda-ask-option')
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        const optionId = (e.currentTarget as HTMLElement).dataset.optionId
        if (optionId) this.callbacks.onQuickReply(optionId)
      })
    })

    // Response mode tabs
    const tabs = this.container.querySelectorAll('.rinda-ask-response-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.mode as 'video' | 'voice' | 'text'
        this.responseMode = mode
        tabs.forEach(t => t.classList.remove('active'))
        ;(e.currentTarget as HTMLElement).classList.add('active')
        this.showResponseContent()
      })
    })

    // Phone button
    const phoneBtn = this.container.querySelector('.rinda-ask-phone')
    phoneBtn?.addEventListener('click', () => this.callbacks.onPhoneClick())
  }

  private showResponseContent() {
    const responseContent = this.container.querySelector('.rinda-ask-response-content')
    if (!responseContent) return

    switch (this.responseMode) {
      case 'text':
        responseContent.innerHTML = `
          <textarea
            class="rinda-ask-textarea"
            placeholder="메시지를 입력하세요..."
          ></textarea>
          <button class="rinda-ask-send">보내기</button>
        `
        this.setupTextResponse()
        break

      case 'voice':
        responseContent.innerHTML = `
          <div class="rinda-ask-recording">
            <div class="rinda-ask-recording-indicator" style="display: none;">
              <div class="rinda-ask-recording-dot"></div>
              <span class="rinda-ask-recording-time">00:00</span>
            </div>
            <div class="rinda-ask-recording-controls">
              <button class="rinda-ask-record-btn">
                <div class="rinda-ask-record-btn-inner"></div>
              </button>
            </div>
          </div>
        `
        this.setupVoiceResponse()
        break

      case 'video':
        responseContent.innerHTML = `
          <div class="rinda-ask-recording">
            <div class="rinda-ask-recording-preview">
              <video autoplay playsinline muted></video>
            </div>
            <div class="rinda-ask-recording-indicator" style="display: none;">
              <div class="rinda-ask-recording-dot"></div>
              <span class="rinda-ask-recording-time">00:00</span>
            </div>
            <div class="rinda-ask-recording-controls">
              <button class="rinda-ask-record-btn">
                <div class="rinda-ask-record-btn-inner"></div>
              </button>
            </div>
          </div>
        `
        this.setupVideoResponse()
        break
    }
  }

  private setupTextResponse() {
    const textarea = this.container.querySelector('.rinda-ask-textarea') as HTMLTextAreaElement
    const sendBtn = this.container.querySelector('.rinda-ask-send') as HTMLButtonElement

    sendBtn?.addEventListener('click', () => {
      const text = textarea?.value.trim()
      if (text) {
        this.callbacks.onResponse('text', text)
      }
    })
  }

  private async setupVoiceResponse() {
    const recordBtn = this.container.querySelector('.rinda-ask-record-btn')
    const indicator = this.container.querySelector('.rinda-ask-recording-indicator') as HTMLElement
    const timeDisplay = this.container.querySelector('.rinda-ask-recording-time')
    let recordingTime = 0
    let timerInterval: ReturnType<typeof setInterval> | null = null

    recordBtn?.addEventListener('click', async () => {
      if (!this.isRecording) {
        try {
          await this.mediaHandler.startAudioRecording()
          this.isRecording = true
          recordBtn.classList.add('recording')
          if (indicator) indicator.style.display = 'flex'

          recordingTime = 0
          timerInterval = setInterval(() => {
            recordingTime++
            if (timeDisplay) {
              const mins = Math.floor(recordingTime / 60).toString().padStart(2, '0')
              const secs = (recordingTime % 60).toString().padStart(2, '0')
              timeDisplay.textContent = `${mins}:${secs}`
            }
          }, 1000)
        } catch (error) {
          console.error('[RindaAsk] Failed to start audio recording:', error)
        }
      } else {
        const blob = await this.mediaHandler.stopRecording()
        this.isRecording = false
        recordBtn.classList.remove('recording')
        if (indicator) indicator.style.display = 'none'
        if (timerInterval) clearInterval(timerInterval)

        if (blob) {
          this.callbacks.onResponse('voice', blob)
        }
      }
    })
  }

  private async setupVideoResponse() {
    const preview = this.container.querySelector('.rinda-ask-recording-preview video') as HTMLVideoElement
    const recordBtn = this.container.querySelector('.rinda-ask-record-btn')
    const indicator = this.container.querySelector('.rinda-ask-recording-indicator') as HTMLElement
    const timeDisplay = this.container.querySelector('.rinda-ask-recording-time')
    let recordingTime = 0
    let timerInterval: ReturnType<typeof setInterval> | null = null

    // Start preview
    try {
      const stream = await this.mediaHandler.startVideoPreview()
      if (preview && stream) {
        preview.srcObject = stream
      }
    } catch (error) {
      console.error('[RindaAsk] Failed to start video preview:', error)
    }

    recordBtn?.addEventListener('click', async () => {
      if (!this.isRecording) {
        try {
          await this.mediaHandler.startVideoRecording()
          this.isRecording = true
          recordBtn.classList.add('recording')
          if (indicator) indicator.style.display = 'flex'

          recordingTime = 0
          timerInterval = setInterval(() => {
            recordingTime++
            if (timeDisplay) {
              const mins = Math.floor(recordingTime / 60).toString().padStart(2, '0')
              const secs = (recordingTime % 60).toString().padStart(2, '0')
              timeDisplay.textContent = `${mins}:${secs}`
            }
          }, 1000)
        } catch (error) {
          console.error('[RindaAsk] Failed to start video recording:', error)
        }
      } else {
        const blob = await this.mediaHandler.stopRecording()
        this.isRecording = false
        recordBtn.classList.remove('recording')
        if (indicator) indicator.style.display = 'none'
        if (timerInterval) clearInterval(timerInterval)

        if (blob) {
          this.callbacks.onResponse('video', blob)
        }
      }
    })
  }

  public showThankYou() {
    const content = this.container.querySelector('.rinda-ask-content')
    if (!content) return

    content.innerHTML = `
      <div class="rinda-ask-header">
        <div class="rinda-ask-header-info">
          <div class="rinda-ask-header-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${this.config.primaryColor}">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <div class="rinda-ask-header-name">감사합니다!</div>
            <div class="rinda-ask-header-status">답변이 접수되었습니다</div>
          </div>
        </div>
        <button class="rinda-ask-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="rinda-ask-thankyou">
        <div class="rinda-ask-thankyou-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#10b981">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <div class="rinda-ask-thankyou-title">감사합니다!</div>
        <div class="rinda-ask-thankyou-message">
          곧 담당자가 연락드리겠습니다.
        </div>
      </div>
      ${this.config.showBranding ? `
        <div class="rinda-ask-branding">
          <a href="https://rindaask.com" target="_blank">Powered by 린다애스크</a>
        </div>
      ` : ''}
    `

    // Setup close button
    const closeBtn = content.querySelector('.rinda-ask-close')
    closeBtn?.addEventListener('click', () => this.close())

    // Auto close after 5 seconds
    setTimeout(() => this.close(), 5000)
  }

  private getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return '좋은 아침이에요!'
    if (hour < 18) return '안녕하세요!'
    return '좋은 저녁이에요!'
  }

  private getOptionIcon(icon?: string): string {
    switch (icon) {
      case 'calendar':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
      case 'phone':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'
      case 'check':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      case 'arrow':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
      default:
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
    }
  }
}
