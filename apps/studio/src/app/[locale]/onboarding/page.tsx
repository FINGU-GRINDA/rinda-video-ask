'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Building2, Globe, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    teamSize: '',
    useCase: '',
  })

  const supabase = createClient()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('로그인이 필요합니다')
        router.push('/login?redirect=/onboarding')
        return
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [router, supabase.auth])

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) {
      toast.error('회사명을 입력해주세요')
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('로그인 세션이 만료되었습니다')
        router.push('/login?redirect=/onboarding')
        return
      }

      // Create organization
      const slug = formData.companyName
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50) + '-' + Date.now().toString(36)

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.companyName,
          slug,
          website: formData.website || null,
          settings: {
            industry: formData.industry,
            team_size: formData.teamSize,
            use_case: formData.useCase,
            default_language: 'ko',
          },
        })
        .select('id')
        .single()

      if (orgError) throw orgError

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'owner',
        })

      if (memberError) throw memberError

      // Create default project
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          organization_id: org.id,
          name: 'Default Project',
          domain: formData.website || null,
        })

      if (projectError) throw projectError

      toast.success('환경 설정이 완료되었습니다!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('설정 중 문제가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Video className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">린다애스크</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            거의 다 왔어요!
          </div>
          <h1 className="text-2xl font-bold mb-2">맞춤 설정을 시작할게요</h1>
          <p className="text-muted-foreground">몇 가지 정보만 입력하면 바로 사용할 수 있어요</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-primary-500 to-cyan-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="예: 린다 주식회사"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">위젯에 표시되는 이름이에요</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  웹사이트 URL <span className="text-muted-foreground text-xs">(선택)</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">위젯을 설치할 웹사이트 주소예요</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  산업 분야 <span className="text-muted-foreground text-xs">(선택)</span>
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">산업 분야를 선택해주세요</option>
                  <option value="saas">SaaS / 소프트웨어</option>
                  <option value="ecommerce">이커머스 / 온라인 쇼핑몰</option>
                  <option value="education">교육 / 에듀테크</option>
                  <option value="finance">금융 / 핀테크</option>
                  <option value="healthcare">헬스케어 / 의료</option>
                  <option value="consulting">컨설팅 / 전문 서비스</option>
                  <option value="agency">마케팅 / 에이전시</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
              >
                다음 단계로
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  팀 규모 <span className="text-muted-foreground text-xs">(선택)</span>
                </label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">팀 규모를 선택해주세요</option>
                  <option value="1">1명 (개인 사업자)</option>
                  <option value="2-10">2~10명 (소규모 팀)</option>
                  <option value="11-50">11~50명 (중규모)</option>
                  <option value="51-200">51~200명 (성장 기업)</option>
                  <option value="200+">200명 이상 (대기업)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  어떤 용도로 사용하실 예정인가요? <span className="text-muted-foreground text-xs">(선택)</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'lead-gen', label: '잠재 고객 발굴', desc: '웹사이트 방문자를 리드로 전환' },
                    { value: 'support', label: '고객 문의 응대', desc: '24시간 AI 자동 응대로 고객 만족도 향상' },
                    { value: 'onboarding', label: '고객 온보딩 / 교육', desc: '영상으로 쉽고 친근하게 안내' },
                    { value: 'sales', label: '제품 데모 / 영업', desc: '영상으로 제품을 직접 소개' },
                    { value: 'feedback', label: '고객 의견 수집', desc: '영상 피드백으로 진심을 담은 의견 확인' },
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.useCase === option.value
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'hover:bg-muted hover:border-muted-foreground/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="useCase"
                        value={option.value}
                        checked={formData.useCase === option.value}
                        onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                        className="mt-0.5 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium">{option.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  이전으로
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      설정 중...
                    </>
                  ) : (
                    <>
                      시작하기
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          걱정 마세요! 모든 설정은 나중에 언제든지 변경할 수 있어요
        </p>
      </div>
    </div>
  )
}
