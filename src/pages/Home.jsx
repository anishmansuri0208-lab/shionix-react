import HeroSection from '@/components/home/HeroSection'
import MarqueeBanner from '@/components/home/MarqueeBanner'
import SectionHeader from '@/components/home/SectionHeader'
import ProductGrid from '@/components/home/ProductGrid'
import NewsletterSection from '@/components/home/NewsletterSection'
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Link } from 'react-router-dom'

export default function Home() {
  const { data: featured=[], isLoading: fl } = useFeaturedProducts()
  const { data: bestsellers=[], isLoading: bl } = useBestSellers()
  const { data: newArrivals=[], isLoading: nl } = useNewArrivals()
  const { data: categories=[] } = useCategories()

  return (
    <>
      <HeroSection/>
      <MarqueeBanner/>
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Offer Banners */}
        <section className="py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {title:'Up to 50% Off',sub:'On all smart gadgets',tag:'Limited Time',link:'/shop',bg:'from-brand-500 to-blue-600',icon:'⚡'},
              {title:'Premium Audio',sub:'New headphone collection',tag:'New Launch',link:'/shop?category=headphones',bg:'from-purple-600 to-pink-600',icon:'🎧'},
              {title:'Smart Wearables',sub:'Watches & fitness bands',tag:'Best Sellers',link:'/shop?category=smartwatch',bg:'from-orange-500 to-amber-500',icon:'⌚'},
            ].map(o=>(
              <Link key={o.title} to={o.link}
                className={`relative flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-br ${o.bg} h-44 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform`}>
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1 block">{o.tag}</span>
                  <h3 className="font-display font-bold text-2xl text-white leading-tight">{o.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{o.sub}</p>
                </div>
                <span className="inline-flex items-center text-white text-sm font-semibold bg-white/20 rounded-xl px-4 py-2 w-fit relative z-10">Shop Now →</span>
                <span className="absolute right-5 bottom-5 text-5xl opacity-20 select-none">{o.icon}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="pb-14">
          <SectionHeader eyebrow="Browse By" title="Shop Categories" linkTo="/categories"/>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(cat=>(
              <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center justify-center p-5 card hover:border-brand-500 hover:-translate-y-1 transition-all cursor-pointer text-center h-28">
                <div className="text-3xl mb-2">{cat.emoji||'📦'}</div>
                <p className="text-xs font-semibold text-[var(--text)] leading-tight">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="pb-16">
          <SectionHeader eyebrow="Handpicked For You" title="Featured Products" linkTo="/shop?featured=true"/>
          <ProductGrid products={featured} loading={fl}/>
        </section>

        {/* Best Sellers */}
        <section className="pb-16">
          <SectionHeader eyebrow="Top Rated" title="Best Sellers" linkTo="/shop?sort=rating"/>
          <ProductGrid products={bestsellers} loading={bl}/>
        </section>

        {/* New Arrivals */}
        <section className="pb-16">
          <SectionHeader eyebrow="Just Landed" title="New Arrivals" linkTo="/shop?sort=new"/>
          <ProductGrid products={newArrivals} loading={nl}/>
        </section>

        {/* Testimonials */}
        <section className="pb-16">
          <SectionHeader eyebrow="What They Say" title="Customer Reviews" subtitle="Trusted by 12,000+ happy shoppers across India"/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {name:'Rahul K.',loc:'Mumbai, MH',rating:5,text:'Shionix delivered in 2 days! The headphones are absolutely amazing — worth every rupee.'},
              {name:'Priya S.',loc:'Bengaluru, KA',rating:5,text:'SmartWatch X Pro is incredible. Battery lasts a week and health tracking is very accurate.'},
              {name:'Amit T.',loc:'Delhi, DL',rating:5,text:'Best online store for gadgets in India. Prices much better than other platforms.'},
              {name:'Divya M.',loc:'Hyderabad, TS',rating:4,text:'Got the AirPods Ultra Pro for my husband. He loves them! Packaging was premium.'},
              {name:'Karan P.',loc:'Pune, MH',rating:5,text:'COD option made me feel secure. Product arrived exactly as described.'},
              {name:'Neha R.',loc:'Jaipur, RJ',rating:5,text:'Shionix is my go-to shop. 3 orders, 3 perfect experiences.'},
            ].map(t=>(
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:5}).map((_,i)=>(
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" className={i<t.rating?'fill-yellow-400':'fill-gray-200 dark:fill-gray-700'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-sm text-[var(--text2)] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.name[0]}</div>
                  <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-[var(--text3)]">📍 {t.loc}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-20"><NewsletterSection/></section>
      </div>
    </>
  )
}
