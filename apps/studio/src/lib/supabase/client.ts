// Mock Supabase client for demo purposes
// Replace with actual Supabase client when ready for production

type MockUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    company?: string
  }
}

type MockSession = {
  user: MockUser
  access_token: string
}

// Storage keys
const SESSION_KEY = 'rinda_mock_session'
const ORG_KEY = 'rinda_mock_organization'

// Helper functions to persist session in localStorage
function getStoredSession(): MockSession | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredSession(session: MockSession | null) {
  if (typeof window === 'undefined') return
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

// Helper functions for organization storage
function getStoredOrganization(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(ORG_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredOrganization(org: Record<string, unknown> | null) {
  if (typeof window === 'undefined') return
  try {
    if (org) {
      localStorage.setItem(ORG_KEY, JSON.stringify(org))
    } else {
      localStorage.removeItem(ORG_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

type AuthError = { message: string } | null

export function createClient() {
  return {
    auth: {
      signUp: async ({ email, password, options }: {
        email: string
        password: string
        options?: { data?: { full_name?: string; company?: string } }
      }): Promise<{ error: AuthError; data: { user: MockUser } | null }> => {
        // Simulate signup - create session and redirect to onboarding
        console.log('Mock signup:', email, options?.data)
        const newSession: MockSession = {
          user: {
            id: 'mock-user-' + Date.now(),
            email,
            user_metadata: {
              full_name: options?.data?.full_name || '',
              company: options?.data?.company || ''
            }
          },
          access_token: 'mock-token-' + Date.now()
        }
        setStoredSession(newSession)
        return { error: null, data: { user: newSession.user } }
      },

      signInWithPassword: async ({ email, password }: { email: string; password: string }): Promise<{ error: AuthError; data: { session: MockSession } | null }> => {
        // Simulate login - always succeeds in demo mode
        console.log('Mock login:', email)
        const newSession: MockSession = {
          user: {
            id: 'mock-user-' + Date.now(),
            email,
            user_metadata: { full_name: '데모 사용자', company: '린다애스크' }
          },
          access_token: 'mock-token-' + Date.now()
        }
        setStoredSession(newSession)
        return { error: null, data: { session: newSession } }
      },

      signInWithOAuth: async ({ provider, options }: {
        provider: 'kakao' | 'google'
        options?: { redirectTo?: string }
      }): Promise<{ error: AuthError }> => {
        // Simulate OAuth - create session and redirect
        console.log('Mock OAuth:', provider)
        const newSession: MockSession = {
          user: {
            id: 'mock-oauth-user-' + Date.now(),
            email: `demo@${provider}.com`,
            user_metadata: { full_name: '데모 사용자', company: '린다애스크' }
          },
          access_token: 'mock-oauth-token-' + Date.now()
        }
        setStoredSession(newSession)

        // In demo mode, redirect directly
        if (typeof window !== 'undefined') {
          const redirectPath = options?.redirectTo?.includes('onboarding') ? '/onboarding' : '/dashboard'
          window.location.href = redirectPath
        }
        return { error: null }
      },

      signOut: async () => {
        setStoredSession(null)
        return { error: null }
      },

      getSession: async () => {
        const session = getStoredSession()
        return { data: { session }, error: null }
      },

      getUser: async () => {
        const session = getStoredSession()
        return { data: { user: session?.user || null }, error: null }
      },

      onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
        // Return unsubscribe function
        return {
          data: { subscription: { unsubscribe: () => {} } }
        }
      }
    },

    from: (table: string) => {
      // Helper to get data based on table
      const getMockData = () => {
        const org = getStoredOrganization()
        if (table === 'organization_members' && org) {
          return {
            organization_id: org.id,
            user_id: 'mock-user',
            role: 'owner',
            organizations: org
          }
        }
        if (table === 'projects' && org) {
          return { id: 'mock-project-1' }
        }
        return null
      }

      // Create chainable query builder
      const createChainable = (data: unknown) => ({
        eq: (_col: string, _val: string) => createChainable(data),
        in: (_col: string, _vals: string[]) => createChainable(data),
        order: (_col: string, _opts?: { ascending?: boolean }) => createChainable(data),
        limit: (_count: number) => Promise.resolve({ data: data ? [data] : [], error: null }),
        single: async () => ({ data, error: null })
      })

      return {
        select: (columns?: string) => createChainable(getMockData()),
        insert: (data: Record<string, unknown>) => {
          const insertResult = async () => {
            const id = 'mock-' + table + '-' + Date.now()
            const result = { id, ...data }

            // Store organization when created
            if (table === 'organizations') {
              setStoredOrganization({
                id,
                name: data.name,
                slug: data.slug,
                logo_url: data.logo_url || null,
                plan: 'free'
              })
            }

            return { data: result, error: null }
          }

          return {
            select: (_cols?: string) => ({
              single: insertResult
            }),
            then: async (resolve: (val: { data: null; error: null }) => void) => resolve({ data: null, error: null })
          }
        },
        update: (data: Record<string, unknown>) => ({
          eq: (_col: string, _val: string) => Promise.resolve({ data: null, error: null })
        }),
        delete: () => ({
          eq: (_col: string, _val: string) => Promise.resolve({ data: null, error: null })
        })
      }
    },

    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: Blob | File, options?: Record<string, unknown>) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/mock-storage/${path}` } }),
        remove: async (paths: string[]) => ({ data: null, error: null })
      })
    }
  }
}

// Type for compatibility
export type Database = Record<string, unknown>
