import { WidgetConfig, VideoMessage, VisitorContext, LeadSubmission, TriggerRule } from './types'
import { createWidgetStyles } from './styles'
import { WidgetUI } from './ui'
import { MediaHandler } from './media'

// API URL injected at build time via Vite define
declare const __API_URL__: string

const DEFAULT_CONFIG: WidgetConfig = {
  projectId: '',
  apiUrl: typeof __API_URL__ !== 'undefined' ? __API_URL__ : 'https://api.rindaask.com',
  position: 'bottom-right',
  theme: 'light',
  primaryColor: '#6366f1',
  accentColor: '#818cf8',
  borderRadius: 16,
  showBranding: true,
  mobileFullscreen: true,
  autoPlay: true,
  soundEnabled: true,
  language: 'ko',
  customCss: null,
  zIndex: 999999,
}

export class RindaAskWidget {
  private config: WidgetConfig
  private container: HTMLElement | null = null
  private ui: WidgetUI | null = null
  private mediaHandler: MediaHandler | null = null
  private visitorId: string
  private sessionId: string
  private visitorContext: VisitorContext
  private videos: VideoMessage[] = []
  private currentVideo: VideoMessage | null = null
  private isOpen = false
  private hasInteracted = false
  private timeOnPage = 0
  private scrollDepth = 0
  private exitIntentTriggered = false

  constructor(config: Partial<WidgetConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.visitorId = this.getOrCreateVisitorId()
    this.sessionId = this.createSessionId()
    this.visitorContext = this.buildVisitorContext()

    this.init()
  }

  private async init() {
    // Inject styles
    this.injectStyles()

    // Create container
    this.createContainer()

    // Initialize UI
    this.ui = new WidgetUI(this.container!, this.config, {
      onOpen: () => this.handleOpen(),
      onClose: () => this.handleClose(),
      onVideoEnd: () => this.handleVideoEnd(),
      onResponse: (type, data) => this.handleResponse(type, data),
      onQuickReply: (optionId) => this.handleQuickReply(optionId),
      onPhoneClick: () => this.handlePhoneClick(),
    })

    // Initialize media handler
    this.mediaHandler = new MediaHandler()

    // Fetch videos
    await this.fetchVideos()

    // Set up behavior trackers
    this.setupBehaviorTrackers()

    // Check initial triggers
    this.checkTriggers()
  }

  private injectStyles() {
    const styleId = 'rinda-ask-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = createWidgetStyles(this.config)
    document.head.appendChild(style)

    // Inject custom CSS if provided
    if (this.config.customCss) {
      const customStyle = document.createElement('style')
      customStyle.id = 'rinda-ask-custom-styles'
      customStyle.textContent = this.config.customCss
      document.head.appendChild(customStyle)
    }
  }

  private createContainer() {
    this.container = document.createElement('div')
    this.container.id = 'rinda-ask-widget'
    this.container.className = `rinda-ask-widget rinda-ask-${this.config.position}`
    document.body.appendChild(this.container)
  }

  private getOrCreateVisitorId(): string {
    const key = 'rinda_visitor_id'
    let visitorId = localStorage.getItem(key)
    if (!visitorId) {
      visitorId = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem(key, visitorId)
    }
    return visitorId
  }

