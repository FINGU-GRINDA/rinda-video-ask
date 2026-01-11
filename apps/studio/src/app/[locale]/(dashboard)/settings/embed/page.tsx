'use client'

import { useState } from 'react'
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DEMO_PROJECT_ID = 'demo-project-123'

export default function EmbedPage() {
  const [projectId] = useState(DEMO_PROJECT_ID)
  const [copied, setCopied] = useState(false)
  const [platform, setPlatform] = useState<'html' | 'react' | 'nextjs' | 'wordpress'>('html')

  const embedCode = {
    html: `<script
  src="https://cdn.rindaask.com/widget.js"
  data-project-id="${projectId}"
  async
></script>`,
    react: `// 1. Install the package
npm install @rindaask/react

// 2. Add the widget component
import { RindaAskWidget } from '@rindaask/react'

function App() {
  return (
    <div>
      {/* Your app content */}
      <RindaAskWidget projectId="${projectId}" />
    </div>
  )
}`,
    nextjs: `// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://cdn.rindaask.com/widget.js"
          data-project-id="${projectId}"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}`,
    wordpress: `// functions.php에 추가하세요:

function add_rindaask_widget() {
  ?>
  <script
    src="https://cdn.rindaask.com/widget.js"
    data-project-id="${projectId}"
    async
  ></script>
  <?php
}
add_action('wp_footer', 'add_rindaask_widget');`,
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode[platform])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { id: 'html', label: 'HTML', icon: Code },
    { id: 'react', label: 'React', icon: Zap },
    { id: 'nextjs', label: 'Next.js', icon: Globe },
    { id: 'wordpress', label: 'WordPress', icon: Shield },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">위젯 설치하기</h1>
        <p className="text-muted-foreground">
          코드 한 줄만 복사하면 웹사이트에 린다애스크 위젯이 설치됩니다
        </p>
      </div>

      {/* Quick Install Card */}
      <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">5분이면 설치 완료!</h2>
            <p className="text-muted-foreground text-sm">
              아래 코드를 웹사이트의 <code className="bg-white/60 px-1.5 py-0.5 rounded text-primary-600">&lt;body&gt;</code> 태그 안에 붙여넣으세요.
              페이지 어디든 상관없습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="bg-background rounded-2xl border overflow-hidden">
        <div className="border-b p-1 bg-muted/30">
          <div className="flex gap-1">
            {platforms.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    platform === p.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="p-6 overflow-x-auto text-sm bg-slate-950 text-slate-50 font-mono">
            <code>{embedCode[platform]}</code>
          </pre>
          <button
            onClick={handleCopy}
            className={cn(
              'absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                코드 복사
              </>
            )}
          </button>
        </div>
      </div>

      {/* Project ID Info */}
      <div className="bg-background rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">내 프로젝트 ID</div>
            <code className="text-lg font-mono font-medium">{projectId}</code>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(projectId)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            복사
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-background rounded-2xl border overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold">미리보기</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-muted text-foreground">
              <Monitor className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-50 min-h-[300px] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold">
                린다
              </div>
              <div>
                <div className="font-semibold">안녕하세요!</div>
                <div className="text-sm text-muted-foreground">궁금한 점이 있으신가요?</div>
              </div>
            </div>
            <div className="aspect-video bg-slate-200 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-muted-foreground text-sm">영상 미리보기</div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium">
                영상으로 답하기
              </button>
              <button className="flex-1 py-2.5 rounded-lg border text-sm font-medium">
                텍스트로 답하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Link */}
      <div className="bg-background rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium">라이브 데모에서 테스트해보세요</div>
              <div className="text-sm text-muted-foreground">
                설치 전에 위젯이 어떻게 동작하는지 직접 체험해보세요
              </div>
            </div>
          </div>
          <a
            href="/demo"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            데모 페이지 열기
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Help Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <a
          href="#"
          className="bg-background rounded-xl border p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-5 h-5 text-primary-500" />
            <span className="font-medium group-hover:text-primary-500 transition-colors">설치 가이드</span>
          </div>
          <p className="text-sm text-muted-foreground">
            각 플랫폼별 상세 설치 방법을 확인하세요
          </p>
        </a>
        <a
          href="#"
          className="bg-background rounded-xl border p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-5 h-5 text-primary-500" />
            <span className="font-medium group-hover:text-primary-500 transition-colors">트리거 설정</span>
          </div>
          <p className="text-sm text-muted-foreground">
            위젯이 나타나는 조건을 설정하는 방법
          </p>
        </a>
        <a
          href="#"
          className="bg-background rounded-xl border p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-5 h-5 text-primary-500" />
            <span className="font-medium group-hover:text-primary-500 transition-colors">문제 해결</span>
          </div>
          <p className="text-sm text-muted-foreground">
            설치 후 위젯이 나타나지 않을 때
          </p>
        </a>
      </div>
    </div>
  )
}
