import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, MessageCircle, Shield, Truck, RotateCcw, Minus, Plus, Share2 } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calcDiscount } from '@/utils/formatters'
import { WHATSAPP_NUMBER } from '@/utils/constants'
import Stars from '@/components/ui/Stars'
import ProductGrid from '@/components/home/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('desc')
  const { data: product, isLoading } = useProduct(id)
  const { add } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const wishlisted = has(Number(id))

  const { data: related=[] } = useQuery({
    queryKey: ['related', id, product?.category_id],
    queryFn: () => productService.getRelated(id, product.category_id),
    enabled: !!product?.category_id,
  })

  const handleAddToCart = () => { add(product, qty); toast.success(`${qty} × ${product.name.slice(0,20)}… added!`) }
  const handleBuyNow = () => { add(product, qty); window.location.href = '/checkout' }
  const handleWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Shionix!%20I%20want%3A%0A*${encodeURIComponent(product.name)}*%0APrice%3A%20${formatPrice(product.price)}%0AQty%3A%20${qty}`, '_blank')

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-2xl"/>
        <div className="space-y-4">{[80,120,60,40,100,200].map((w,i)=><Skeleton key={i} className="h-6 rounded-xl" style={{width:`${w}%`}}/>)}</div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <p className="text-[var(--text3)]">Product not found.</p>
      <Link to="/shop" className="btn-primary btn mt-4">Back to Shop</Link>
    </div>
  )

  const discount = calcDiscount(product.price, product.mrp)
  const images = product.images?.length ? product.images : null

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <nav className="text-sm text-[var(--text3)] mb-8 flex gap-2 flex-wrap">
        <Link to="/" className="hover:text-brand-500">Home</Link> ›
        <Link to="/shop" className="hover:text-brand-500">Shop</Link> ›
        <Link to={`/shop?category=${product.categories?.slug}`} className="hover:text-brand-500">{product.categories?.name}</Link> ›
        <span className="text-[var(--text)] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="aspect-square rounded-2xl bg-[var(--bg3)] border border-[var(--border)] overflow-hidden flex items-center justify-center mb-4">
            {images ? <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-8"/> : <span className="text-9xl">{product.emoji||'📦'}</span>}
          </div>
          {images?.length > 1 && (
            <div className="flex gap-3">
              {images.map((img,i) => (
                <button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i===activeImg?'border-brand-500':'border-[var(--border)]'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">{product.categories?.name}</div>
          <h1 className="font-display font-bold text-3xl leading-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <Stars rating={product.rating} showNum count={product.review_count}/>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${product.stock>0?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400':'bg-red-100 text-red-700'}`}>
              {product.stock>0?`In Stock (${product.stock})`:'Out of Stock'}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display font-black text-4xl">{formatPrice(product.price)}</span>
            {product.mrp>product.price && <>
              <span className="text-xl text-[var(--text3)] line-through">{formatPrice(product.mrp)}</span>
              <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-sm">{discount}% OFF — Save {formatPrice(product.mrp-product.price)}</span>
            </>}
          </div>
          <p className="text-sm text-[var(--text2)] leading-relaxed mb-6">{product.description}</p>
          <ul className="space-y-2 mb-7">
            {['Free Delivery on this item','1 Year Manufacturer Warranty','30-Day Easy Returns','Cash on Delivery Available'].map(f=>(
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--text2)]">
                <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0"><span className="text-green-600 text-[10px]">✓</span></span>{f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-[var(--text2)]">Quantity</span>
            <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg3)] transition-colors"><Minus size={15}/></button>
              <span className="w-12 text-center font-bold text-sm">{qty}</span>
              <button onClick={()=>setQty(q=>Math.min(product.stock||99,q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg3)] transition-colors"><Plus size={15}/></button>
            </div>
          </div>
          <div className="space-y-3 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleAddToCart} disabled={product.stock===0} className="btn-primary btn py-3.5 justify-center disabled:opacity-40"><ShoppingCart size={18}/> Add to Cart</button>
              <button onClick={handleBuyNow} disabled={product.stock===0} className="btn-outline btn py-3.5 justify-center disabled:opacity-40">Buy Now</button>
            </div>
            <button onClick={handleWhatsApp} className="btn w-full py-3.5 justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white"><MessageCircle size={18}/> Order on WhatsApp</button>
            <div className="flex gap-3">
              <button onClick={()=>toggle(product.id)} className={`btn flex-1 py-2.5 justify-center ${wishlisted?'bg-red-500 text-white':'btn-outline'}`}>
                <Heart size={15} className={wishlisted?'fill-current':''}/> {wishlisted?'Wishlisted':'Wishlist'}
              </button>
              <button onClick={()=>{navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!')}} className="btn btn-outline px-4 py-2.5"><Share2 size={15}/></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[var(--border)]">
            {[{icon:Truck,label:'Free Delivery'},{icon:Shield,label:'Secure Payment'},{icon:RotateCcw,label:'Easy Returns'},{icon:Shield,label:'24/7 Support'}].map(t=>(
              <div key={t.label} className="flex items-center gap-2 text-xs text-[var(--text3)]"><t.icon size={14} className="text-brand-500"/> {t.label}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex gap-1 border-b border-[var(--border)] mb-8">
          {[{key:'desc',label:'Description'},{key:'shipping',label:'Shipping & Returns'}].map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${activeTab===tab.key?'border-brand-500 text-brand-500':'border-transparent text-[var(--text3)] hover:text-[var(--text)]'}`}>{tab.label}</button>
          ))}
        </div>
        {activeTab==='desc' && <p className="text-sm text-[var(--text2)] leading-relaxed">{product.description||'No description available.'}</p>}
        {activeTab==='shipping' && (
          <div className="space-y-3 text-sm text-[var(--text2)]">
            <p><strong>Free Delivery:</strong> On orders above ₹999.</p>
            <p><strong>Standard Delivery:</strong> 2–5 business days. ₹79 for orders below ₹999.</p>
            <p><strong>Returns:</strong> 30-day hassle-free return policy.</p>
            <p><strong>Warranty:</strong> 1 year manufacturer warranty on all products.</p>
          </div>
        )}
      </div>

      {related.length>0 && (
        <section><h2 className="font-display font-bold text-2xl mb-8">Related Products</h2><ProductGrid products={related} cols={4}/></section>
      )}
    </div>
  )
}
