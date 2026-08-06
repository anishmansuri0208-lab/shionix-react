import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
export const useAuthStore = create(persist((set, get) => ({
  user: null, profile: null, isAdmin: false, loading: true,
  setSession: async (session) => {
    if (!session?.user) { set({ user:null, profile:null, isAdmin:false, loading:false }); return }
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    set({ user: session.user, profile, isAdmin: profile?.role === 'admin', loading: false })
  },
  initialize: async () => {
    set({ loading: true })
    const { data: { session } } = await supabase.auth.getSession()
    await get().setSession(session)
    supabase.auth.onAuthStateChange(async (_, session) => { await get().setSession(session) })
  },
  updateProfile: (u) => set(s => ({ profile: { ...s.profile, ...u } })),
  logout: async () => { await supabase.auth.signOut(); set({ user:null, profile:null, isAdmin:false }) },
}), { name:'shionix-auth', partialize: s => ({ user:s.user, profile:s.profile, isAdmin:s.isAdmin }) }))
