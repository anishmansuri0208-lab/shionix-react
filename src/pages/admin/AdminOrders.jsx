import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, Download } from 'lucide-react'
import { orderService } from '@/services/orderService'
import { formatPrice, formatDate } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Pagination from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import toast from 'react-hot-toast'

const STATUS_ACTIONS = { pending:['processing','cancelled'], processing:['shipped','cancelled'], shipped:['delivered'], delivered:['refunded'], cancelled:[], refunded:[] }
const ACTION_LABELS  = { processing:'▶ Processing', shipped:'🚚 Shipped', delivered:'✅ Delivered', cancelled:'❌ Cancel', refunded:'↩ Refund' }
const PER_PAGE = 12

export default function AdminOrders() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [viewOrder, setViewOrder] = useState(null)
  const { data: result, isLoading } = useQuery({ queryKey:['admin-orders',page,statusFilter], queryFn:()=>orderService.getAll({status:statusFilter||undefined,page,limit:PER_PAGE}) })
  const orders = result?.data||[]; const total = result?.count||0
  const statusMut = useMutation({
    mutationFn:({id,status})=>orderService.updateStatus(id,status),
    onSuccess:(data)=>{qc.invalidateQueries(['admin-orders']);setViewOrder(v=>v?.id===data.id?{...v,status:data.status}:v);toast.success(`Marked as ${data.status}`)}
  })
  const generateInvoice = (order) => {
    const doc = new jsPDF()
    doc.setFontSize(22); doc.setTextColor(0,102,255); doc.text('SHIONIX',14,20)
    doc.setFontSize(10); doc.setTextColor(100); doc.text('support@shionix.in | +91 98765 43210',14,27)
    doc.setFontSize(14); doc.setTextColor(0); doc.text('INVOICE',160,20)
    doc.setFontSize(9); doc.setTextColor(100); doc.text(`Order #${order.id}`,160,27); doc.text(`Date: ${formatDate(order.created_at)}`,160,32)
    doc.setFontSize(10); doc.setTextColor(0); doc.text('Bill To:',14,44)
    doc.setFontSize(9); doc.setTextColor(60); doc.text(order.customer_name||'',14,50); doc.text(order.customer_email||'',14,55); doc.text(order.customer_phone||'',14,60)
    const items = typeof order.items==='string'?JSON.parse(order.items||'[]'):order.items||[]
    autoTable(doc,{startY:70,head:[['Item','Qty','Price','Total']],body:items.map(i=>[i.name,i.qty,`Rs.${Number(i.price).toLocaleString('en-IN')}`,`Rs.${(i.qty*i.price).toLocaleString('en-IN')}`]),foot:[['','','Total:',`Rs.${Number(order.total_amount).toLocaleString('en-IN')}`]],headStyles:{fillColor:[0,102,255]},footStyles:{fontStyle:'bold',textColor:[0,102,255]}})
    doc.save(`Invoice-${order.id}.pdf`); toast.success('Invoice downloaded!')
  }
  const STATUS_COLORS = {pending:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',processing:'text-blue-600 bg-blue-50 dark:bg-blue-900/20',shipped:'text-purple-600 bg-purple-50 dark:bg-purple-900/20',delivered:'text-green-600 bg-green-50 dark:bg-green-900/20',cancelled:'text-red-600 bg-red-50 dark:bg-red-900/20',refunded:'text-orange-600 bg-orange-50 dark:bg-orange-900/20'}
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap">
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="input w-44 text-sm">
          <option value="">All Status</option>
          {['pending','processing','shipped','delivered','cancelled','refunded'].map(s=><option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <span className="text-sm text-[var(--text3)] self-center">{total} orders</span>
      </div>
      <div className="card overflow-hidden">
        {isLoading?<div className="p-6"><TableSkeleton rows={8} cols={6}/></div>:(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Order','Customer','Amount','Payment','Status','Date','Actions'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.id} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-500 font-bold">#{o.id}</td>
                    <td className="px-4 py-3"><p className="font-medium">{o.customer_name}</p><p className="text-[10px] text-[var(--text3)]">{o.customer_email}</p></td>
                    <td className="px-4 py-3 font-bold">{formatPrice(o.total_amount)}</td>
                    <td className="px-4 py-3"><span className="uppercase text-xs font-semibold text-[var(--text3)] bg-[var(--bg3)] px-2 py-0.5 rounded-md">{o.payment_method}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.status]||''}`}>{o.status}</span></td>
                    <td className="px-4 py-3 text-xs text-[var(--text3)]">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <button onClick={()=>setViewOrder(o)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Eye size={14}/></button>
                      <button onClick={()=>generateInvoice(o)} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500"><Download size={14}/></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4"><Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage}/></div>
      </div>
      <Modal open={!!viewOrder} onClose={()=>setViewOrder(null)} title={`Order #${viewOrder?.id}`} size="lg">
        {viewOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--bg3)] rounded-xl text-sm">
              {[['Customer',viewOrder.customer_name],['Email',viewOrder.customer_email],['Phone',viewOrder.customer_phone],['City',viewOrder.city],['Payment',viewOrder.payment_method?.toUpperCase()],['Date',formatDate(viewOrder.created_at)]].map(([k,v])=>(
                <div key={k}><span className="text-[var(--text3)] block text-xs mb-0.5">{k}</span><span className="font-medium">{v||'—'}</span></div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Items</h4>
              {(typeof viewOrder.items==='string'?JSON.parse(viewOrder.items||'[]'):viewOrder.items||[]).map((item,i)=>(
                <div key={i} className="flex justify-between py-2 border-b border-[var(--border)] text-sm"><span>{item.name} × {item.qty}</span><span className="font-bold">{formatPrice(item.price*item.qty)}</span></div>
              ))}
              <div className="flex justify-between pt-3 font-bold text-base"><span>Total</span><span className="text-brand-500">{formatPrice(viewOrder.total_amount)}</span></div>
            </div>
            {STATUS_ACTIONS[viewOrder.status]?.length>0 && (
              <div><h4 className="font-semibold text-sm mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_ACTIONS[viewOrder.status].map(action=>(
                    <button key={action} disabled={statusMut.isPending} onClick={()=>statusMut.mutate({id:viewOrder.id,status:action})} className={['cancelled','refunded'].includes(action)?'btn-danger btn btn-sm':'btn-primary btn btn-sm'}>{ACTION_LABELS[action]}</button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={()=>generateInvoice(viewOrder)} className="btn-secondary btn"><Download size={15}/> Download Invoice PDF</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
