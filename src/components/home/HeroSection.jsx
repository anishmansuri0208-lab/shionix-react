import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Star, Shield, Truck } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',backgroundSize:'60px 60px',opacity:0.3}}/>
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,102,255,0.10) 0%, transparent 65%)'}}/>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--bg3)] border border-[var(--border)] rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"/>
              <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">New Arrivals 2026</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-6">
              Welcome to <span className="text-brand-500">Shionix</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text2)] leading-relaxed mb-8 max-w-lg">
              Discover <span className="text-[var(--text)] font-semibold">Premium Products</span> at Affordable Prices. Smart technology, exceptional quality — delivered across India.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-base rounded-2xl transition-all">
                <ShoppingBag size={20}/> Shop Now
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--border)] hover:border-brand-500 hover:text-brand-500 font-bold text-base rounded-2xl transition-all">
                Browse Categories <ArrowRight size={18}/>
              </Link>
            </div>
            <div className="flex gap-8 pt-8 border-t border-[var(--border)]">
              {[['12K+','Happy Customers'],['500+','Products'],['4.9★','Avg Rating']].map(([v,l])=>(
                <div key={l}><div className="font-display font-black text-2xl text-[var(--text)]">{v}</div><div className="text-xs text-[var(--text3)] mt-0.5">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block h-[520px]">
            <div className="absolute right-8 top-10 w-56 card p-5 shadow-2xl border border-[var(--border)] animate-[float_6s_ease-in-out_infinite]">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-500/10 to-blue-900/20 rounded-xl flex items-center justify-center text-5xl mb-4">🎧</div>
              <p className="font-semibold text-sm mb-1">Pro ANC Headphones</p>
              <p className="font-display font-black text-brand-500 text-lg">₹4,999</p>
              <div className="flex items-center gap-1 mt-2">{Array(5).fill(0).map((_,i)=><Star key={i} size={10} className="fill-yellow-400 text-yellow-400"/>)}<span className="text-xs text-[var(--text3)]">(1.2k)</span></div>
            </div>
            <div className="absolute left-4 top-40 w-48 card p-4 shadow-xl border border-[var(--border)] animate-[float_7s_ease-in-out_infinite_1s]">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500/10 to-purple-900/20 rounded-xl flex items-center justify-center text-4xl mb-3">⌚</div>
              <p className="font-semibold text-xs mb-1">SmartWatch X Pro</p>
              <p className="font-display font-black text-sm">₹2,499</p>
            </div>
            <div className="absolute bottom-20 right-4 card px-4 py-2.5 shadow-lg flex items-center gap-2">
              <Shield size={14} className="text-brand-500"/><span className="text-xs font-semibold">1 Year Warranty</span>
            </div>
            <div className="absolute bottom-4 left-20 card px-4 py-2.5 shadow-lg flex items-center gap-2">
              <Truck size={14} className="text-brand-500"/><span className="text-xs font-semibold">Free Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
