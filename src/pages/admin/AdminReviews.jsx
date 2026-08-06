import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, EyeOff, Trash2 } from 'lucide-react'
import { reviewService } from '@/services/reviewService'
import { formatDate } from '@/utils/formatters'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/ui/Pagination'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const PER_PAGE = 8

export default function AdminReviews() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const { data: result, isLoading } = useQuery({ queryKey:['admin-reviews',page,statusFilter], queryFn:()=>reviewService.getAll({status:statusFilter||undefined,page,limit:PER_PAGE}) })
  const reviews=result?.data||[]; const total=result?.count||0
  const statusMut = useMutation({ mutationFn:({id,status})=>reviewService.updateStatus(id,status), onSuccess:()=>{qc.invalidateQueries(['admin-reviews']);toast.success('Updated!')} })
  const deleteMut = useMutation({ mutationFn:(id)=>supabase.from('reviews').delete().eq('id',id), onSuccess:()=>{qc.invalidateQueries(['admin-reviews']);toast.success('Deleted.')} })
  const STATUS_STYLE = { approved:'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400', pending:'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', hidden:'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' }
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3">
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="input w-36 text-sm">
          <option value="">All Status</option>
          {['approved','pending','hidden'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <span className="text-sm text-[var(--text3)] self-center">{total} reviews</span>
      </div>
      <div className="space-y-4">
        {reviews.map(r=>(
          <div key={r.id} className={`card p-5 transition-opacity ${r.status==='hidden'?'opacity-60':''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{r.profiles?.full_name||'User'}</span>
                  <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><svg key={i} width="12" height="12" viewBox="0 0 24 24" className={i<r.rating?'fill-yellow-400':'fill-gray-200 dark:fill-gray-700'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
                  <span className={`badge text-[10px] capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                </div>
                <p className="text-xs text-brand-500 font-medium mb-2">{r.products?.name||'Product'}</p>
                <p className="text-sm text-[var(--text2)] leading-relaxed">{r.comment}</p>
                <p className="text-xs text-[var(--text3)] mt-2">{formatDate(r.created_at)}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {r.status!=='approved' && <button onClick={()=>statusMut.mutate({id:r.id,status:'approved'})} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500" title="Approve"><CheckCircle size={15}/></button>}
                {r.status!=='hidden' && <button onClick={()=>statusMut.mutate({id:r.id,status:'hidden'})} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400" title="Hide"><EyeOff size={15}/></button>}
                <button onClick={()=>setDeleteId(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={15}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage}/>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={()=>deleteMut.mutate(deleteId)} title="Delete Review" message="Permanently delete this review?" danger/>
    </div>
  )
}
