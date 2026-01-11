'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Video,
  Users,
  MessageSquare,
  Settings,
  BookOpen,
  BarChart3,
  Palette,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
  organization: {
    id: string
    name: string
    slug: string
    logo_url: string | null
    plan: string
  }
  role: 'owner' | 'admin' | 'member'
}

const navigationKeys = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'aiSetup', href: '/setup', icon: Sparkles, highlight: true },
  { key: 'videos', href: '/videos', icon: Video },
  { key: 'leads', href: '/leads', icon: MessageSquare },
  { key: 'designer', href: '/designer', icon: Palette },
  { key: 'knowledge', href: '/knowledge', icon: BookOpen },
  { key: 'analytics', href: '/analytics', icon: BarChart3 },
  { key: 'team', href: '/team', icon: Users },
  { key: 'settings', href: '/settings', icon: Settings },
]

export function Sidebar({ organization, role }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')

  return (
    <aside className="w-64 bg-background border-r flex flex-col">
      {/* Organization Selector */}
      <div className="p-4 border-b">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {organization.name.charAt(0)}
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-sm truncate">{organization.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{organization.plan} {tCommon('plan')}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationKeys.map((item) => {
          const isActive = pathname.endsWith(item.href) || pathname.includes(`${item.href}/`)
          const isHighlight = 'highlight' in item && item.highlight

          // Only show team management for owners and admins
          if (item.href === '/team' && role === 'member') {
            return null
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : isHighlight
                    ? 'bg-gradient-to-r from-primary-500/10 to-cyan-500/10 text-primary-600 hover:from-primary-500/20 hover:to-cyan-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={cn('w-5 h-5', isHighlight && !isActive && 'text-primary-500')} />
              {t(item.key)}
              {isHighlight && !isActive && (
                <span className="ml-auto text-[10px] bg-gradient-to-r from-primary-500 to-cyan-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  {tCommon('new')}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t">
        <Link
          href="/help"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname.endsWith('/help')
              ? 'bg-primary-50 text-primary-600'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <HelpCircle className="w-5 h-5" />
          {t('help')}
        </Link>
      </div>
    </aside>
  )
}
