import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import { locales, type Locale } from '@/i18n/config'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<Locale, string> = {
    ko: '린다애스크 | 웹사이트 방문자와 영상으로 대화하세요',
    en: 'Rinda Ask | Connect with Website Visitors via Video',
  }

  const descriptions: Record<Locale, string> = {
    ko: '대표님의 환영 영상으로 방문자를 맞이하고, AI가 24시간 자동 응대합니다. 리드 전환율 3배 상승, 지금 무료로 시작하세요.',
    en: 'Greet visitors with your welcome video and let AI handle responses 24/7. 3x higher lead conversion. Start free today.',
  }

  return {
    title: titles[locale as Locale] || titles.ko,
    description: descriptions[locale as Locale] || descriptions.ko,
    keywords: ['비디오 마케팅', 'AI 챗봇', '리드 생성', 'B2B', '영상 위젯', 'video marketing', 'AI chatbot', 'lead generation'],
    openGraph: {
      title: titles[locale as Locale] || titles.ko,
      description: descriptions[locale as Locale] || descriptions.ko,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
