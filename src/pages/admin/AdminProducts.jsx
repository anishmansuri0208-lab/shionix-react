import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { uploadFile, BUCKETS } from '@/lib/supabase'
import { formatPrice, calcDiscount } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const PER_PAGE = 12

export default function AdminProducts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [localImages, setLocalImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset, setValue, formState:{ errors } } = useForm()
  const { data: result, isLoading } = useQuery({ queryKey:['admin-products',page,search], queryFn:()=>productService.getAll({search,limit:PER_PAGE,offset:(page-1)*PER_PAGE}) })
  const { data: categories=[] } = useQuery({ queryKey:['categories'], queryFn:categoryService.getAll })
  const products = result?.data||[]; const total = result?.count||0
  const createMut = useMutation({ mutationFn:productService.create, onSuccess:()=>{qc.invalidateQueries(['admin-products']);toast.success('Product added!');setModalOpen(false)}, onError:e=>toast.error(e.message) })
  const updateMut = useMutation({ mutationFn:({id,data})=>productService.update(id,data), onSuccess:()=>{qc.invalidateQueries(['admin-products']);toast.success('Updated!');setModalOpen(false)}, onError:e=>toast.error(e.message) })
  const deleteMut = useMutation({ mutationFn:productService.delete, onSuccess:()=>{qc.invalidateQueries(['admin-products']);toast.success('Deleted.')} })
  const openAdd = () => { setEditItem(null); setLocalImages([]); reset({}); setModalOpen(true) }
  const openEdit = (p) => { setEditItem(p); setLocalImages(p.images||[]); reset({...p, category_id:p.category_id}); setModalOpen(true) }
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); setUploading(true)
    try { const uploads = await Promise.all(files.map(f=>uploadFile(BUCKETS.PRODUCTS,f,'products'))); const urls=uploads.map(u=>u.url).filter(Boolean); setLocalImages(prev=>[...prev,...urls]); setValue('images',[...localImages,...urls]) }
    catch { toast.error('Upload failed') } finally { setUploading(false) }
  }
  const onSubmit = (data) => {
    const payload = {...data, price:Number(data.price), mrp:Number(data.mrp)||Number(data.price), stock:Number(data.stock)||0, images:localImages, category_id:data.category_id?Number(data.category_id):null }
    if (editItem) updateMut.mutate({id:editItem.id,data:payload}); else createMut.mutate(payload)
  }
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" className="input w-56 text-sm"/>
        <button onClick={openAdd} className="btn-primary btn"><Plus size={16}/> Add Product</button>
      </div>
      <div className="card overflow-hidden">
        {isLoading ? <div className="p-6"><TableSkeleton rows={6} cols={5}/></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Product','Category','Price','Stock','Status','Actions'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {products.map(p=>(
                  <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[var(--bg3)] flex items-center justify-center text-xl overflow-hidden">{p.images?.[0]?<img src={p.images[0]} className="w-full h-full object-cover" alt=""/>:p.emoji||'📦'}</div><div><p className="font-semibold line-clamp-1 max-w-[160px]">{p.name}</p><p className="text-[10px] text-[var(--text3)] font-mono">{p.sku}</p></div></div></td>
                    <td className="px-4 py-3 text-[var(--text3)]">{p.categories?.name||'—'}</td>
                    <td className="px-4 py-3"><p className="font-bold">{formatPrice(p.price)}</p>{p.mrp>p.price&&<p className="text-[10px] text-[var(--text3)] line-through">{formatPrice(p.mrp)}</p>}</td>
                    <td className="px-4 py-3"><span className={`font-bold ${p.stock===0?'text-red-500':p.stock<10?'text-yellow-500':'text-green-600'}`}>{p.stock}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status||'active'}/></td>
                    <td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Edit2 size={14}/></button><button onClick={()=>setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4"><Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage}/></div>
      </div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editItem?'Edit Product':'Add Product'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <div className="flex gap-2 flex-wrap">
              {localImages.map((img,i)=>(
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--border)]">
                  <img src={img} className="w-full h-full object-cover" alt=""/>
                  <button type="button" onClick={()=>setLocalImages(imgs=>imgs.filter((_,j)=>j!==i))} className="absolute top-0.5 right-0.5 bg-red-500 rounded-full p-0.5 text-white"><X size={10}/></button>
                </div>
              ))}
              <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors ${uploading?'opacity-50':''}`}>
                <Upload size={18} className="text-[var(--text3)] mb-1"/><span className="text-[10px] text-[var(--text3)]">{uploading?'…':'Upload'}</span>
                <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading}/>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Input label="Product Name *" placeholder="e.g. Shionix Pro Headphones" error={errors.name?.message} {...register('name',{required:true})}/></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea className="input resize-none" rows={3} {...register('description')}/></div>
            <Input label="Price (₹) *" type="number" placeholder="4999" error={errors.price?.message} {...register('price',{required:true,min:0})}/>
            <Input label="MRP (₹)" type="number" placeholder="8999" {...register('mrp',{min:0})}/>
            <Input label="Stock *" type="number" placeholder="100" error={errors.stock?.message} {...register('stock',{required:true,min:0})}/>
            <Input label="SKU" placeholder="SHX-HP-001" className="font-mono" {...register('sku')}/>
            <div><label className="block text-sm font-medium mb-1">Category *</label><select className="input" {...register('category_id',{required:true})}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <Input label="Emoji (fallback)" placeholder="🎧" {...register('emoji')}/>
            <div><label className="block text-sm font-medium mb-1">Status</label><select className="input" {...register('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--bg3)] rounded-xl">
            {[['featured','⭐ Featured'],['best_seller','🔥 Best Seller'],['new_arrival','✨ New Arrival'],['flash_sale','⚡ Flash Sale']].map(([k,l])=>(
              <label key={k} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-brand-500" {...register(k)}/><span className="text-sm font-medium">{l}</span></label>
            ))}
          </div>
          <div className="flex gap-3 justify-end"><button type="button" onClick={()=>setModalOpen(false)} className="btn-secondary btn">Cancel</button><button type="submit" disabled={createMut.isPending||updateMut.isPending} className="btn-primary btn">{createMut.isPending||updateMut.isPending?'Saving…':editItem?'Update':'Add Product'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={()=>deleteMut.mutate(deleteId)} title="Delete Product" message="Permanently delete this product?" danger/>
    </div>
  )
}
