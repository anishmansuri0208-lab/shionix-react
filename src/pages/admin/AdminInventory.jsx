import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, XCircle, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TableSkeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function AdminInventory() {
  const qc = useQueryClient()
  const [editStock, setEditStock] = useState({})
  const [filter, setFilter] = useState('')

  const { data: products=[], isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => { const {data}=await supabase.from('products').select('id,name,sku,stock,categories(name)').order('stock'); return data||[] }
  })

  const updateMut = useMutation({
    mutationFn: ({id,stock}) => supabase.from('products').update({stock}).eq('id',id),
    onSuccess: () => { qc.invalidateQueries(['admin-inventory']); toast.success('Stock updated!') }
  })

  const getStatus = (s) => s===0?'out':s<10?'low':'ok'
  const filtered = products.filter(p => { if(filter==='low') return p.stock<10&&p.stock>0; if(filter==='out') return p.stock===0; return true })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {label:'Out of Stock',count:products.filter(p=>p.stock===0).length,icon:XCircle,color:'text-red-500',border:'border-l-red-500',f:'out'},
          {label:'Low Stock',count:products.filter(p=>p.stock<10&&p.stock>0).length,icon:AlertTriangle,color:'text-yellow-500',border:'border-l-yellow-500',f:'low'},
          {label:'In Stock',count:products.filter(p=>p.stock>=10).length,icon:Package,color:'text-green-500',border:'border-l-green-500',f:''},
        ].map(s=>(
          <button key={s.label} onClick={()=>setFilter(filter===s.f?'':s.f)}
            className={`card p-4 border-l-4 ${s.border} flex items-center gap-3 text-left hover:shadow-md transition-all ${filter===s.f?'ring-2 ring-brand-500':''}`}>
            <s.icon size={20} className={s.color}/>
            <div><div className={`text-2xl font-black ${s.color}`}>{s.count}</div><div className="text-sm text-[var(--text3)]">{s.label}</div></div>
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        {isLoading?<div className="p-6"><TableSkeleton rows={8} cols={5}/></div>:(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Product','SKU','Category','Stock','Status','Update'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(p=>{
                  const st=getStatus(p.stock)
                  return (
                    <tr key={p.id} className={`border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors ${st==='out'?'bg-red-50/20 dark:bg-red-900/5':st==='low'?'bg-yellow-50/20 dark:bg-yellow-900/5':''}`}>
                      <td className="px-4 py-3 font-medium max-w-[180px] truncate">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text3)]">{p.sku||'—'}</td>
                      <td className="px-4 py-3 text-[var(--text3)]">{p.categories?.name||'—'}</td>
                      <td className="px-4 py-3"><span className={`text-xl font-black ${st==='out'?'text-red-500':st==='low'?'text-yellow-500':'text-green-600'}`}>{p.stock}</span></td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${st==='out'?'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400':st==='low'?'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400':'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                          {st==='out'?'Out of Stock':st==='low'?'Low Stock':'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" placeholder={String(p.stock)} value={editStock[p.id]??''} onChange={e=>setEditStock(s=>({...s,[p.id]:e.target.value}))} className="input w-20 text-sm py-1.5"/>
                          <button onClick={()=>{if(editStock[p.id]!==undefined){updateMut.mutate({id:p.id,stock:Number(editStock[p.id])});setEditStock(s=>({...s,[p.id]:undefined}))}}} disabled={editStock[p.id]===undefined||editStock[p.id]===''} className="btn-primary btn btn-sm disabled:opacity-40">Update</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
