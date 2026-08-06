import { useState } from 'react'
import { Search, CheckCircle, Clock, Package, Truck } from 'lucide-react'
import { orderService } from '@/services/orderService'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'

const STEPS = [{key:'pending',icon:Clock,label:'Order Placed'},{key:'processing',icon:Package,label:'Processing'},{key:'shipped',icon:Truck,label:'Shipped'},{key:'delivered',icon:CheckCircle,label:'Delivered'}]
const STATUS_ORDER = {pending:0,processing:1,shipped:2,delivered:3}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleTrack = async (e) => {
    e.preventDefault(); if(!orderId.trim()) return
    setLoading(true)
    try { const d=await orderService.trackById(orderId.toUpperCase().trim()); setOrder(d) }
    catch { toast.error('Order not found.'); setOrder(null) } finally { setLoading(false) }
  }
  const currentStep = STATUS_ORDER[order?.status]??0
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10"><h1 className="font-display font-bold text-3xl mb-2">Track Your Order</h1><p className="text-[var(--text3)]">Enter your order ID to see real-time updates</p></div>
      <form onSubmit={handleTrack} className="flex gap-3 mb-10">
        <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]"/><input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="e.g. SHX841203" className="input pl-11 font-mono text-sm"/></div>
        <button type="submit" disabled={loading} className="btn-primary btn px-6">{loading?'…':'Track'}</button>
      </form>
      {order && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div><span className="font-mono text-brand-500 font-bold text-sm">#{order.id}</span><p className="text-xs text-[var(--text3)] mt-0.5">{order.customer_name} • {order.city}, {order.state}</p></div>
            <span className={`badge capitalize font-semibold ${order.status==='delivered'?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400':order.status==='cancelled'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>{order.status}</span>
          </div>
          {order.status!=='cancelled' && (
            <div className="flex items-start gap-0 mb-8">
              {STEPS.map((step,i)=>{
                const done=i<=currentStep
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${done?'bg-brand-500 border-brand-500 text-white':'border-[var(--border)] text-[var(--text3)]'}`}><step.icon size={18}/></div>
                      <p className={`text-xs mt-2 text-center font-medium ${done?'text-brand-500':'text-[var(--text3)]'}`}>{step.label}</p>
                    </div>
                    {i<STEPS.length-1 && <div className={`flex-1 h-0.5 mb-5 mx-1 ${i<currentStep?'bg-brand-500':'bg-[var(--border)]'}`}/>}
                  </div>
                )
              })}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[var(--text3)] block text-xs mb-0.5">Order Placed</span><span className="font-medium">{formatDate(order.created_at)}</span></div>
            <div><span className="text-[var(--text3)] block text-xs mb-0.5">Last Updated</span><span className="font-medium">{formatDate(order.updated_at)}</span></div>
          </div>
        </div>
      )}
      <div className="mt-10 p-5 card text-center">
        <p className="text-sm text-[var(--text2)] mb-3">Need help with your order?</p>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm py-2.5 px-6 inline-flex items-center gap-2">💬 Chat on WhatsApp</a>
      </div>
    </div>
  )
}
