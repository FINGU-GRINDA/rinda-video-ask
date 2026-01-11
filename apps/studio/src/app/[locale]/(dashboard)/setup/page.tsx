'use client'

import { useState } from 'react'
import {
  Globe,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  MousePointerClick,
  ShoppingCart,
  Users,
  HelpCircle,
  Zap,
  Target,
  TrendingUp,
  Copy,
  Check,
  Play,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type TriggerScenario = {
  id: string
  name: string
  icon: typeof DollarSign
  description: string
  timing: string
  targetPages: string[]
  expectedConversionLift: string
  priority: 'high' | 'medium' | 'low'
  welcomeMessage: string
}

type AnalysisResult = {
  websiteType: string
  industry: string
  recommendations: TriggerScenario[]
  insights: string[]
}

// AI 분석 시뮬레이션 (실제로는 AI API 호출)
const analyzeWebsite = async (url: string): Promise<AnalysisResult> => {
  // 시뮬레이션을 위한 딜레이
  await new Promise(resolve => setTimeout(resolve, 3000))

  const domain = url.toLowerCase()

  // 도메인 패턴에 따른 분석
  if (domain.includes('shop') || domain.includes('store') || domain.includes('mall')) {
    return {
      websiteType: '이커머스',
      industry: '온라인 쇼핑몰',
      recommendations: [
        {
          id: 'cart-abandon',
          name: '장바구니 이탈 방지',
          icon: ShoppingCart,
          description: '장바구니에 상품을 담고 이탈하려는 고객에게 영상으로 다가가세요',
          timing: '장바구니 페이지에서 이탈 시도 시',
          targetPages: ['/cart', '/checkout'],
          expectedConversionLift: '+25%',
          priority: 'high',
          welcomeMessage: '잠깐만요! 장바구니에 담아주신 상품이 있네요. 결제 과정에서 궁금한 점이 있으신가요? 배송이나 환불 정책에 대해 바로 답변드릴게요!',
        },
        {
          id: 'product-help',
          name: '상품 상담 도우미',
          icon: HelpCircle,
          description: '상품 페이지에서 오래 머무르는 고객에게 도움을 제안하세요',
          timing: '상품 페이지 30초 이상 체류 시',
          targetPages: ['/product/*', '/item/*'],
          expectedConversionLift: '+18%',
          priority: 'high',
          welcomeMessage: '이 상품에 관심이 있으신가요? 사이즈, 색상, 재고 등 궁금한 점이 있으시면 바로 답변드릴게요!',
        },
        {
          id: 'exit-popup',
          name: '이탈 방지 팝업',
          icon: MousePointerClick,
          description: '사이트를 떠나려는 고객을 잡아두세요',
          timing: '브라우저 이탈 감지 시',
          targetPages: ['/*'],
          expectedConversionLift: '+12%',
          priority: 'medium',
          welcomeMessage: '떠나시기 전에! 첫 구매 고객님께 10% 할인 쿠폰을 드릴게요. 관심 있으시면 말씀해주세요!',
        },
      ],
      insights: [
        '이커머스 사이트의 평균 장바구니 이탈율은 70%입니다. 영상 위젯으로 이탈율을 25% 낮출 수 있어요.',
        '상품 페이지에서 30초 이상 머무르는 고객은 구매 의향이 높습니다.',
        '첫 구매 전환을 위한 쿠폰 제안이 효과적입니다.',
      ],
    }
  }

  if (domain.includes('saas') || domain.includes('app') || domain.includes('software')) {
    return {
      websiteType: 'SaaS',
      industry: '소프트웨어 서비스',
      recommendations: [
        {
          id: 'pricing-help',
          name: '가격 페이지 안내',
          icon: DollarSign,
          description: '가격 페이지에서 고민하는 잠재 고객에게 다가가세요',
          timing: '가격 페이지 10초 이상 체류 시',
          targetPages: ['/pricing', '/plans'],
          expectedConversionLift: '+35%',
          priority: 'high',
          welcomeMessage: '안녕하세요! 요금제를 살펴보고 계시네요. 어떤 플랜이 맞을지 도와드릴까요? 무료 체험도 가능해요!',
        },
        {
          id: 'demo-request',
          name: '데모 요청 유도',
          icon: Play,
          description: '주요 기능 페이지에서 데모 요청을 유도하세요',
          timing: '기능 페이지 20초 이상 체류 시',
          targetPages: ['/features', '/solutions'],
          expectedConversionLift: '+28%',
          priority: 'high',
          welcomeMessage: '우리 서비스에 관심을 가져주셔서 감사해요! 실제로 어떻게 동작하는지 10분 데모로 보여드릴까요?',
        },
        {
          id: 'trial-convert',
          name: '무료 체험 전환',
          icon: Zap,
          description: '무료 체험 중인 사용자를 유료 고객으로 전환하세요',
          timing: '대시보드에서 체험 기간 종료 3일 전',
          targetPages: ['/dashboard', '/app'],
          expectedConversionLift: '+22%',
          priority: 'medium',
          welcomeMessage: '체험 기간이 곧 종료돼요! 지금까지 사용해보시면서 궁금한 점이 있으셨나요? 업그레이드 관련 질문도 환영해요!',
        },
      ],
      insights: [
        'SaaS 가격 페이지 방문자의 70%는 구매 고민 중입니다. 영상으로 신뢰를 쌓아보세요.',
        '무료 체험에서 유료 전환율은 평균 15%입니다. 영상 상담으로 30%까지 높일 수 있어요.',
        'B2B 고객은 영상을 통한 인간적인 소통에 높은 신뢰를 보입니다.',
      ],
    }
  }

  // 기본 (일반 비즈니스 웹사이트)
  return {
    websiteType: '비즈니스 웹사이트',
    industry: '일반 서비스',
    recommendations: [
      {
        id: 'welcome-greeting',
        name: '환영 인사',
        icon: Users,
        description: '첫 방문자에게 따뜻한 영상 인사로 맞이하세요',
        timing: '첫 방문 후 5초',
        targetPages: ['/', '/home'],
        expectedConversionLift: '+20%',
        priority: 'high',
        welcomeMessage: '안녕하세요! 저희 서비스에 관심을 가져주셔서 감사해요. 궁금한 점이 있으시면 언제든 물어봐주세요!',
      },
      {
        id: 'contact-assist',
        name: '문의 페이지 도우미',
        icon: HelpCircle,
        description: '문의 페이지에서 망설이는 고객을 도와주세요',
        timing: '문의 페이지 15초 이상 체류 시',
        targetPages: ['/contact', '/inquiry'],
        expectedConversionLift: '+30%',
        priority: 'high',
        welcomeMessage: '문의하시려고 하셨나요? 폼 작성이 번거로우시면 바로 영상이나 음성으로 말씀해주세요!',
      },
      {
        id: 'service-explain',
        name: '서비스 설명',
        icon: Target,
        description: '서비스 페이지에서 추가 설명을 제공하세요',
        timing: '서비스 페이지 20초 이상 체류 시',
        targetPages: ['/services', '/about'],
        expectedConversionLift: '+15%',
        priority: 'medium',
        welcomeMessage: '저희 서비스에 대해 더 자세히 알고 싶으신가요? 궁금한 점을 바로 답변드릴게요!',
      },
    ],
    insights: [
      '첫 방문자에게 영상 인사를 보내면 체류 시간이 40% 증가합니다.',
      '문의 페이지 이탈율은 평균 60%입니다. 영상 위젯으로 이탈율을 절반으로 줄일 수 있어요.',
      '직접 얼굴을 보여주는 것만으로 브랜드 신뢰도가 크게 상승합니다.',
    ],
  }
}

export default function SmartSetupPage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [step, setStep] = useState<'input' | 'analyzing' | 'result' | 'complete'>('input')
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    if (!websiteUrl.trim()) return

    setIsAnalyzing(true)
    setStep('analyzing')

    try {
      const result = await analyzeWebsite(websiteUrl)
      setAnalysisResult(result)
      // 기본적으로 high priority 시나리오 선택
      setSelectedScenarios(
        result.recommendations
          .filter(r => r.priority === 'high')
          .map(r => r.id)
      )
      setStep('result')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleScenario = (id: string) => {
    setSelectedScenarios(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  const handleApply = () => {
    // 선택된 시나리오 적용 로직
    setStep('complete')
  }

  const handleCopyCode = () => {
    const code = `<script
  src="https://cdn.rindaask.com/widget.js"
  data-project-id="demo-project-123"
  data-triggers='${JSON.stringify(selectedScenarios)}'
  async
></script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '높은 효과'
      case 'medium':
        return '보통 효과'
      case 'low':
        return '부가 효과'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI 전환율 최적화
        </div>
        <h1 className="text-2xl font-bold mb-2">스마트 셋업</h1>
        <p className="text-muted-foreground">
          웹사이트 URL만 입력하면 AI가 최적의 트리거 시나리오를 추천해드려요
        </p>
      </div>

      {/* Step 1: URL Input */}
      {step === 'input' && (
        <div className="space-y-6">
          <div className="bg-background rounded-2xl border p-8">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">웹사이트 분석 시작하기</h2>
                <p className="text-muted-foreground text-sm">
                  위젯을 설치할 웹사이트 주소를 입력해주세요.<br />
                  AI가 사이트를 분석해서 맞춤 시나리오를 추천해드려요.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">웹사이트 URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    예: https://myshop.com, https://myapp.io
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!websiteUrl.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-medium text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  AI 분석 시작하기
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl border p-5">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-1">맞춤 시나리오</h3>
              <p className="text-sm text-muted-foreground">
                업종과 페이지 특성에 맞는 최적의 트리거 조건을 추천해요
              </p>
            </div>
            <div className="bg-background rounded-xl border p-5">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-1">전환율 예측</h3>
              <p className="text-sm text-muted-foreground">
                각 시나리오의 예상 전환율 상승 효과를 미리 확인하세요
              </p>
            </div>
            <div className="bg-background rounded-xl border p-5">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-1">원클릭 적용</h3>
              <p className="text-sm text-muted-foreground">
                추천받은 시나리오를 한 번의 클릭으로 바로 적용할 수 있어요
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Analyzing */}
      {step === 'analyzing' && (
        <div className="bg-background rounded-2xl border p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI가 웹사이트를 분석하고 있어요</h2>
            <p className="text-muted-foreground mb-8">
              {websiteUrl}의 구조와 특성을 파악해서<br />
              최적의 전환율 향상 전략을 찾고 있어요
            </p>

            <div className="max-w-md mx-auto space-y-3">
              {[
                '웹사이트 구조 분석 중...',
                '업종 및 비즈니스 유형 파악 중...',
                '최적 트리거 포인트 탐색 중...',
                '전환율 예측 모델 적용 중...',
              ].map((text, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    idx < 2 ? "bg-primary-50 text-primary-700" : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx < 2 ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'result' && analysisResult && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm opacity-80 mb-1">분석 완료</div>
                <h2 className="text-xl font-bold mb-1">{analysisResult.websiteType}</h2>
                <p className="text-sm opacity-90">업종: {analysisResult.industry}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{analysisResult.recommendations.length}</div>
                <div className="text-xs opacity-80">추천 시나리오</div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-background rounded-xl border p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              AI 인사이트
            </h3>
            <ul className="space-y-2">
              {analysisResult.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Scenarios */}
          <div>
            <h3 className="font-semibold mb-4">추천 트리거 시나리오</h3>
            <div className="space-y-3">
              {analysisResult.recommendations.map((scenario) => {
                const Icon = scenario.icon
                const isSelected = selectedScenarios.includes(scenario.id)

                return (
                  <div
                    key={scenario.id}
                    onClick={() => toggleScenario(scenario.id)}
                    className={cn(
                      "bg-background rounded-xl border p-5 cursor-pointer transition-all",
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-500/20"
                        : "hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary-100" : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "w-6 h-6",
                          isSelected ? "text-primary-600" : "text-muted-foreground"
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{scenario.name}</h4>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            getPriorityColor(scenario.priority)
                          )}>
                            {getPriorityLabel(scenario.priority)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {scenario.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {scenario.timing}
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3" />
                            전환율 {scenario.expectedConversionLift}
                          </div>
                        </div>

                        {/* Preview Message */}
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">환영 메시지 미리보기</div>
                          <p className="text-sm">{scenario.welcomeMessage}</p>
                        </div>
                      </div>

                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected
                          ? "border-primary-500 bg-primary-500"
                          : "border-muted-foreground/30"
                      )}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex items-center justify-between bg-background rounded-xl border p-4">
            <div>
              <div className="font-medium">{selectedScenarios.length}개 시나리오 선택됨</div>
              <div className="text-sm text-muted-foreground">
                선택한 시나리오를 위젯에 적용합니다
              </div>
            </div>
            <button
              onClick={handleApply}
              disabled={selectedScenarios.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-medium"
            >
              시나리오 적용하기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && (
        <div className="space-y-6">
          <div className="bg-background rounded-2xl border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">설정이 완료되었어요!</h2>
            <p className="text-muted-foreground mb-6">
              {selectedScenarios.length}개의 트리거 시나리오가 적용되었습니다.<br />
              이제 웹사이트에 위젯 코드를 설치해주세요.
            </p>

            {/* Embed Code */}
            <div className="bg-slate-950 rounded-xl p-4 text-left mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">설치 코드</span>
                <button
                  onClick={handleCopyCode}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    copied ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      복사
                    </>
                  )}
                </button>
              </div>
              <pre className="text-sm text-slate-300 overflow-x-auto">
{`<script
  src="https://cdn.rindaask.com/widget.js"
  data-project-id="demo-project-123"
  async
></script>`}
              </pre>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link
                href="/videos/new"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 transition-all font-medium"
              >
                환영 영상 녹화하기
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/designer"
                className="flex items-center gap-2 px-5 py-3 border rounded-xl hover:bg-muted transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                위젯 디자인 수정
              </Link>
            </div>
          </div>

          {/* Applied Scenarios Summary */}
          <div className="bg-background rounded-xl border p-5">
            <h3 className="font-semibold mb-4">적용된 시나리오</h3>
            <div className="space-y-2">
              {analysisResult?.recommendations
                .filter(r => selectedScenarios.includes(r.id))
                .map(scenario => {
                  const Icon = scenario.icon
                  return (
                    <div key={scenario.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">{scenario.name}</span>
                      <span className="text-sm text-green-600 ml-auto">
                        {scenario.expectedConversionLift}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
