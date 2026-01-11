'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bell, Mail, MessageSquare, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface NotificationSetting {
  id: string
  icon: React.ReactNode
  titleKey: string
  descKey: string
  enabled: boolean
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors',
        enabled ? 'bg-primary-500' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}

export default function NotificationsSettingsPage() {
  const t = useTranslations('settings.notifications')
  const tCommon = useTranslations('common')

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      icon: <Mail className="w-5 h-5" />,
      titleKey: 'email',
      descKey: 'emailDesc',
      enabled: true,
    },
    {
      id: 'newLead',
      icon: <MessageSquare className="w-5 h-5" />,
      titleKey: 'newLead',
      descKey: 'newLeadDesc',
      enabled: true,
    },
    {
      id: 'dailyDigest',
      icon: <Bell className="w-5 h-5" />,
      titleKey: 'dailyDigest',
      descKey: 'dailyDigestDesc',
      enabled: false,
    },
    {
      id: 'weeklyReport',
      icon: <BarChart3 className="w-5 h-5" />,
      titleKey: 'weeklyReport',
      descKey: 'weeklyReportDesc',
      enabled: true,
    },
  ])

  const handleToggle = (id: string) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const handleSave = () => {
    toast.success('Notification settings saved')
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">{t('title')}</h2>
        </div>
        <div className="divide-y">
          {settings.map((setting) => (
            <div key={setting.id} className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  {setting.icon}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{t(setting.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{t(setting.descKey)}</p>
                </div>
              </div>
              <Toggle enabled={setting.enabled} onToggle={() => handleToggle(setting.id)} />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t bg-muted/30">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {tCommon('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
