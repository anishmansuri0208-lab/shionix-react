import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { CreditCard, DollarSign, RotateCcw } from 'lucide-react'

const PER_PAGE = 12

export default function AdminPayments() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')

  const { data: result, isLoading } = useQuery({
    queryKey: ['admin-payments', page, filter],
    queryFn: async () => {
      let q = supabase.from('orders').select('id,customer_name,customer_email,total_amount,payment_method,status,created_at',{count:'exact'}).order('created_at',{ascending:false})
      if (filter) q = q.eq('payment_method', filter)
      const {data,count} = await q.range((page-1)*PER_PAGE, page*PER_PAGE-1)
      return {data:data||[],count:count||0}
    }
  })
  const orders = result?.data||[]; const total = result?.count||0

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {label:'Total Revenue',value:formatPrice(485000),icon:DollarSign,color:'text-green-500 bg-green-50 dark:bg-green-900/20'},
          {label:'COD Revenue',value:formatPrice(142000),icon:CreditCard,color:'text-blue-500 bg-blue-50 dark:bg-blue-900/20'},
          {label:'Online Revenue',value:formatPrice(343000),icon:RotateCcw,color:'text-purple-500 bg-purple-50 dark:bg-purple-900/20'},
        ].map(s=>(
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}><s.icon size={20}/></div>
            <div><div className="text-xl font-black">{s.value}</div><div className="text-sm text-[var(--text3)]">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input w-44 text-sm">
          <option value="">All Methods</option>
          <option value="cod">COD</option>
          <option value="upi">UPI</option>
          <option value="online">Online</option>
        </select>
      </div>
      <div className="card overflow-hidden">
        {isLoading?<div className="p-6"><TableSkeleton rows={8} cols={5}/></div>:(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Order','Customer','Amount','Method','Status','Date'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.id} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-500 font-bold">#{o.id}</td>
                    <td className="px-4 py-3"><p className="font-medium">{o.customer_name}</p><p className="text-[10px] text-[var(--text3)]">{o.customer_email}</p></td>
                    <td className="px-4 py-3 font-bold">{formatPrice(o.total_amount)}</td>
                    <td className="px-4 py-3"><span className="uppercase text-xs font-bold text-[var(--text3)] bg-[var(--bg3)] px-2 py-0.5 rounded-md">{o.payment_method}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={o.status}/></td>
                    <td className="px-4 py-3 text-xs text-[var(--text3)]">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4"><Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage}/></div>
      </div>
    </div>
  )
}
