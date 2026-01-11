import Link from 'next/link'
import { ArrowRight, Video, MessageSquare, Brain, BarChart3, Globe, Phone, Sparkles, CheckCircle2, Play, Zap, Shield, Clock, Menu } from 'lucide-react'
import { UnifiedWidget } from '@/components/widget/unified-widget'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">린다애스크</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/demo"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                데모 체험
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
              >
                무료로 시작하기
              </Link>
            </div>
            {/* Mobile Navigation */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1.5 text-xs font-medium text-white"
              >
                시작하기
              </Link>
              <Link
                href="/login"
                className="text-xs font-medium text-muted-foreground"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-100">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">AI 대화형 비디오 위젯으로 고객 경험 혁신</span>
            <span className="xs:hidden">AI 비디오 위젯</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            웹사이트 방문자에게
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent">직접 인사하세요</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-2 sm:mb-4 px-4 sm:px-0">
            대표님의 따뜻한 영상 인사로 방문자를 맞이하세요.
          </p>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-10 px-4 sm:px-0">
            고객이 영상으로 답하면, <strong className="text-foreground">AI가 24시간 자동 응대</strong>해드립니다.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-10 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
              <span>5분 설치</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
              <span>무료 시작</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
              <span>24시간 AI 응대</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary-500/25"
            >
              지금 바로 시작하기
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-primary-600 hover:bg-primary-50 transition-colors group"
            >
              <Play className="w-4 h-4" />
              실시간 데모 체험
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">3단계로 완성하는 고객 응대 자동화</h2>
            <p className="text-sm sm:text-lg text-muted-foreground px-4 sm:px-0">
              코드 한 줄만 붙여넣으면 준비 끝!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-background rounded-xl sm:rounded-2xl p-5 sm:p-8 border hover:shadow-lg transition-shadow group">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-primary-500 mb-1 sm:mb-2">Step 1</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">환영 영상 녹화하기</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                스튜디오에서 간단히 인사 영상을 녹화하세요.
              </p>
            </div>

            <div className="bg-background rounded-xl sm:rounded-2xl p-5 sm:p-8 border hover:shadow-lg transition-shadow group">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-primary-500 mb-1 sm:mb-2">Step 2</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">웹사이트에 설치하기</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                스크립트 한 줄을 복사해서 붙여넣으세요.
              </p>
            </div>

            <div className="bg-background rounded-xl sm:rounded-2xl p-5 sm:p-8 border hover:shadow-lg transition-shadow group sm:col-span-2 md:col-span-1">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-primary-500 mb-1 sm:mb-2">Step 3</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">AI가 분석한 리드 받기</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                AI가 자동으로 구매 의도와 긴급도를 분석해요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                왜 린다애스크인가요?
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                차가운 챗봇 대신,<br />
                <span className="text-primary-500">따뜻한 영상</span>으로 신뢰를
              </h2>
              <div className="space-y-3 sm:space-y-5">
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">글로벌 고객 응대</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      다국어 응답을 AI가 자동으로 번역해드려요.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">긴급 고객 바로 연결</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      AI가 중요한 고객을 즉시 연결해드려요.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">우선순위 자동 분석</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      구매 의사, 예산, 긴급도를 자동 분석해요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-40 h-24 sm:h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative text-center">
                <div className="text-5xl sm:text-7xl font-bold mb-1 sm:mb-2">3배</div>
                <div className="text-base sm:text-xl opacity-90 mb-4 sm:mb-8">더 높은 리드 전환율</div>
                <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                  <div className="text-sm sm:text-base opacity-90 mb-2 sm:mb-3">
                    "린다애스크를 도입한 후 고객 문의가 3배나 늘었어요."
                  </div>
                  <div className="text-xs sm:text-sm font-medium opacity-75">
                    — 김○○ 대표 / IT 스타트업
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="max-w-4xl mx-auto text-center text-white relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
            오늘 시작하면, 내일 첫 고객을 만날 수 있어요
          </h2>
          <p className="text-base sm:text-xl opacity-90 mb-6 sm:mb-10 px-4">
            지금 바로 무료로 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary-600 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-semibold hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
            >
              무료로 시작하기
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 text-white px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors"
            >
              데모 먼저 체험하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 sm:gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg">린다애스크</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">문의하기</Link>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            © 2025 Rinda Inc.
          </div>
        </div>
      </footer>

      {/* Video Widget - Floating at bottom right */}
      <UnifiedWidget
        videoUrl="/videos/hojin_demo.mp4"
        position="bottom-right"
        primaryColor="#6366f1"
        gradient="from-primary-500 to-cyan-600"
        aiEnabled={true}
        calendarEnabled={true}
        phoneNumber="010-6326-9009"
        companyName="린다애스크"
        demoMode={true}
      />
    </div>
  )
}
