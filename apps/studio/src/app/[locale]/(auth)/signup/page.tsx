'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Video, Mail, Lock, User, Building2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company: formData.company,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('가입이 완료되었습니다!')
      router.push('/onboarding')
    } catch {
      toast.error('가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOAuthSignup(provider: 'kakao' | 'google') {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/onboarding`,
        },
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
      }
    } catch {
      toast.error('가입 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-cyan-600 items-center justify-center p-12">
        <div className="max-w-lg text-white text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-4">
            5분이면 시작할 수 있어요
          </h2>
          <p className="text-lg opacity-90">
            복잡한 설정 없이 바로 영상 위젯을 설치하고
            더 많은 고객을 만나보세요.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-75">도입 기업</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-sm opacity-75">영상 조회</div>
            </div>
            <div>
              <div className="text-3xl font-bold">3배</div>
              <div className="text-sm opacity-75">전환율 향상</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">린다애스크</span>
            </Link>
            <h1 className="text-2xl font-bold">무료로 시작하기</h1>
            <p className="text-muted-foreground mt-2">신용카드 없이 바로 시작하세요</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthSignup('kakao')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-5.16 0-9.35 3.29-9.35 7.34 0 2.6 1.74 4.89 4.36 6.17-.14.51-.91 3.28-.94 3.5 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.69-2.41 4.27-2.82.44.06.89.1 1.33.1 5.16 0 9.35-3.29 9.35-7.34S17.16 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </button>

            <button
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border transition-colors disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 시작하기
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">또는 이메일로 가입</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  회사명
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="회사명"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                업무용 이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@company.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="최소 8자 이상"
                  required
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  가입 중...
                </>
              ) : (
                '무료로 시작하기'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            가입하면{' '}
            <Link href="/terms" className="text-primary-500 hover:underline">
              이용약관
            </Link>{' '}
            및{' '}
            <Link href="/privacy" className="text-primary-500 hover:underline">
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
