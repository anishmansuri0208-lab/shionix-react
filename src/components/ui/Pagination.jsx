import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total/perPage)
  if (totalPages<=1) return null
  return (
    <div className="flex items-center justify-between pt-4 flex-wrap gap-3">
      <p className="text-sm text-[var(--text3)]">Showing {(page-1)*perPage+1}–{Math.min(page*perPage,total)} of {total}</p>
      <div className="flex gap-1">
        <button disabled={page===1} onClick={()=>onChange(page-1)} className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg3)] transition-colors"><ChevronLeft size={15}/></button>
        {Array.from({length:Math.min(totalPages,5)}).map((_,i)=>{
          const p=Math.max(1,page-2)+i
          if(p>totalPages) return null
          return <button key={p} onClick={()=>onChange(p)} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${p===page?'bg-brand-500 text-white border-brand-500':'border-[var(--border)] hover:bg-[var(--bg3)]'}`}>{p}</button>
        })}
        <button disabled={page===totalPages} onClick={()=>onChange(page+1)} className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg3)] transition-colors"><ChevronRight size={15}/></button>
      </div>
    </div>
  )
}
