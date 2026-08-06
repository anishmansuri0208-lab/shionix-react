import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
export default function Contact() {
  const { register, handleSubmit, reset, formState:{ errors, isSubmitting } } = useForm()
  const onSubmit = async (data) => {
    try { await supabase.from('contact_messages').insert([data]); toast.success('Message sent! We\'ll reply within 24 hours ✅'); reset() }
    catch { toast.error('Failed to send. Try WhatsApp instead.') }
  }
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12"><h1 className="font-display font-black text-4xl mb-3">Get In Touch</h1><p className="text-[var(--text2)]">We're here to help. Reach out anytime.</p></div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {[{icon:MessageCircle,label:'WhatsApp',value:'+91 98765 43210',href:'https://wa.me/919876543210'},{icon:Mail,label:'Email',value:'support@shionix.in',href:'mailto:support@shionix.in'},{icon:Phone,label:'Phone',value:'+91 98765 43210',href:'tel:+919876543210'},{icon:MapPin,label:'Address',value:'Bangalore, Karnataka, India',href:null}].map(c=>(
            <div key={c.label} className="flex gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0"><c.icon size={18} className="text-brand-500"/></div>
              <div><p className="text-xs text-[var(--text3)] font-semibold uppercase tracking-wide mb-0.5">{c.label}</p>
                {c.href?<a href={c.href} className="font-medium text-sm hover:text-brand-500 transition-colors">{c.value}</a>:<p className="font-medium text-sm">{c.value}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="card p-8">
          <h2 className="font-display font-semibold text-lg mb-5">Send a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name *" placeholder="Rahul Kumar" error={errors.name?.message} {...register('name',{required:'Required'})}/>
            <Input label="Email *" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email',{required:'Required'})}/>
            <Input label="Subject" placeholder="How can we help?" {...register('subject')}/>
            <div><label className="block text-sm font-medium text-[var(--text2)] mb-1.5">Message *</label>
              <textarea className="input resize-none" rows={4} placeholder="Tell us more…" {...register('message',{required:'Required'})}/>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary btn w-full justify-center py-3.5">{isSubmitting?'Sending…':'📨 Send Message'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
