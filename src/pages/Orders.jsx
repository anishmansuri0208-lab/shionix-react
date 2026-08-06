import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { useMyOrders } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
export default function Orders() {
  const { data: orders=[], isLoading } = useMyOrders()
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display font-bold text-3xl mb-8">My Orders</h1>
      {isLoading ? <TableSkeleton rows={5} cols={4}/> : orders.length===0 ? (
        <EmptyState icon={Package} title="No orders yet" description="Start shopping to see your orders here."/>
      ) : (
        <div className="space-y-4">
          {orders.map(order=>{
            const items = typeof order.items==='string' ? JSON.parse(order.items||'[]') : order.items||[]
            return (
              <div key={order.id} className="card p-5 hover:border-brand-500 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                  <div><span className="font-mono text-xs text-brand-500 font-bold">#{order.id}</span><span className="text-xs text-[var(--text3)] ml-3">{formatDate(order.created_at)}</span></div>
                  <StatusBadge status={order.status}/>
                </div>
                <div className="text-sm text-[var(--text2)] mb-3 line-clamp-1">{items.slice(0,3).map(i=>i.name).join(', ')}{items.length>3?` +${items.length-3} more`:''}</div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-base">{formatPrice(order.total_amount)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text3)] uppercase">{order.payment_method}</span>
                    <Link to={`/track-order`} className="flex items-center gap-1 text-xs text-brand-500 font-semibold hover:text-brand-600">Track <ChevronRight size={13}/></Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
