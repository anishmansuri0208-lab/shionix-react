import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return }
    setLoading(true)
    try {
      await supabase.from('newsletter_subscribers').insert([{email}])
      toast.success('Subscribed! Welcome to Shionix 🎉'); setEmail('')
    } catch { toast.error('Failed to subscribe.') } finally { setLoading(false) }
  }
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-16 text-center">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Get Exclusive Deals</h2>
      <p className="text-white/80 mb-8 max-w-md mx-auto">Subscribe for flash sales, new products & special discounts.</p>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email"
          className="flex-1 px-5 py-3.5 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"/>
        <button type="submit" disabled={loading} className="px-6 py-3.5 rounded-xl bg-white text-brand-600 font-bold hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-70 whitespace-nowrap">
          <Send size={16}/> Subscribe
        </button>
      </form>
    </div>
  )
}
