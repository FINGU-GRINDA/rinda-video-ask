'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Building2, Camera, CreditCard, ChevronDown, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const timezones = [
  { value: 'Asia/Seoul', label: '(GMT+09:00) Seoul' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'America/New_York', label: '(GMT-05:00) New York' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Los Angeles' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
]

const languages = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
]

export default function OrganizationSettingsPage() {
  const t = useTranslations('settings.organization')
  const tCommon = useTranslations('common')
  const [isSaving, setIsSaving] = useState(false)

  const [org, setOrg] = useState({
    name: '린다애스크 팀',
    timezone: 'Asia/Seoul',
    language: 'ko',
    plan: 'Pro',
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-8">
      {/* Organization Info */}
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">{t('title')}</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                {org.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('logo')}</h3>
              <p className="text-sm text-muted-foreground mt-1">PNG or SVG. Max 1MB.</p>
              <button className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
                {t('changeLogo')}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('name')}</label>
            <input
              type="text"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
              className="w-full max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('timezone')}</label>
            <div className="relative max-w-md">
              <select
                value={org.timezone}
                onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-card"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('language')}</label>
            <div className="relative max-w-md">
              <select
                value={org.language}
                onChange={(e) => setOrg({ ...org, language: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-card"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {isSaving ? '...' : tCommon('save')}
          </button>
        </div>
      </div>

      {/* Billing Section */}
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">{t('billing')}</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-violet-50 rounded-xl border border-primary-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{t('plan')}</span>
                  <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                    {org.plan}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlimited videos, AI responses, and team members
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium rounded-lg text-sm transition-colors">
              {t('upgrade')}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
              <CreditCard className="w-4 h-4" />
              Manage Payment Method
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
