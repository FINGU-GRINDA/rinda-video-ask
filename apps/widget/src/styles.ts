import { WidgetConfig } from './types'

export function createWidgetStyles(config: WidgetConfig): string {
  return `
    .rinda-ask-widget {
      position: fixed;
      z-index: ${config.zIndex};
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .rinda-ask-widget * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .rinda-ask-bottom-right {
      bottom: 20px;
      right: 20px;
    }

    .rinda-ask-bottom-left {
      bottom: 20px;
      left: 20px;
    }

    .rinda-ask-center {
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
    }

    /* Trigger Button */
    .rinda-ask-trigger {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${config.primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .rinda-ask-trigger:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
    }

    .rinda-ask-trigger-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .rinda-ask-trigger.has-preview {
      width: 80px;
      height: 80px;
      padding: 0;
      border: 3px solid ${config.primaryColor};
      box-shadow: 0 4px 25px rgba(99, 102, 241, 0.5), 0 0 0 4px rgba(99, 102, 241, 0.15);
    }

    .rinda-ask-trigger.has-preview:hover {
      width: 90px;
      height: 90px;
      border-width: 4px;
      box-shadow: 0 6px 30px rgba(99, 102, 241, 0.6), 0 0 0 6px rgba(99, 102, 241, 0.2);
    }

    .rinda-ask-trigger-video-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .rinda-ask-trigger-video-overlay.hidden {
      opacity: 0;
    }

    .rinda-ask-trigger-play-icon {
      width: 28px;
      height: 28px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .rinda-ask-trigger-play {
      position: absolute;
      width: 24px;
      height: 24px;
      fill: white;
    }

    .rinda-ask-trigger-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${config.primaryColor};
      animation: rinda-pulse 2s ease-out infinite;
    }

    @keyframes rinda-pulse {
      0% {
        transform: scale(1);
        opacity: 0.5;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    /* Widget Container */
    .rinda-ask-container {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      max-height: 600px;
      background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
      border-radius: ${config.borderRadius}px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .rinda-ask-container.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .rinda-ask-bottom-left .rinda-ask-container {
      right: auto;
      left: 0;
    }

    /* Mobile fullscreen */
    @media (max-width: 767px) {
      ${config.mobileFullscreen ? `
        .rinda-ask-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-height: none;
          border-radius: 0;
        }
      ` : ''}
    }

    /* Header */
    .rinda-ask-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
    }

    .rinda-ask-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .rinda-ask-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${config.primaryColor}20;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rinda-ask-header-name {
      font-weight: 600;
      font-size: 14px;
      color: ${config.theme === 'dark' ? '#f9fafb' : '#111827'};
    }

    .rinda-ask-header-status {
      font-size: 12px;
      color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    }

    .rinda-ask-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
      transition: background 0.2s;
    }

    .rinda-ask-close:hover {
      background: ${config.theme === 'dark' ? '#374151' : '#f3f4f6'};
    }

    /* Video Container */
    .rinda-ask-video-container {
      position: relative;
      aspect-ratio: 16/9;
      background: #000;
    }

    .rinda-ask-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rinda-ask-video-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
      pointer-events: none;
    }

    .rinda-ask-video-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    .rinda-ask-video-play:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    /* Response Options */
    .rinda-ask-options {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rinda-ask-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
      background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      color: ${config.theme === 'dark' ? '#f9fafb' : '#111827'};
    }

    .rinda-ask-option:hover {
      border-color: ${config.primaryColor};
      background: ${config.primaryColor}10;
    }

    .rinda-ask-option-icon {
      width: 20px;
      height: 20px;
      color: ${config.primaryColor};
    }

    /* Response Input Area */
    .rinda-ask-response {
      padding: 16px;
      border-top: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
    }

    .rinda-ask-response-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .rinda-ask-response-tab {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
      transition: all 0.2s;
    }

    .rinda-ask-response-tab:hover,
    .rinda-ask-response-tab.active {
      border-color: ${config.primaryColor};
      color: ${config.primaryColor};
      background: ${config.primaryColor}10;
    }

    .rinda-ask-textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
      background: ${config.theme === 'dark' ? '#111827' : '#f9fafb'};
      color: ${config.theme === 'dark' ? '#f9fafb' : '#111827'};
      font-size: 14px;
      resize: none;
      outline: none;
      font-family: inherit;
    }

    .rinda-ask-textarea:focus {
      border-color: ${config.primaryColor};
    }

    .rinda-ask-send {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      border-radius: 12px;
      border: none;
      background: ${config.primaryColor};
      color: white;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .rinda-ask-send:hover {
      background: ${config.accentColor};
    }

    .rinda-ask-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Recording UI */
    .rinda-ask-recording {
      padding: 24px;
      text-align: center;
    }

    .rinda-ask-recording-preview {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 12px;
      background: #000;
      margin-bottom: 16px;
      overflow: hidden;
    }

    .rinda-ask-recording-preview video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rinda-ask-recording-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .rinda-ask-recording-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ef4444;
      animation: rinda-blink 1s ease-in-out infinite;
    }

    @keyframes rinda-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .rinda-ask-recording-time {
      font-size: 24px;
      font-weight: 600;
      color: ${config.theme === 'dark' ? '#f9fafb' : '#111827'};
    }

    .rinda-ask-recording-controls {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .rinda-ask-record-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 4px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .rinda-ask-record-btn:hover {
      border-color: ${config.primaryColor};
    }

    .rinda-ask-record-btn-inner {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #ef4444;
      transition: all 0.2s;
    }

    .rinda-ask-record-btn.recording .rinda-ask-record-btn-inner {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }

    /* Phone Button (KakaoTalk style) */
    .rinda-ask-phone {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      background: #03c75a;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s;
      width: 100%;
      margin-top: 8px;
    }

    .rinda-ask-phone:hover {
      background: #02b351;
    }

    /* Thank You Screen */
    .rinda-ask-thankyou {
      padding: 48px 24px;
      text-align: center;
    }

    .rinda-ask-thankyou-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: #10b98120;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rinda-ask-thankyou-title {
      font-size: 20px;
      font-weight: 600;
      color: ${config.theme === 'dark' ? '#f9fafb' : '#111827'};
      margin-bottom: 8px;
    }

    .rinda-ask-thankyou-message {
      font-size: 14px;
      color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    }

    /* Branding */
    .rinda-ask-branding {
      padding: 12px;
      text-align: center;
      border-top: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
    }

    .rinda-ask-branding a {
      font-size: 11px;
      color: ${config.theme === 'dark' ? '#6b7280' : '#9ca3af'};
      text-decoration: none;
    }

    .rinda-ask-branding a:hover {
      color: ${config.primaryColor};
    }
  `
}
