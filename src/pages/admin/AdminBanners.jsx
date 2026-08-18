import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { uploadFile, BUCKETS } from '@/lib/supabase'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const BANNER_TYPES = ['Hero Slider', 'Offer Banner', 'Festival Banner', 'Category Banner', 'Popup Banner']

const bannerService = {
  async getAll() {
    const { data, error } = await supabase.from('banners').select('*').order('sort_order')
    if (error) throw error
    return data || []
  },
  async create(payload) {
    const { data, error } = await supabase.from('banners').insert([payload]).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('banners').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) throw error
  },
}

export default function AdminBanners() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: bannerService.getAll,
  })

  const createMut = useMutation({
    mutationFn: bannerService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Banner created!'); setModalOpen(false) },
    onError: (e) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => bannerService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Updated!'); setModalOpen(false) },
    onError: (e) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: bannerService.delete,
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Deleted.') },
  })
  const toggleMut = useMutation({
    mutationFn: ({ id, active }) => bannerService.update(id, { active }),
    onSuccess: () => qc.invalidateQueries(['admin-banners']),
  })

  const openAdd = () => { setEditItem(null); setPreview(null); reset({ type: 'Hero Slider', link: '/shop', title: '' }); setModalOpen(true) }
  const openEdit = (b) => { setEditItem(b); setPreview(b.image_url); reset(b); setModalOpen(true) }

  const handleImg = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setUploading(true)
    try {
      const { url } = await uploadFile(BUCKETS.BANNERS, f, 'banners')
      setPreview(url)
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const onSubmit = (data) => {
    const payload = {
      title: data.title || '',
      subtitle: data.subtitle || '',
      type: data.type || 'Hero Slider',
      link: data.link || '/shop',
      sort_order: Number(data.sort_order || 0),
      active: true,
      image_url: preview || null,
    }
    if (editItem) updateMut.mutate({ id: editItem.id, data: payload })
    else createMut.mutate(payload)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-end">
        <button onClick={openAdd} className="btn-primary btn"><Plus size={16}/> Add Banner</button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {Array(2).fill(0).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl"/>)}
        </div>
      ) : banners.length === 0 ? (
        <div className="card p-12 text-center text-[var(--text3)]">No banners yet. Add one!</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {banners.map(b => (
            <div key={b.id} className="card overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center">
                {b.image_url && <img src={b.image_url} className="w-full h-full object-cover absolute inset-0" alt={b.title}/>}
                <div className="relative z-10 text-center p-6">
                  {b.title && <p className="text-white font-black text-xl mb-1 drop-shadow-lg">{b.title}</p>}
                  {b.subtitle && <p className="text-white/80 text-sm drop-shadow">{b.subtitle}</p>}
                </div>
                {!b.active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="badge bg-red-500 text-white">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-brand-500/10 text-brand-500 text-[10px]">{b.type}</span>
                  <Toggle checked={!!b.active} onChange={v => toggleMut.mutate({ id: b.id, active: v })}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(b)} className="btn-secondary btn btn-sm flex-1 justify-center"><Edit2 size={12}/> Edit</button>
                  <button onClick={() => setDeleteId(b.id)} className="btn-danger btn btn-sm"><Trash2 size={12}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Banner' : 'Add Banner'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block cursor-pointer">
            <div className={`aspect-video bg-[var(--bg3)] rounded-xl border-2 border-dashed border-[var(--border)] hover:border-brand-500 flex items-center justify-center overflow-hidden transition-colors ${uploading ? 'opacity-60' : ''}`}>
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt=""/>
                : <div className="text-center text-[var(--text3)]">
                    <Upload size={24} className="mx-auto mb-2"/>
                    <span className="text-sm">{uploading ? 'Uploading…' : 'Click to upload banner image'}</span>
                  </div>
              }
            </div>
            <input type="file" accept="image/*" className="sr-only" onChange={handleImg} disabled={uploading}/>
          </label>

          <Input label="Title (optional — khali chod sakte ho)" placeholder="e.g. 50% Off Sale" {...register('title')}/>
          <Input label="Subtitle (optional)" placeholder="e.g. Limited time offer" {...register('subtitle')}/>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select className="input" {...register('type')}>
                {BANNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Link URL" placeholder="/shop" {...register('link')}/>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💡 Title aur Subtitle khali chod sakte ho — sirf image dikhegi aur click pe link pe jaayega!
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary btn">Cancel</button>
            <button type="submit" disabled={uploading || createMut.isPending || updateMut.isPending} className="btn-primary btn">
              {createMut.isPending || updateMut.isPending ? 'Saving…' : editItem ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId)} title="Delete Banner" message="Remove this banner permanently?" danger/>
    </div>
  )
}
