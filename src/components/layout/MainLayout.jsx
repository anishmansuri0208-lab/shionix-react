import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { MessageCircle, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function MainLayout() {
  const { pathname } = useLocation()
  const [showTop, setShowTop] = useState(false)
  const [settings, setSettings] = useState({ whatsapp: '919876543210' })

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    supabase.from('settings').select('key,value').in('key', ['whatsapp','phone','email'])
      .then(({ data }) => {
        if (data) {
          const s = {}
          data.forEach(r => { s[r.key] = r.value })
          setSettings(s)
        }
      })
  }, [])

  const whatsapp = settings.whatsapp || '919876543210'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1 pt-16"><Outlet/></main>
      <Footer settings={settings}/>
      <a href={`https://wa.me/${whatsapp}?text=Hi%20Shionix!%20I%20need%20help.`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full p-3 flex items-center justify-center shadow-lg hover:-translate-y-0.5 transition-all"
        aria-label="WhatsApp">
        <MessageCircle size={24}/>
      </a>
      {showTop && (
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors">
          <ChevronUp size={20}/>
        </button>
      )}
    </div>
  )
}
