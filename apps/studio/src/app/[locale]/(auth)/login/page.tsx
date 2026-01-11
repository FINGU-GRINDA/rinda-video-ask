'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Video, Mail, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || '로그인에 실패했습니다')
        return
      }

      toast.success('로그인 성공!')
      router.push(redirect)
      router.refresh()
    } catch {
      toast.error('로그인 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOAuthLogin(provider: 'kakao' | 'google') {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })

      if (error) {
        toast.error(error.message || '로그인에 실패했습니다')
        setIsLoading(false)
      }
    } catch {
      toast.error('로그인 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">린다애스크</span>
        </Link>
        <h1 className="text-2xl font-bold">다시 만나서 반가워요!</h1>
        <p className="text-muted-foreground mt-2">계정에 로그인하세요</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleOAuthLogin('kakao')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.16 0-9.35 3.29-9.35 7.34 0 2.6 1.74 4.89 4.36 6.17-.14.51-.91 3.28-.94 3.5 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.69-2.41 4.27-2.82.44.06.89.1 1.33.1 5.16 0 9.35-3.29 9.35-7.34S17.16 3 12 3z"/>
          </svg>
          카카오로 계속하기
        </button>

        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 계속하기
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">또는 이메일로 로그인</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            이메일
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium">
              비밀번호
            </label>
            <Link href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
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
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-primary-500 hover:text-primary-600 font-medium">
          회원가입
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="w-full max-w-md flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-cyan-600 items-center justify-center p-12">
        <div className="max-w-lg text-white text-center">
          <div className="text-6xl mb-6">🎥</div>
          <h2 className="text-3xl font-bold mb-4">
            고객에게 직접 인사하세요
          </h2>
          <p className="text-lg opacity-90">
            린다애스크와 함께라면 웹사이트 방문자에게
            따뜻한 영상으로 인사하고, AI가 24시간 응대해드려요.
          </p>
        </div>
      </div>
    </div>
  )
}
