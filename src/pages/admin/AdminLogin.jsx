import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
export default function AdminLogin() {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setSession } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState:{ errors } } = useForm()
  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'admin') { await supabase.auth.signOut(); toast.error('Access denied. Admin accounts only.'); return }
      await setSession(data.session)
      toast.success('Welcome, Admin!')
      navigate('/admin')
    } catch (err) { toast.error(err.message||'Login failed') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,102,255,0.15) 0%, transparent 70%)'}}/>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-500 items-center justify-center mb-4 shadow-lg"><Shield size={26} className="text-white"/></div>
          <h1 className="text-2xl font-display font-black text-white">SHIONIX</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to Dashboard</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <input type="email" placeholder="admin@shionix.in" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all" {...register('email',{required:'Email required'})}/>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11 text-sm transition-all" {...register('password',{required:'Password required'})}/>
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading?<><Loader2 size={16} className="animate-spin"/> Signing in…</>:'Sign In'}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-5">🔒 Restricted to authorized administrators only.</p>
        </div>
      </div>
    </div>
  )
}
