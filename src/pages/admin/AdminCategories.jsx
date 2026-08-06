import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { categoryService } from '@/services/categoryService'
import { uploadFile, BUCKETS } from '@/lib/supabase'
import { StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [preview, setPreview] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const { data: categories=[], isLoading } = useQuery({ queryKey:['categories'], queryFn:categoryService.getAll })
  const createMut = useMutation({ mutationFn:categoryService.create, onSuccess:()=>{qc.invalidateQueries(['categories']);toast.success('Category added!');setModalOpen(false)} })
  const updateMut = useMutation({ mutationFn:({id,data})=>categoryService.update(id,data), onSuccess:()=>{qc.invalidateQueries(['categories']);toast.success('Updated!');setModalOpen(false)} })
  const deleteMut = useMutation({ mutationFn:categoryService.delete, onSuccess:()=>{qc.invalidateQueries(['categories']);toast.success('Deleted.')} })
  const openAdd  = () => { setEditItem(null); setPreview(null); reset({}); setModalOpen(true) }
  const openEdit = (c) => { setEditItem(c); setPreview(c.image_url); reset(c); setModalOpen(true) }
  const handleImg = async (e) => {
    const f = e.target.files[0]; if(!f) return
    try { const {url} = await uploadFile(BUCKETS.CATEGORIES,f,'categories'); setPreview(url) }
    catch { toast.error('Upload failed') }
  }
  const onSubmit = (data) => {
    const payload = {...data, image_url:preview}
    if (editItem) updateMut.mutate({id:editItem.id,data:payload}); else createMut.mutate(payload)
  }
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-end"><button onClick={openAdd} className="btn-primary btn"><Plus size={16}/> Add Category</button></div>
      {isLoading ? <div className="grid grid-cols-3 gap-4">{Array(6).fill(0).map((_,i)=><div key={i} className="skeleton h-40 rounded-2xl"/>)}</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c=>(
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg3)] flex items-center justify-center text-2xl overflow-hidden">{c.image_url?<img src={c.image_url} className="w-full h-full object-cover" alt={c.name}/>:c.emoji||'📦'}</div>
                  <div><p className="font-bold">{c.name}</p><p className="text-xs text-[var(--text3)] font-mono">/{c.slug}</p></div>
                </div>
                <StatusBadge status={c.status||'active'}/>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text3)]">Sort: {c.sort_order||0}</span>
                <div className="flex gap-1">
                  <button onClick={()=>openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Edit2 size={14}/></button>
                  <button onClick={()=>setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editItem?'Edit Category':'Add Category'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-[var(--bg3)] border-2 border-dashed border-[var(--border)] hover:border-brand-500 flex items-center justify-center overflow-hidden transition-colors text-4xl">
                {preview?<img src={preview} className="w-full h-full object-cover" alt=""/>:<Upload size={24} className="text-[var(--text3)]"/>}
              </div>
              <input type="file" accept="image/*" className="sr-only" onChange={handleImg}/>
            </label>
          </div>
          <Input label="Category Name *" placeholder="Headphones" {...register('name',{required:true})}/>
          <Input label="Slug *" placeholder="headphones" className="font-mono" {...register('slug',{required:true})}/>
          <Input label="Emoji" placeholder="🎧" {...register('emoji')}/>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="input resize-none" rows={2} {...register('description')}/></div>
          <div><label className="block text-sm font-medium mb-1">Status</label><select className="input" {...register('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="flex gap-3 justify-end"><button type="button" onClick={()=>setModalOpen(false)} className="btn-secondary btn">Cancel</button><button type="submit" className="btn-primary btn">{editItem?'Update':'Add Category'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={()=>deleteMut.mutate(deleteId)} title="Delete Category" message="Delete this category?" danger/>
    </div>
  )
}
