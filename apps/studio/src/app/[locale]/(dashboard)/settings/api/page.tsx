'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Key, Plus, Copy, Check, Trash2, X, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
}

// Mock data
const mockKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Server',
    key: 'rinda_live_sk_xxxxxxxxxxxxxxxxxxxx',
    created: '2024-02-15',
    lastUsed: '2024-03-14',
  },
  {
    id: '2',
    name: 'Development',
    key: 'rinda_test_sk_xxxxxxxxxxxxxxxxxxxx',
    created: '2024-03-01',
    lastUsed: null,
  },
]

function CreateKeyModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const t = useTranslations('settings.api.newKeyModal')
  const tCommon = useTranslations('common')
  const [name, setName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCreate = () => {
    const newKey = `rinda_live_sk_${Math.random().toString(36).substring(2, 22)}`
    setCreatedKey(newKey)
    onCreate(name)
  }

  const handleCopy = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setName('')
    setCreatedKey(null)
    setCopied(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t('title')}</h2>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!createdKey ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!name}
              className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg text-sm transition-colors"
            >
              {t('create')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
                <p className="text-sm text-warning-800">{t('warning')}</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={createdKey}
                readOnly
                className="w-full px-4 py-3 pr-12 bg-muted border rounded-lg text-sm font-mono"
              />
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success-600" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 border text-foreground font-medium rounded-lg text-sm hover:bg-muted transition-colors"
            >
              {tCommon('close')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApiSettingsPage() {
  const t = useTranslations('settings.api')
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const handleCreate = (name: string) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name,
      key: `rinda_live_sk_${Math.random().toString(36).substring(2, 22)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
    }
    setKeys([...keys, newKey])
    toast.success('API key created')
  }

  const handleRevoke = (id: string) => {
    if (window.confirm(t('confirmRevoke'))) {
      setKeys(keys.filter((k) => k.id !== id))
      toast.success('API key revoked')
    }
  }

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20)
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{t('title')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('createKey')}
          </button>
        </div>

        {keys.length === 0 ? (
          <EmptyState
            icon={Key}
            title={t('empty.title')}
            description={t('empty.description')}
            action={{
              label: t('createKey'),
              onClick: () => setIsModalOpen(true),
            }}
          />
        ) : (
          <div className="divide-y">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Key className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{apiKey.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono text-muted-foreground">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(apiKey.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title={t('revoke')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="ml-13 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {t('created')}: {formatDate(apiKey.created)}
                  </span>
                  <span>
                    {t('lastUsed')}: {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
