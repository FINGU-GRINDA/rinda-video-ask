'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { User, Building2, Bell, Key, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsNav = [
  { key: 'account', href: '/settings/account', icon: User },
  { key: 'organization', href: '/settings/organization', icon: Building2 },
  { key: 'notifications', href: '/settings/notifications', icon: Bell },
  { key: 'api', href: '/settings/api', icon: Key },
  { key: 'embed', href: '/settings/embed', icon: Code },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations('settings.tabs')

  return (
    <div className="p-6 lg:p-8 page-transition">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{useTranslations('settings')('title')}</h1>
          <p className="text-muted-foreground mt-1">{useTranslations('settings')('subtitle')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-56 shrink-0">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {settingsNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname.endsWith(item.href)
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {t(item.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
