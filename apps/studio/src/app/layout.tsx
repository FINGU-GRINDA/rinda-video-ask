import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '린다애스크 | Rinda Ask',
  description: 'AI 대화형 비디오 위젯으로 고객 경험을 혁신합니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
