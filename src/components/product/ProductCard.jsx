import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, MessageCircle, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calcDiscount } from '@/utils/formatters'
import { WHATSAPP_NUMBER } from '@/utils/constants'
import Stars from '@/components/ui/Stars'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { add, items } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const navigate = useNavigate()
  const wishlisted = has(product.id)
  const inCart = items.some(i => i.id === product.id)
  const discount = calcDiscount(product.price, product.mrp)
  const mainImg = product.images?.[0]

  const handleCartBtn = (e) => {
    e.preventDefault()
    if (inCart) {
      navigate('/cart')
    } else {
      add(product)
      toast.success(`${product.name.slice(0, 25)}… added to cart!`)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product.id)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Shionix!%20I%20want%20to%20order%3A%0A*${encodeURIComponent(product.name)}*%0APrice%3A%20${formatPrice(product.price)}`, '_blank')
  }

  const badge = product.flash_sale ? 'Sale' : product.best_seller ? 'Hot' : product.new_arrival ? 'New' : null
  const badgeColor = product.flash_sale ? 'bg-red-500' : product.best_seller ? 'bg-orange-500' : 'bg-brand-500'

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-[var(--bg3)] overflow-hidden">
          {mainImg
            ? <img src={mainImg} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
            : <div className="w-full h-full flex items-center justify-center text-6xl">{product.emoji || '📦'}</div>
          }
          {badge && <span className={`absolute top-3 left-3 badge ${badgeColor} text-white`}>{badge}</span>}
          {inCart && <span className="absolute top-3 left-3 badge bg-green-500 text-white flex items-center gap-1"><Check size={10}/> In Cart</span>}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="badge bg-red-500 text-white">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleWishlist} className={`w-8 h-8 rounded-lg flex items-center justify-center shadow text-sm transition-all ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'}`}>
              <Heart size={14} className={wishlisted ? 'fill-current' : ''}/>
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">{product.categories?.name || 'Product'}</p>
          <h3 className="text-sm font-semibold leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <Stars rating={product.rating} count={product.review_count}/>
          <div className="flex items-center gap-2 mt-2 mb-3 flex-wrap">
            <span className="font-display font-black text-base">{formatPrice(product.price)}</span>
            {product.mrp > product.price && <>
              <span className="text-xs text-[var(--text3)] line-through">{formatPrice(product.mrp)}</span>
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">{discount}% off</span>
            </>}
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCartBtn}
                disabled={product.stock === 0}
                className={`btn text-xs py-2 justify-center disabled:opacity-40 ${inCart ? 'bg-green-500 hover:bg-green-600 text-white' : 'btn-primary'}`}>
                {inCart
                  ? <><Check size={13}/> Go to Cart</>
                  : <><ShoppingCart size={13}/> Add to Cart</>
                }
              </button>
              <Link to={`/product/${product.id}`} className="btn-outline btn text-xs py-2 justify-center">Buy Now</Link>
            </div>
            <button onClick={handleWhatsApp} className="btn w-full py-2 justify-center text-xs bg-[#25D366] hover:bg-[#20bd5a] text-white">
              <MessageCircle size={13}/> WhatsApp Order
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