  private createSessionId(): string {
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`
  }

  private buildVisitorContext(): VisitorContext {
    const url = new URL(window.location.href)

    // Get visit count
    const visitCountKey = `rinda_visit_count_${this.config.projectId}`
    const visitCount = parseInt(localStorage.getItem(visitCountKey) || '0') + 1
    localStorage.setItem(visitCountKey, visitCount.toString())

    // Get pages viewed this session
    const pagesKey = `rinda_pages_${this.sessionId}`
    const existingPages = JSON.parse(sessionStorage.getItem(pagesKey) || '[]')
    if (!existingPages.includes(url.pathname)) {
      existingPages.push(url.pathname)
      sessionStorage.setItem(pagesKey, JSON.stringify(existingPages))
    }

    return {
      pageUrl: window.location.href,
      pageTitle: document.title,
      referrer: document.referrer || null,
      utmSource: url.searchParams.get('utm_source'),
      utmMedium: url.searchParams.get('utm_medium'),
      utmCampaign: url.searchParams.get('utm_campaign'),
      utmContent: url.searchParams.get('utm_content'),
      utmTerm: url.searchParams.get('utm_term'),
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      country: null,
      city: null,
      visitCount,
      pagesViewed: existingPages,
      timeOnSite: 0,
      scrollDepth: 0,
    }
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getBrowser(): string {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Other'
  }

  private getOS(): string {
    const ua = navigator.userAgent
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
    return 'Other'
  }

  private async fetchVideos() {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/widget/${this.config.projectId}/videos`
      )
      if (response.ok) {
        const data = await response.json()
        this.videos = data.videos || []
      }
    } catch (error) {
      console.error('[RindaAsk] Failed to fetch videos:', error)
    }
  }

  private setupBehaviorTrackers() {
    // Time on page tracker
    setInterval(() => {
      this.timeOnPage++
      this.visitorContext.timeOnSite = this.timeOnPage
      if (!this.isOpen) this.checkTriggers()
    }, 1000)

    // Scroll depth tracker
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })

    // Exit intent tracker (desktop only)
    if (this.visitorContext.deviceType === 'desktop') {
      document.addEventListener('mouseout', this.handleMouseOut.bind(this))
    }

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && !this.hasInteracted) {
        this.trackEvent('page_hidden')
      }
    })
  }

  private handleScroll() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    this.scrollDepth = Math.round((scrollTop / docHeight) * 100)
    this.visitorContext.scrollDepth = this.scrollDepth

    if (!this.isOpen) this.checkTriggers()
  }

  private handleMouseOut(e: MouseEvent) {
    if (e.clientY <= 0 && !this.exitIntentTriggered && !this.isOpen) {
      this.exitIntentTriggered = true
      this.checkTriggers()
    }
  }

  private checkTriggers() {
    if (this.isOpen || this.hasInteracted) return

    for (const video of this.videos) {
      if (this.evaluateTriggerRules(video.triggerRules)) {
        this.showVideo(video)
        break
      }
    }
  }

  private evaluateTriggerRules(rules: TriggerRule[]): boolean {
    if (rules.length === 0) return false

    // Sort by priority and evaluate
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority)

    return sortedRules.every(rule => this.evaluateRule(rule))
  }

  private evaluateRule(rule: TriggerRule): boolean {
    const { type, operator, value } = rule

    switch (type) {
      case 'page_url':
        return this.compareValue(window.location.href, operator, value as string)

      case 'time_on_page':
        return this.compareNumber(this.timeOnPage, operator, value as number)

      case 'scroll_depth':
        return this.compareNumber(this.scrollDepth, operator, value as number)

      case 'exit_intent':
        return this.exitIntentTriggered === value

      case 'visit_count':
        return this.compareNumber(this.visitorContext.visitCount, operator, value as number)

      case 'returning_visitor':
        return (this.visitorContext.visitCount > 1) === value

      case 'utm_param':
        const utmValue = value as string
        const [param, paramValue] = utmValue.split('=')
        const contextKey = `utm${param.charAt(0).toUpperCase() + param.slice(1)}` as keyof VisitorContext
        return this.visitorContext[contextKey] === paramValue

      case 'device':
        return this.visitorContext.deviceType === value

      default:
        return true
    }
  }

  private compareValue(actual: string, operator: string, expected: string): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected
      case 'contains':
        return actual.includes(expected)
      case 'starts_with':
        return actual.startsWith(expected)
      case 'regex':
        return new RegExp(expected).test(actual)
      default:
        return false
    }
  }

  private compareNumber(actual: number, operator: string, expected: number): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected
      case 'greater_than':
        return actual > expected
      case 'less_than':
        return actual < expected
      default:
        return false
    }
  }

  private showVideo(video: VideoMessage) {
    this.currentVideo = video
    this.ui?.showVideo(video)
    this.open()
    this.trackEvent('video_shown', { videoId: video.id })
    this.incrementViewCount(video.id)
  }

  private handleOpen() {
    this.isOpen = true
    this.trackEvent('widget_opened')
  }

  private handleClose() {
    this.isOpen = false
    this.trackEvent('widget_closed')
  }

  private handleVideoEnd() {
    this.trackEvent('video_completed', { videoId: this.currentVideo?.id })
    this.ui?.showResponseOptions()
  }

  private async handleResponse(type: 'video' | 'voice' | 'text', data: Blob | string) {
    this.hasInteracted = true

    let responseUrl: string | undefined
    let responseText: string | undefined

    if (type === 'text') {
      responseText = data as string
    } else {
      // Upload media
      responseUrl = await this.uploadMedia(data as Blob, type)
    }

    // Submit lead
    await this.submitLead({
      projectId: this.config.projectId,
      videoMessageId: this.currentVideo?.id || null,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      interactionType: type,
      responseUrl,
      responseText,
      visitorContext: this.visitorContext,
    })

    this.trackEvent('response_submitted', {
      type,
      videoId: this.currentVideo?.id,
    })

    // Show thank you message
    this.ui?.showThankYou()
  }

  private async handleQuickReply(optionId: string) {
    this.hasInteracted = true

    const option = this.currentVideo?.responseOptions.find(o => o.id === optionId)
    if (!option) return

    await this.submitLead({
      projectId: this.config.projectId,
      videoMessageId: this.currentVideo?.id || null,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      interactionType: 'quick_reply',
      responseText: option.label,
      visitorContext: this.visitorContext,
    })

    this.trackEvent('quick_reply', { optionId, label: option.label })

    // Handle action
    switch (option.action) {
      case 'next_video':
        if (option.nextVideoId) {
          const nextVideo = this.videos.find(v => v.id === option.nextVideoId)
          if (nextVideo) {
            this.showVideo(nextVideo)
          }
        }
        break

      case 'phone_call':
        this.handlePhoneClick()
        break

      case 'calendar':
        if (option.actionValue) {
          window.open(option.actionValue, '_blank')
        }
        break

      case 'url':
        if (option.actionValue) {
          window.location.href = option.actionValue
        }
        break

      case 'close':
        this.close()
        break
    }
  }

  private async handlePhoneClick() {
    this.hasInteracted = true

    await this.submitLead({
      projectId: this.config.projectId,
      videoMessageId: this.currentVideo?.id || null,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      interactionType: 'phone',
      visitorContext: this.visitorContext,
    })

    this.trackEvent('phone_click')
  }

  private async uploadMedia(blob: Blob, type: 'video' | 'voice'): Promise<string> {
    const formData = new FormData()
    formData.append('file', blob, `${type}_${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`)
    formData.append('projectId', this.config.projectId)

    try {
      const response = await fetch(`${this.config.apiUrl}/api/widget/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.url
      }
    } catch (error) {
      console.error('[RindaAsk] Failed to upload media:', error)
    }

    return ''
  }

  private async submitLead(lead: LeadSubmission) {
    try {
      await fetch(`${this.config.apiUrl}/api/widget/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })

      if (this.currentVideo) {
        this.incrementResponseCount(this.currentVideo.id)
      }
    } catch (error) {
      console.error('[RindaAsk] Failed to submit lead:', error)
    }
  }

  private async trackEvent(eventType: string, data?: Record<string, unknown>) {
    try {
      await fetch(`${this.config.apiUrl}/api/widget/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: this.config.projectId,
          videoMessageId: this.currentVideo?.id || null,
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          eventType,
          eventData: data,
        }),
      })
    } catch {
      // Silent fail for analytics
    }
  }

  private async incrementViewCount(videoId: string) {
    try {
      await fetch(`${this.config.apiUrl}/api/widget/videos/${videoId}/view`, {
        method: 'POST',
      })
    } catch {
      // Silent fail
    }
  }

  private async incrementResponseCount(videoId: string) {
    try {
      await fetch(`${this.config.apiUrl}/api/widget/videos/${videoId}/response`, {
        method: 'POST',
      })
    } catch {
      // Silent fail
    }
  }

  // Public API
  public open() {
    this.ui?.open()
  }

  public close() {
    this.ui?.close()
  }

  public destroy() {
    this.container?.remove()
    document.getElementById('rinda-ask-styles')?.remove()
    document.getElementById('rinda-ask-custom-styles')?.remove()
  }
}
