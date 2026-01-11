'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Bell, Search, Plus, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LanguageSwitcher } from '@/components/language-switcher'
import toast from 'react-hot-toast'

interface HeaderProps {
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
}

export function Header({ user, organization }: HeaderProps) {
  const router = useRouter()
  const t = useTranslations('header')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('nav')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success(t('logout'))
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-background border-b px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tCommon('searchPlaceholder')}
            className="w-64 pl-10 pr-4 py-2 text-sm rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/videos/new"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('newVideo')}
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" title={t('notifications')}>
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-background border rounded-xl shadow-lg py-2 z-20 animate-fade-in">
                <div className="px-4 py-2 border-b">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t('profile')}
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {tNav('settings')}
                  </Link>
                </div>
                <div className="border-t py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
