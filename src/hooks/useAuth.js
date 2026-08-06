import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuthStore()

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      return true
    } catch (err) { toast.error(err.message); return false }
    finally { setLoading(false) }
  }

  const signUp = async (email, password, meta={}) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } })
      if (error) throw error
      if (data.user) await supabase.from('profiles').upsert({ id:data.user.id, email, full_name:meta.full_name||'', phone:meta.phone||'' })
      toast.success('Account created! Please check your email.')
      return true
    } catch (err) { toast.error(err.message); return false }
    finally { setLoading(false) }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:`${window.location.origin}/` } })
    if (error) toast.error(error.message)
  }

  const forgotPassword = async (email) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo:`${window.location.origin}/` })
      if (error) throw error
      toast.success('Reset link sent! Check your email.')
      return true
    } catch (err) { toast.error(err.message); return false }
    finally { setLoading(false) }
  }

  return { signIn, signUp, signInWithGoogle, forgotPassword, signOut: logout, loading }
}
