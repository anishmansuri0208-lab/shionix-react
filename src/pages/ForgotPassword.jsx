import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { KeyRound } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth()
  const { register, handleSubmit, formState:{ errors } } = useForm()
  const onSubmit = async ({ email }) => { await forgotPassword(email) }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4"><KeyRound size={28} className="text-brand-500"/></div>
          <h1 className="font-display font-bold text-2xl">Forgot password?</h1>
          <p className="text-[var(--text3)] text-sm mt-2">Enter your email and we'll send you a reset link.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email',{required:'Email is required',pattern:{value:/\S+@\S+\.\S+/,message:'Invalid email'}})}/>
            <button type="submit" disabled={loading} className="btn-primary btn w-full justify-center py-3.5">{loading?'Sending…':'Send Reset Link'}</button>
          </form>
          <p className="text-center text-sm text-[var(--text2)] mt-5"><Link to="/login" className="text-brand-500 hover:text-brand-600">← Back to Login</Link></p>
        </div>
      </div>
    </div>
  )
}
