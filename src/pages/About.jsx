import { Shield, Star, Truck, Headphones, Package } from 'lucide-react'
export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display font-black text-5xl mb-5">Built for Smart Shoppers</h1>
        <p className="text-lg text-[var(--text2)] max-w-2xl mx-auto leading-relaxed">Shionix was founded in 2022 with a vision to bring premium smart products to every Indian home — without the premium price tag.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {[
          {icon:Shield,title:'Premium Quality',desc:'Every product is tested & curated to meet the highest standards before reaching your hands.'},
          {icon:Star,title:'Affordable Prices',desc:'We work directly with manufacturers to bring you the best deals without middlemen.'},
          {icon:Headphones,title:'24/7 Support',desc:'Our dedicated support team is always ready to help you with any queries or concerns.'},
          {icon:Truck,title:'Fast Delivery',desc:'Same-day dispatch on orders before 2 PM, delivered pan-India within 2–5 days.'},
          {icon:Shield,title:'Secure Shopping',desc:'Your data and payments are protected with enterprise-grade encryption at all times.'},
          {icon:Package,title:'Easy Returns',desc:'Not satisfied? Return within 30 days for a full refund — no questions asked.'},
        ].map(v=>(
          <div key={v.title} className="card p-6 hover:border-brand-500 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-4"><v.icon size={22}/></div>
            <h3 className="font-bold mb-2">{v.title}</h3>
            <p className="text-sm text-[var(--text2)] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 card">
        {[['12K+','Happy Customers'],['500+','Products Listed'],['4.9★','Average Rating'],['99%','Satisfaction Rate']].map(([v,l])=>(
          <div key={l} className="text-center"><div className="font-display font-black text-3xl text-brand-500 mb-1">{v}</div><div className="text-sm text-[var(--text3)]">{l}</div></div>
        ))}
      </div>
    </div>
  )
}
