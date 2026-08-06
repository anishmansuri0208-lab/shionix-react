import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import ProductGrid from '@/components/home/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import { SORT_OPTIONS } from '@/utils/constants'

const PER_PAGE = 16

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [localPrice, setLocalPrice] = useState(50000)
  const debouncedPrice = useDebounce(localPrice, 500)

  const page     = Number(params.get('page')||1)
  const search   = params.get('search')||''
  const category = params.get('category')||''
  const sort     = params.get('sort')||'new'
  const featured = params.get('featured')||''

  const { data: categories=[] } = useCategories()
  const { data: result, isLoading } = useProducts({ search, category, sort, maxPrice: debouncedPrice, featured: featured==='true', limit: PER_PAGE, offset: (page-1)*PER_PAGE })
  const products = result?.data||[]
  const total    = result?.count||0

  const setParam = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val); else next.delete(key)
    next.delete('page'); setParams(next)
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text3)] mb-3">Category</h4>
        <div className="space-y-1">
          <button onClick={()=>setParam('category','')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category?'bg-brand-500/10 text-brand-500 font-semibold':'hover:bg-[var(--bg3)] text-[var(--text2)]'}`}>All Categories</button>
          {categories.map(c=>(
            <button key={c.id} onClick={()=>setParam('category',c.slug)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category===c.slug?'bg-brand-500/10 text-brand-500 font-semibold':'hover:bg-[var(--bg3)] text-[var(--text2)]'}`}>{c.emoji} {c.name}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text3)] mb-3">Price Range</h4>
        <input type="range" min="0" max="50000" step="500" value={localPrice} onChange={e=>setLocalPrice(Number(e.target.value))} className="w-full accent-brand-500"/>
        <div className="flex justify-between text-xs text-[var(--text3)] mt-1"><span>₹0</span><span>₹{localPrice.toLocaleString('en-IN')}</span></div>
      </div>
      {(category||search||sort!=='new') && (
        <button onClick={()=>setParams({})} className="w-full text-sm text-red-500 hover:text-red-600 font-medium py-2 border border-red-200 dark:border-red-900 rounded-xl transition-colors">Clear All Filters</button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-2xl">{search?`Search: "${search}"`:category?categories.find(c=>c.slug===category)?.name||category:'All Products'}</h1>
          {!isLoading && <p className="text-sm text-[var(--text3)] mt-0.5">{total} product{total!==1?'s':''} found</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={()=>setSidebarOpen(o=>!o)} className="flex items-center gap-2 btn-secondary btn text-sm"><SlidersHorizontal size={15}/> Filters</button>
          <select value={sort} onChange={e=>setParam('sort',e.target.value)} className="input w-44 text-sm py-2.5">
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {search && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-[var(--text2)]">Results for</span>
          <span className="badge bg-[var(--bg3)] text-[var(--text)]">"{search}"<button onClick={()=>setParam('search','')} className="ml-1.5 text-[var(--text3)] hover:text-red-500"><X size={11}/></button></span>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 h-fit">
          <div className="card p-5"><FilterSidebar/></div>
        </aside>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setSidebarOpen(false)}/>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg)] p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6"><h3 className="font-bold">Filters</h3><button onClick={()=>setSidebarOpen(false)}><X size={20}/></button></div>
              <FilterSidebar/>
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} loading={isLoading} cols={3}/>
          {!isLoading && <Pagination page={page} total={total} perPage={PER_PAGE} onChange={p=>setParam('page',p)}/>}
        </div>
      </div>
    </div>
  )
}
