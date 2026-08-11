import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '918469015674'
const INSTAGRAM_URL   = 'https://instagram.com/shionix'

const QUICK_LINKS = [
  { to:'/', label:'Home' }, { to:'/shop', label:'Shop' },
  { to:'/categories', label:'Categories' }, { to:'/about', label:'About Us' },
  { to:'/contact', label:'Contact' },
]
const CUSTOMER_CARE = [
  { to:'/orders', label:'Track Order' }, { to:'/profile', label:'My Account' },
  { to:'/contact', label:'Support' }, { to:'/privacy-policy', label:'Privacy Policy' },
  { to:'/terms', label:'Terms & Conditions' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--bg2)] border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="inline-block mb-4"><span className="font-display font-black text-2xl">Shio<span className="text-brand-500">nix</span></span></Link>
            <p className="text-sm text-[var(--text3)] leading-relaxed mb-5">Smart Products, Smart Shopping. Premium tech at affordable prices in India.</p>
            <div className="flex gap-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text3)] hover:text-[#25D366] hover:border-[#25D366] transition-all">
                <MessageCircle size={16}/>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text3)] hover:text-brand-500 hover:border-brand-500 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text3)] hover:text-red-500 hover:border-red-500 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l=>(
                <li key={l.to}><Link to={l.to} className="text-sm text-[var(--text3)] hover:text-brand-500 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5">
              {CUSTOMER_CARE.map(l=>(
                <li key={l.to}><Link to={l.to} className="text-sm text-[var(--text3)] hover:text-brand-500 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><Mail size={15} className="text-brand-500 mt-0.5 flex-shrink-0"/><a href="mailto:support@shionix.in" className="text-sm text-[var(--text3)] hover:text-brand-500">support@shionix.in</a></li>
              <li className="flex items-start gap-3"><Phone size={15} className="text-brand-500 mt-0.5 flex-shrink-0"/><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text3)] hover:text-brand-500">+91 8469015674</a></li>
              <li className="flex items-start gap-3"><MapPin size={15} className="text-brand-500 mt-0.5 flex-shrink-0"/><span className="text-sm text-[var(--text3)]">Bangalore, Karnataka, India</span></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-[var(--border)] mb-8">
          {[['🚚','Free Delivery','On orders above ₹999'],['🛡️','1 Year Warranty','On all products'],['↩️','Easy Returns','30-day policy'],['🔒','Secure Payment','100% encrypted']].map(([icon,title,desc])=>(
            <div key={title} className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-[var(--text3)]">{desc}</p></div></div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text3)]">© 2026 Shionix. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="text-xs text-[var(--text3)] hover:text-brand-500">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-[var(--text3)] hover:text-brand-500">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
