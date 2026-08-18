import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, Tag, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { couponService } from '@/services/couponService'
import { formatPrice } from '@/utils/formatters'
import { FREE_SHIPPING_ABOVE, SHIPPING_CHARGE } from '@/utils/constants'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, remove, updateQty, clear } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping  = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE
  const discount  = appliedCoupon?.discount || 0
  const total     = subtotal + shipping - discount

  const handleCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const r = await couponService.validate(couponCode, subtotal)
      setAppliedCoupon(r)
      toast.success(`Coupon applied! Save ${formatPrice(r.discount)}`)
    } catch (err) { toast.error(err.message) }
    finally { setCouponLoading(false) }
  }

  const handleCheckout = () => {
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return }
    navigate('/checkout', { state: { coupon: appliedCoupon } })
  }

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add some products to get started!" onAction={() => navigate('/shop')} actionLabel="Start Shopping"/>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">Shopping Cart <span className="text-[var(--text3)] text-lg font-normal">({items.reduce((s,i)=>s+i.qty,0)} items)</span></h1>
        <button onClick={clear} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"><Trash2 size={14}/> Clear All</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-5 flex gap-4 items-center">
              {/* Product Image */}
              <div className="w-24 h-24 rounded-xl bg-[var(--bg3)] flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                {item.images?.[0]
                  ? <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name}/>
                  : item.emoji || '📦'
                }
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight mb-1 truncate">{item.name}</p>
                <p className="text-xs text-[var(--text3)] mb-3">{formatPrice(item.price)} each</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[var(--bg3)] transition-colors text-[var(--text2)] hover:text-red-500">
                      <Minus size={14}/>
                    </button>
                    <span className="w-12 text-center font-bold text-sm border-x border-[var(--border)] h-9 flex items-center justify-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[var(--bg3)] transition-colors text-[var(--text2)] hover:text-green-500">
                      <Plus size={14}/>
                    </button>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                    <Trash2 size={12}/> Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-display font-black text-lg">{formatPrice(item.price * item.qty)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-5">Order Summary</h3>

            {/* Coupon */}
            <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]"/>
                <input
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  disabled={!!appliedCoupon}
                  className="input pl-9 text-sm font-mono disabled:opacity-60"/>
              </div>
              {appliedCoupon
                ? <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }} className="btn-danger btn text-sm px-3">Remove</button>
                : <button onClick={handleCoupon} disabled={couponLoading} className="btn-primary btn text-sm px-4">{couponLoading ? '…' : 'Apply'}</button>
              }
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-[var(--text2)]">
                <span>Subtotal ({items.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text2)]">
                <span>Delivery</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount ({appliedCoupon.coupon.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            {subtotal < FREE_SHIPPING_ABOVE && (
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mb-4 text-xs text-brand-500">
                Add {formatPrice(FREE_SHIPPING_ABOVE - subtotal)} more for FREE delivery!
              </div>
            )}

            <div className="flex justify-between font-bold text-lg py-4 border-t border-[var(--border)] mb-5">
              <span>Total Payable</span>
              <span className="text-brand-500">{formatPrice(total)}</span>
            </div>

            <button onClick={handleCheckout} className="btn-primary btn w-full justify-center py-4 text-base">
              <ShieldCheck size={18}/> Proceed to Checkout
            </button>
            <Link to="/shop" className="btn-ghost btn w-full justify-center mt-3 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
