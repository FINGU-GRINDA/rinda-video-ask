import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export * from './types'

export function createSupabaseClient(url: string, anonKey: string) {
  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export function createSupabaseServerClient(url: string, serviceKey: string) {
  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>
