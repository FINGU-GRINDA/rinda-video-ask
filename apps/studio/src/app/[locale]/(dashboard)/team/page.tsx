'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Users,
  UserPlus,
  Mail,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  User,
  Clock,
  X,
  Check,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

type Role = 'owner' | 'admin' | 'member'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  status: 'active' | 'pending'
  joinedAt: string
}

// Mock data
const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: '김린다',
    email: 'linda@rindaask.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: '이영희',
    email: 'younghee@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: '박철수',
    email: 'cheolsu@company.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-03-10',
  },
]

const mockPendingInvites: TeamMember[] = [
  {
    id: '4',
    name: '',
    email: 'newmember@company.com',
    role: 'member',
    status: 'pending',
    joinedAt: '2024-03-15',
  },
]

function RoleBadge({ role }: { role: Role }) {
  const t = useTranslations('team.roles')

  const config = {
    owner: { icon: ShieldCheck, color: 'bg-purple-50 text-purple-600', label: t('owner') },
    admin: { icon: Shield, color: 'bg-blue-50 text-blue-600', label: t('admin') },
    member: { icon: User, color: 'bg-gray-50 text-gray-600', label: t('member') },
  }

  const { icon: Icon, color, label } = config[role]

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', color)}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

function InviteModal({
  isOpen,
  onClose,
  onInvite,
}: {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: Role) => void
}) {
  const t = useTranslations('team.inviteModal')
  const tRoles = useTranslations('team.roles')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('member')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onInvite(email, role)
    setEmail('')
    setRole('member')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t('title')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('role')}</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-4 py-2.5 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-card"
              >
                <option value="admin">{tRoles('admin')}</option>
                <option value="member">{tRoles('member')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? '...' : t('send')}
          </button>
        </form>
      </div>
    </div>
  )
}

function MemberActions({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
}: {
  member: TeamMember
  currentUserRole: Role
  onChangeRole: (memberId: string, newRole: Role) => void
  onRemove: (memberId: string) => void
}) {
  const t = useTranslations('team.actions')
  const tRoles = useTranslations('team.roles')
  const [isOpen, setIsOpen] = useState(false)

  if (member.role === 'owner') return null

  const canManage = currentUserRole === 'owner' || (currentUserRole === 'admin' && member.role === 'member')

  if (!canManage) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 z-50 animate-fade-in">
            {currentUserRole === 'owner' && (
              <>
                <button
                  onClick={() => {
                    onChangeRole(member.id, member.role === 'admin' ? 'member' : 'admin')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
                >
                  {t('changeRole')} ({member.role === 'admin' ? tRoles('member') : tRoles('admin')})
                </button>
                <hr className="my-1" />
              </>
            )}
            <button
              onClick={() => {
                onRemove(member.id)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
            >
              {t('remove')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function TeamPage() {
  const t = useTranslations('team')
  const [members, setMembers] = useState<TeamMember[]>(mockMembers)
  const [pendingInvites, setPendingInvites] = useState<TeamMember[]>(mockPendingInvites)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // Assume current user is owner for demo
  const currentUserRole: Role = 'owner'

  const handleInvite = (email: string, role: Role) => {
    setPendingInvites([
      ...pendingInvites,
      {
        id: Date.now().toString(),
        name: '',
        email,
        role,
        status: 'pending',
        joinedAt: new Date().toISOString().split('T')[0],
      },
    ])
  }

  const handleChangeRole = (memberId: string, newRole: Role) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)))
  }

  const handleRemove = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId))
  }

  const handleCancelInvite = (inviteId: string) => {
    setPendingInvites(pendingInvites.filter((i) => i.id !== inviteId))
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            {t('invite')}
          </button>
        )}
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-card border rounded-xl">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning-500" />
              {t('pendingInvites')}
              <span className="text-sm font-normal text-muted-foreground">({pendingInvites.length})</span>
            </h3>
          </div>
          <div className="divide-y">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('joined')}: {formatDate(invite.joinedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RoleBadge role={invite.role} />
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title={t('actions.cancelInvite')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-card border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            {t('members')}
            <span className="text-sm font-normal text-muted-foreground">({members.length})</span>
          </h3>
        </div>

        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('empty.title')}
            description={t('empty.description')}
            action={{
              label: t('invite'),
              onClick: () => setIsInviteModalOpen(true),
            }}
          />
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-sm text-muted-foreground">
                    {t('joined')}: {formatDate(member.joinedAt)}
                  </div>
                  <RoleBadge role={member.role} />
                  <MemberActions
                    member={member}
                    currentUserRole={currentUserRole}
                    onChangeRole={handleChangeRole}
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  )
}
