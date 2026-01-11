'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Camera, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AccountSettingsPage() {
  const t = useTranslations('settings.account')
  const tCommon = useTranslations('common')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock user data
  const [profile, setProfile] = useState({
    name: '김린다',
    email: 'linda@rindaask.com',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success(t('saved'))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPasswords({ current: '', new: '', confirm: '' })
    setIsSaving(false)
    toast.success(t('saved'))
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">{t('profile')}</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('avatar')}</h3>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG, or GIF. Max 2MB.</p>
              <button className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
                {t('changeAvatar')}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('name')}</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('email')}</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {isSaving ? '...' : tCommon('save')}
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">{t('password')}</h2>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('currentPassword')}</label>
            <div className="relative max-w-md">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('newPassword')}</label>
            <div className="relative max-w-md">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('confirmPassword')}</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {t('changePassword')}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-xl">
        <div className="px-6 py-4 border-b border-destructive/20">
          <h2 className="font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t('dangerZone')}
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">{t('deleteAccount')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('deleteAccountDesc')}</p>
            </div>
            <button className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-white font-medium rounded-lg text-sm transition-colors">
              {t('deleteAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
