import { useForm } from 'react-hook-form'
import { Send, Bell, Mail, Megaphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AdminNotifications() {
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const onSend = async (data) => {
    setSending(true)
    try { await supabase.from('notifications').insert([{...data, sent_count:1248}]); toast.success('Notification sent!'); reset() }
    catch { toast.error('Failed to send.') } finally { setSending(false) }
  }
  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="space-y-4">
        {[{icon:Mail,label:'Email Blast',desc:'Send email to all customers',color:'text-blue-500 bg-blue-50 dark:bg-blue-900/20'},{icon:Bell,label:'Push Notification',desc:'In-app notification',color:'text-purple-500 bg-purple-50 dark:bg-purple-900/20'},{icon:Megaphone,label:'Announcement',desc:'Show on homepage banner',color:'text-orange-500 bg-orange-50 dark:bg-orange-900/20'}].map(item=>(
          <div key={item.label} className="card p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${item.color}`}><item.icon size={18}/></div>
            <div><p className="font-semibold text-sm">{item.label}</p><p className="text-xs text-[var(--text3)]">{item.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="card p-6 lg:col-span-2">
        <h3 className="font-display font-semibold mb-5">Compose Notification</h3>
        <form onSubmit={handleSubmit(onSend)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Type</label><select className="input" {...register('type',{required:true})}><option value="email">Email</option><option value="push">Push Notification</option><option value="announcement">Announcement Banner</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Send To</label><select className="input" {...register('target')}><option value="all">All Customers (1,248)</option><option value="active">Active Customers</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Title *</label><input className="input" placeholder="e.g. 50% Off Sale Starts Now!" {...register('title',{required:true})}/></div>
          <div><label className="block text-sm font-medium mb-1">Message *</label><textarea className="input resize-none" rows={4} placeholder="Write your notification…" {...register('message',{required:true})}/></div>
          <div><label className="block text-sm font-medium mb-1">CTA Link (optional)</label><input className="input" placeholder="https://shionix.vercel.app/shop" {...register('link')}/></div>
          <button type="submit" disabled={sending} className="btn-primary btn w-full justify-center py-3">
            {sending?<><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"/> Sending…</>:<><Send size={16}/> Send Notification</>}
          </button>
        </form>
      </div>
    </div>
  )
}
