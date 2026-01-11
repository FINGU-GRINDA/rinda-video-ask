import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations (
        id,
        name,
        slug,
        logo_url,
        plan
      )
    `)
    .eq('user_id', user.id)
    .single()

  // Default organization for demo mode when membership is not found
  const defaultOrganization = {
    id: 'demo-org',
    name: '내 회사',
    slug: 'my-company',
    logo_url: null,
    plan: 'free'
  }

  const organization = membership?.organizations as unknown as {
    id: string
    name: string
    slug: string
    logo_url: string | null
    plan: string
  } || defaultOrganization

  const role = (membership?.role as 'owner' | 'admin' | 'member') || 'owner'

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        user={{
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatar: user.user_metadata?.avatar_url,
        }}
        organization={organization}
        role={role}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={{
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.email!,
            avatar: user.user_metadata?.avatar_url,
          }}
          organization={organization}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
