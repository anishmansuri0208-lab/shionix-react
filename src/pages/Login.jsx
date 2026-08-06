import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const { signIn, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const { register, handleSubmit, formState:{ errors } } = useForm()

  const onSubmit = async (data) => {
    const ok = await signIn(data.email, data.password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--bg)]">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,102,255,0.08) 0%, transparent 70%)'}}/>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4"><span className="font-display font-black text-2xl">Shio<span className="text-brand-500">nix</span></span></Link>
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-[var(--text3)] text-sm mt-1">Sign in to your Shionix account</p>
        </div>
        <div className="card p-8 shadow-2xl">
          <button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-3 py-3 border border-[var(--border)] rounded-xl hover:bg-[var(--bg3)] transition-colors text-sm font-medium mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-[var(--border)]"/><span className="text-xs text-[var(--text3)]">or sign in with email</span><div className="flex-1 h-px bg-[var(--border)]"/></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email',{required:'Email is required'})}/>
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} placeholder="••••••••" className={`input pr-11 ${errors.password?'border-red-500':''}`} {...register('password',{required:'Password required',minLength:{value:6,message:'Min 6 characters'}})}/>
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text2)]"><input type="checkbox" className="accent-brand-500"/> Remember me</label>
              <Link to="/forgot-password" className="text-brand-500 font-medium hover:text-brand-600">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn w-full justify-center py-3.5 text-base mt-2 disabled:opacity-60">
              {loading?<span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>Signing in…</span>:'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-[var(--text2)] mt-5">Don't have an account? <Link to="/signup" className="text-brand-500 font-semibold hover:text-brand-600">Create account</Link></p>
        </div>
        <div className="mt-5 p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)] flex items-center gap-2">
          <Shield size={14} className="text-brand-500 flex-shrink-0"/>
          <p className="text-xs text-[var(--text3)]">Your data is protected with 256-bit SSL encryption.</p>
        </div>
      </div>
    </div>
  )
}
