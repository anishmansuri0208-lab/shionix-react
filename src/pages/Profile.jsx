import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Package, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { profileService } from '@/services/profileService'
import { useMyOrders } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
const TABS=[{key:'profile',icon:User,label:'Profile'},{key:'orders',icon:Package,label:'Orders'},{key:'security',icon:Shield,label:'Security'}]
export default function Profile() {
  const [tab, setTab] = useState('profile')
  const { user, profile, updateProfile, logout } = useAuthStore()
  const { data: orders=[] } = useMyOrders()
  const { register, handleSubmit, formState:{ errors } } = useForm({ defaultValues:{ full_name:profile?.full_name||'', phone:profile?.phone||'' } })
  const onSave = async (data) => {
    try { const u=await profileService.update(user.id,data); updateProfile(u); toast.success('Profile updated!') }
    catch { toast.error('Update failed.') }
  }
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="card p-5 text-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">{profile?.full_name?.[0]?.toUpperCase()||'U'}</div>
            <p className="font-bold text-sm">{profile?.full_name||'User'}</p>
            <p className="text-xs text-[var(--text3)] truncate">{user?.email}</p>
          </div>
          <div className="card overflow-hidden">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} className={`flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium transition-colors border-b border-[var(--border)] last:border-0 ${tab===t.key?'bg-brand-500/10 text-brand-500':'text-[var(--text2)] hover:bg-[var(--bg3)]'}`}>
                <t.icon size={16}/>{t.label}
              </button>
            ))}
            <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </div>
        <div className="md:col-span-3">
          {tab==='profile' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-5">Edit Profile</h2>
              <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" {...register('full_name',{required:'Required'})} error={errors.full_name?.message}/>
                  <Input label="Mobile Number" {...register('phone')}/>
                </div>
                <Input label="Email Address" defaultValue={user?.email} readOnly className="opacity-60"/>
                <button type="submit" className="btn-primary btn">Save Changes</button>
              </form>
            </div>
          )}
          {tab==='orders' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-5">My Orders ({orders.length})</h2>
              {orders.length===0 ? <p className="text-[var(--text3)] text-sm">No orders yet. <Link to="/shop" className="text-brand-500">Start shopping!</Link></p> : (
                <div className="space-y-3">
                  {orders.slice(0,10).map(o=>(
                    <div key={o.id} className="flex items-center justify-between p-4 bg-[var(--bg3)] rounded-xl">
                      <div><span className="font-mono text-xs text-brand-500 font-bold">#{o.id}</span><span className="text-xs text-[var(--text3)] ml-2">{formatDate(o.created_at)}</span><p className="font-bold text-sm mt-0.5">{formatPrice(o.total_amount)}</p></div>
                      <StatusBadge status={o.status}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab==='security' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-5">Security Settings</h2>
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 mb-5">
                <Shield size={16} className="text-green-500"/><p className="text-sm text-green-700 dark:text-green-400 font-medium">Account protected with Supabase Auth</p>
              </div>
              <div className="space-y-4">
                <Input label="New Password" type="password" placeholder="Min 8 characters"/>
                <Input label="Confirm Password" type="password" placeholder="Re-enter password"/>
                <button className="btn-primary btn">Update Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
