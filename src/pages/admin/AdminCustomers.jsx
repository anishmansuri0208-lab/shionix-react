import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Ban, CheckCircle, Trash2 } from 'lucide-react'
import { profileService } from '@/services/profileService'
import { formatDate } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/ui/Pagination'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
const PER_PAGE=12
export default function AdminCustomers() {
  const qc=useQueryClient()
  const [page,setPage]=useState(1)
  const [search,setSearch]=useState('')
  const [deleteId,setDeleteId]=useState(null)
  const {data:result,isLoading}=useQuery({queryKey:['admin-customers',page,search],queryFn:()=>profileService.getAll({page,limit:PER_PAGE,search})})
  const customers=result?.data||[]; const total=result?.count||0
  const blockMut=useMutation({mutationFn:({id,status})=>profileService.update(id,{status}),onSuccess:()=>{qc.invalidateQueries(['admin-customers']);toast.success('Status updated!')}})
  const deleteMut=useMutation({mutationFn:(id)=>supabase.from('profiles').delete().eq('id',id),onSuccess:()=>{qc.invalidateQueries(['admin-customers']);toast.success('Deleted.')}})
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers…" className="input w-64 text-sm"/><span className="text-sm text-[var(--text3)] self-center">{total} customers</span></div>
      <div className="card overflow-hidden">
        {isLoading?<div className="p-6 space-y-3">{Array(6).fill(0).map((_,i)=><div key={i} className="h-14 skeleton rounded-xl"/>)}</div>:(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Customer','Contact','Status','Joined','Actions'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {customers.map(c=>(
                  <tr key={c.id} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-sm">{c.full_name?.[0]?.toUpperCase()||'U'}</div><div><p className="font-semibold">{c.full_name||'Unknown'}</p><p className="text-[10px] text-[var(--text3)]">{c.city||'—'}</p></div></div></td>
                    <td className="px-4 py-3"><p className="text-xs">{c.email}</p><p className="text-[10px] text-[var(--text3)]">{c.phone||'—'}</p></td>
                    <td className="px-4 py-3"><StatusBadge status={c.status||'active'}/></td>
                    <td className="px-4 py-3 text-xs text-[var(--text3)]">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <button onClick={()=>blockMut.mutate({id:c.id,status:c.status==='blocked'?'active':'blocked'})} className={`p-1.5 rounded-lg transition-colors ${c.status==='blocked'?'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500':'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500'}`}>{c.status==='blocked'?<CheckCircle size={14}/>:<Ban size={14}/>}</button>
                      <button onClick={()=>setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4"><Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage}/></div>
      </div>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={()=>deleteMut.mutate(deleteId)} title="Delete Customer" message="Permanently delete this customer?" danger/>
    </div>
  )
}
