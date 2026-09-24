import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Lock, CheckCircle, MapPin, CreditCard } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderService } from '@/services/orderService'
import { razorpayService } from '@/services/razorpayService'
import { formatPrice, generateOrderId } from '@/utils/formatters'
import { FREE_SHIPPING_ABOVE, SHIPPING_CHARGE } from '@/utils/constants'
import { createShiprocketOrder } from '@/services/shiprocketService'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const couponData = location.state?.coupon
  const { items, clear } = useCartStore()
  const { user, profile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [orderDone, setOrderDone] = useState(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: profile?.full_name || '', phone: profile?.phone || '', email: user?.email || '', payment: 'cod' }
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE
  const discount = couponData?.discount || 0
  const total = subtotal + shipping - discount
  const itemCount = items.reduce((s, i) => s + i.qty, 0)

  const PAYMENT_LABELS = { cod: 'Cash on Delivery', upi: 'UPI Payment', online: 'Card / Net Banking' }

  const onSubmit = async (data) => {
    if (items.length === 0) { toast.error('Cart is empty'); return }
    if (!/^\d{6}$/.test(data.pin)) { toast.error('Enter valid 6-digit PIN'); return }
    
    setLoading(true)
    try {
      const orderId = generateOrderId()
      const orderPayload = {
        id: orderId,
        customer_id: user?.id || null,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pin_code: data.pin,
        items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, sku: i.sku || i.id }))),
        subtotal,
        shipping,
        discount,
        total_amount: total,
        status: 'pending',
        payment_method: data.payment,
        payment_status: data.payment === 'cod' ? 'pending' : 'processing',
      }

      // Handle payment based on method
      let paymentVerified = false
      
      if (data.payment === 'cod') {
        // COD: Direct order creation
        paymentVerified = true
      } else if (data.payment === 'online' || data.payment === 'upi') {
        // Online/UPI: Razorpay payment
        try {
          // Create order in Razorpay
          const rzpOrder = await razorpayService.createOrder(total, orderId, {
            name: data.name,
            email: data.email,
            phone: data.phone,
          })

          // Initiate payment
          const paymentResponse = await razorpayService.initiatePayment(rzpOrder, orderPayload)

          // Verify payment
          await razorpayService.verifyPayment(paymentResponse)
          
          paymentVerified = true
          orderPayload.payment_status = 'completed'
          orderPayload.razorpay_payment_id = paymentResponse.razorpay_payment_id

          toast.success('Payment successful! ✅')
        } catch (payErr) {
          console.error('Payment failed:', payErr)
          toast.error('Payment failed. Please try again.')
          setLoading(false)
          return
        }
      }

      if (!paymentVerified) {
        toast.error('Payment verification failed')
        setLoading(false)
        return
      }

      // Save order to Supabase
      const order = await orderService.create(orderPayload)
      toast.success('Order placed! 🎉')

      // Auto-create on Shiprocket
      try {
        await createShiprocketOrder({ ...orderPayload, ...order })
        toast.success('Shipment created on Shiprocket! 🚚')
      } catch (srErr) {
        console.error('Shiprocket failed:', srErr)
        toast('Order saved! Shiprocket sync pending.', { icon: '⚠️' })
      }

      clear()
      setOrderDone({
        ...order,
        payLabel: PAYMENT_LABELS[data.payment],
        address: `${data.city}, ${data.state} – ${data.pin}`
      })

    } catch (err) {
      console.error('Order error:', err)
      toast.error('Failed to place order. Please try again.')
    }
    finally { setLoading(false) }
  }

  if (orderDone) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={44} className="text-green-500" />
      </div>
      <h1 className="font-display font-black text-3xl mb-3">Order Placed! 🎉</h1>
      <p className="text-[var(--text2)] mb-8">Thank you, <strong>{orderDone.customer_name}</strong>! Your order will be dispatched soon.</p>
      <div className="card p-5 text-left space-y-3 mb-8">
        {[
          ['Order ID', `#${orderDone.id}`, 'text-brand-500 font-mono font-bold'],
          ['Items', `${itemCount} item${itemCount > 1 ? 's' : ''}`, ''],
          ['Deliver to', orderDone.address, ''],
          ['Payment', orderDone.payLabel, ''],
          ['Total Paid', formatPrice(total), 'text-brand-500 font-bold'],
          ['Delivery', '2–5 Business Days', 'text-green-500'],
        ].map(([k, v, cls]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-[var(--text3)]">{k}</span>
            <span className={`font-medium text-right max-w-[220px] ${cls}`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={() => navigate('/')} className="btn-primary btn w-full justify-center py-3.5">Back to Home</button>
        <button onClick={() => navigate('/orders')} className="btn-outline btn w-full justify-center py-3.5">View My Orders</button>
        <a href={`https://wa.me/919876543210?text=Hi%20Shionix!%20Order%20%23${orderDone.id}`} target="_blank" rel="noopener noreferrer" className="btn w-full justify-center py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white">Track on WhatsApp</a>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display font-bold text-2xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2"><MapPin size={18} className="text-brand-500" /> Delivery Information</h2>
              {user && <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl mb-5 text-sm"><CheckCircle size={15} className="text-green-500 flex-shrink-0" /><span>Checking out as <strong>{profile?.full_name || user.email}</strong></span></div>}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name *" placeholder="Rahul Kumar" error={errors.name?.message} {...register('name', { required: 'Required' })} />
                <Input label="Mobile Number *" placeholder="9876543210" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
                <div className="col-span-2"><Input label="Email" placeholder="rahul@email.com" type="email" {...register('email')} /></div>
                <div className="col-span-2"><Input label="Address *" placeholder="123 Main Street" error={errors.address?.message} {...register('address', { required: 'Required' })} /></div>
                <Input label="City *" placeholder="Mumbai" error={errors.city?.message} {...register('city', { required: 'Required' })} />
                <Input label="State *" placeholder="Maharashtra" error={errors.state?.message} {...register('state', { required: 'Required' })} />
                <Input label="PIN Code *" placeholder="400001" error={errors.pin?.message} {...register('pin', { required: 'Required' })} />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2"><CreditCard size={18} className="text-brand-500" /> Payment Method</h2>
              <div className="space-y-3">
                {['cod', 'upi', 'online'].map(method => (
                  <label key={method} className="flex items-center p-4 border-2 border-[var(--border)] rounded-xl cursor-pointer hover:border-brand-500 transition-colors" style={{ borderColor: watch('payment') === method ? '#0066FF' : undefined }}>
                    <input type="radio" value={method} {...register('payment')} className="w-4 h-4 text-brand-500" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-sm">{PAYMENT_LABELS[method]}</p>
                      <p className="text-xs text-[var(--text3)]">
                        {method === 'cod' && 'Pay when you receive your order'}
                        {method === 'upi' && 'Fast & secure UPI payment'}
                        {method === 'online' && 'Cards, NetBanking, Wallets via Razorpay'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit sticky top-4">
            <h3 className="font-display font-semibold text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5 pb-5 border-b border-[var(--border)]">
              <div className="flex justify-between text-sm"><span className="text-[var(--text3)]">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              {shipping > 0 && <div className="flex justify-between text-sm"><span className="text-[var(--text3)]">Shipping</span><span className="font-semibold">{formatPrice(shipping)}</span></div>}
              {discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount</span><span className="font-semibold text-green-600">-{formatPrice(discount)}</span></div>}
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-display font-bold text-lg">Total</span>
              <span className="font-display font-bold text-xl text-brand-500">{formatPrice(total)}</span>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn w-full justify-center py-3.5 disabled:opacity-50">
              <Lock size={16} className="mr-2" />
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
            <p className="text-xs text-[var(--text3)] text-center mt-4">🔒 Payments secured by Razorpay</p>
          </div>
        </div>
      </form>
    </div>
  )
}
