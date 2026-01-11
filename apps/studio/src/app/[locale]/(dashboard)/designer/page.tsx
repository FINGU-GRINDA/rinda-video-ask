'use client'

import { useState } from 'react'
import {
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Layout,
  Type,
  Code,
  Copy,
  Check,
  Eye,
  Settings2,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Position = 'bottom-right' | 'bottom-left' | 'center'
type Theme = 'light' | 'dark' | 'auto'
type DevicePreview = 'desktop' | 'tablet' | 'mobile'

interface WidgetConfig {
  position: Position
  theme: Theme
  primaryColor: string
  accentColor: string
  borderRadius: number
  showBranding: boolean
  mobileFullscreen: boolean
  autoPlay: boolean
  soundEnabled: boolean
  language: string
  zIndex: number
}

const defaultConfig: WidgetConfig = {
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
  zIndex: 999999,
}

const presetColors = [
  { name: 'Indigo', primary: '#6366f1', accent: '#818cf8' },
  { name: 'Blue', primary: '#3b82f6', accent: '#60a5fa' },
  { name: 'Emerald', primary: '#10b981', accent: '#34d399' },
  { name: 'Rose', primary: '#f43f5e', accent: '#fb7185' },
  { name: 'Amber', primary: '#f59e0b', accent: '#fbbf24' },
  { name: 'Purple', primary: '#8b5cf6', accent: '#a78bfa' },
]

export default function DesignerPage() {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)
  const [devicePreview, setDevicePreview] = useState<DevicePreview>('desktop')
  const [activeTab, setActiveTab] = useState<'appearance' | 'behavior' | 'embed'>('appearance')
  const [copied, setCopied] = useState(false)

  const embedCode = `<script
  src="https://cdn.rindaask.com/widget.js"
  data-project-id="YOUR_PROJECT_ID"
  data-position="${config.position}"
  data-theme="${config.theme}"
  data-primary-color="${config.primaryColor}"
  async
></script>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deviceSizes = {
    desktop: { width: '100%', maxWidth: '800px' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' },
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">위젯 디자이너</h1>
          <p className="text-muted-foreground">위젯의 모양과 동작을 커스터마이즈하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfig(defaultConfig)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            초기화
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Check className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Settings Panel */}
        <div className="w-80 bg-background rounded-xl border flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            {[
              { id: 'appearance', label: '외관', icon: Palette },
              { id: 'behavior', label: '동작', icon: Settings2 },
              { id: 'embed', label: '설치', icon: Code },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'appearance' && (
              <>
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium mb-3">위치</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'bottom-left', label: '좌하단' },
                      { value: 'bottom-right', label: '우하단' },
                      { value: 'center', label: '중앙' },
                    ].map(pos => (
                      <button
                        key={pos.value}
                        onClick={() => setConfig({ ...config, position: pos.value as Position })}
                        className={cn(
                          'p-3 rounded-lg border text-sm transition-colors',
                          config.position === pos.value
                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                            : 'hover:bg-muted'
                        )}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium mb-3">테마</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'light', label: '라이트' },
                      { value: 'dark', label: '다크' },
                      { value: 'auto', label: '자동' },
                    ].map(theme => (
                      <button
                        key={theme.value}
                        onClick={() => setConfig({ ...config, theme: theme.value as Theme })}
                        className={cn(
                          'p-3 rounded-lg border text-sm transition-colors',
                          config.theme === theme.value
                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                            : 'hover:bg-muted'
                        )}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium mb-3">색상 프리셋</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetColors.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => setConfig({
                          ...config,
                          primaryColor: preset.primary,
                          accentColor: preset.accent,
                        })}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-lg border transition-colors',
                          config.primaryColor === preset.primary
                            ? 'border-primary-500'
                            : 'hover:bg-muted'
                        )}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ background: preset.primary }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">메인 색상</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">보조 색상</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    테두리 둥글기: {config.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={config.borderRadius}
                    onChange={(e) => setConfig({ ...config, borderRadius: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Branding */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">린다애스크 브랜딩 표시</span>
                  <button
                    onClick={() => setConfig({ ...config, showBranding: !config.showBranding })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      config.showBranding ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      config.showBranding ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </>
            )}

            {activeTab === 'behavior' && (
              <>
                {/* Auto Play */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block">자동 재생</span>
                    <span className="text-xs text-muted-foreground">위젯 열릴 때 영상 자동 재생</span>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, autoPlay: !config.autoPlay })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      config.autoPlay ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      config.autoPlay ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block">소리 활성화</span>
                    <span className="text-xs text-muted-foreground">영상 소리 기본값</span>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      config.soundEnabled ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      config.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                {/* Mobile Fullscreen */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block">모바일 전체화면</span>
                    <span className="text-xs text-muted-foreground">모바일에서 전체화면으로 표시</span>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, mobileFullscreen: !config.mobileFullscreen })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      config.mobileFullscreen ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      config.mobileFullscreen ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-2">기본 언어</label>
                  <select
                    value={config.language}
                    onChange={(e) => setConfig({ ...config, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                {/* Z-Index */}
                <div>
                  <label className="block text-sm font-medium mb-2">Z-Index</label>
                  <input
                    type="number"
                    value={config.zIndex}
                    onChange={(e) => setConfig({ ...config, zIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-background"
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    다른 요소와 겹칠 때 우선순위 조정
                  </span>
                </div>
              </>
            )}

            {activeTab === 'embed' && (
              <>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">설치 코드</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          복사됨!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          복사
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
                    {embedCode}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">설치 방법</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>위 코드를 복사하세요</li>
                    <li>YOUR_PROJECT_ID를 실제 프로젝트 ID로 교체하세요</li>
                    <li>웹사이트의 &lt;body&gt; 태그 닫기 전에 붙여넣으세요</li>
                    <li>저장하고 새로고침하면 완료!</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>팁:</strong> Google Tag Manager를 사용중이라면 커스텀 HTML 태그로 추가할 수 있습니다.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-background rounded-xl border flex flex-col">
          {/* Preview Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">미리보기</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone },
              ].map(device => (
                <button
                  key={device.id}
                  onClick={() => setDevicePreview(device.id as DevicePreview)}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    devicePreview === device.id
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-background/50'
                  )}
                >
                  <device.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-4 bg-muted/30 overflow-auto flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
              style={{
                width: deviceSizes[devicePreview].width,
                maxWidth: deviceSizes[devicePreview].maxWidth,
                height: devicePreview === 'mobile' ? '667px' : '500px',
              }}
            >
              {/* Simulated Website */}
              <div className="h-full relative bg-gray-100">
                {/* Fake website content */}
                <div className="p-4 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                  <div className="h-32 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>

                {/* Widget Preview */}
                <div
                  className={cn(
                    'absolute',
                    config.position === 'bottom-right' && 'bottom-4 right-4',
                    config.position === 'bottom-left' && 'bottom-4 left-4',
                    config.position === 'center' && 'bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2'
                  )}
                >
                  {/* Trigger Button */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
                    style={{ background: config.primaryColor }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>

                  {/* Widget Window (collapsed preview) */}
                  <div
                    className={cn(
                      'absolute bottom-16 w-72 shadow-2xl overflow-hidden transition-all',
                      config.position === 'bottom-left' ? 'left-0' : 'right-0'
                    )}
                    style={{
                      borderRadius: `${config.borderRadius}px`,
                      background: config.theme === 'dark' ? '#1f2937' : '#ffffff',
                    }}
                  >
                    {/* Header */}
                    <div
                      className="p-3 flex items-center gap-3"
                      style={{ borderBottom: `1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'}` }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${config.primaryColor}20` }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={config.primaryColor}>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div>
                        <div
                          className="font-medium text-sm"
                          style={{ color: config.theme === 'dark' ? '#f9fafb' : '#111827' }}
                        >
                          안녕하세요!
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: config.theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                        >
                          지금 응답 가능
                        </div>
                      </div>
                    </div>

                    {/* Video Preview */}
                    <div className="aspect-video bg-black flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>

                    {/* Response Options */}
                    <div className="p-3 space-y-2">
                      {['네, 관심있어요', '가격이 궁금해요', '담당자 연결'].map((label, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg text-xs transition-colors cursor-pointer"
                          style={{
                            border: `1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                            color: config.theme === 'dark' ? '#f9fafb' : '#111827',
                          }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Branding */}
                    {config.showBranding && (
                      <div
                        className="p-2 text-center text-xs"
                        style={{
                          borderTop: `1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                          color: config.theme === 'dark' ? '#6b7280' : '#9ca3af',
                        }}
                      >
                        Powered by 린다애스크
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
