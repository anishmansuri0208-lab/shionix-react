import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { couponService } from '@/services/couponService'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
export default function AdminCoupons() {
  const qc=useQueryClient()
  const [modalOpen,setModalOpen]=useState(false)
  const [editItem,setEditItem]=useState(null)
  const [deleteId,setDeleteId]=useState(null)
  const {register,handleSubmit,reset}=useForm()
  const {data:coupons=[]}=useQuery({queryKey:['coupons'],queryFn:couponService.getAll})
  const createMut=useMutation({mutationFn:couponService.create,onSuccess:()=>{qc.invalidateQueries(['coupons']);toast.success('Created!');setModalOpen(false)}})
  const updateMut=useMutation({mutationFn:({id,data})=>couponService.update(id,data),onSuccess:()=>{qc.invalidateQueries(['coupons']);toast.success('Updated!');setModalOpen(false)}})
  const deleteMut=useMutation({mutationFn:couponService.delete,onSuccess:()=>{qc.invalidateQueries(['coupons']);toast.success('Deleted.')}})
  const toggleActive=(c)=>updateMut.mutate({id:c.id,data:{active:!c.active}})
  const openAdd=()=>{setEditItem(null);reset({});setModalOpen(true)}
  const openEdit=(c)=>{setEditItem(c);reset(c);setModalOpen(true)}
  const onSubmit=(data)=>{
    const p={...data,value:Number(data.value),min_order:Number(data.min_order||0),max_uses:Number(data.max_uses||1000)}
    if(editItem)updateMut.mutate({id:editItem.id,data:p});else createMut.mutate(p)
  }
  const isExpired=(date)=>date&&new Date(date)<new Date()
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-end"><button onClick={openAdd} className="btn-primary btn"><Plus size={16}/> Create Coupon</button></div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg3)]"><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide">{['Code','Type','Discount','Min Order','Usage','Expiry','Active','Actions'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {coupons.map(c=>(
                <tr key={c.id} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                  <td className="px-4 py-3"><span className="font-mono font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-lg">{c.code}</span></td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${c.type==='percentage'?'bg-purple-100 text-purple-700':'bg-orange-100 text-orange-700'}`}>{c.type}</span></td>
                  <td className="px-4 py-3 font-bold">{c.type==='percentage'?`${c.value}%`:`₹${c.value}`}</td>
                  <td className="px-4 py-3">₹{Number(c.min_order||0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{c.used||0}/{c.max_uses}</div>
                    <div className="w-full bg-[var(--border)] rounded-full h-1 mt-1"><div className="bg-brand-500 h-1 rounded-full" style={{width:`${Math.min(((c.used||0)/c.max_uses)*100,100)}%`}}/></div>
                  </td>
                  <td className="px-4 py-3 text-xs"><span className={isExpired(c.expiry)?'text-red-500 font-medium':'text-[var(--text3)]'}>{isExpired(c.expiry)?'⚠ Expired · ':''}{c.expiry||'No expiry'}</span></td>
                  <td className="px-4 py-3"><Toggle checked={!!c.active} onChange={()=>toggleActive(c)} size="sm"/></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button onClick={()=>openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Edit2 size={14}/></button>
                    <button onClick={()=>setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editItem?'Edit Coupon':'Create Coupon'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Coupon Code *" placeholder="SHIONIX10" className="font-mono uppercase" {...register('code',{required:true})}/>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Type *</label><select className="input" {...register('type',{required:true})}><option value="percentage">Percentage (%)</option><option value="flat">Flat (₹)</option></select></div>
            <Input label="Value *" type="number" placeholder="10" min="0" {...register('value',{required:true})}/>
            <Input label="Min Order (₹)" type="number" placeholder="500" min="0" {...register('min_order')}/>
            <Input label="Max Uses" type="number" placeholder="1000" min="1" {...register('max_uses')}/>
            <Input label="Expiry Date" type="date" {...register('expiry')}/>
          </div>
          <div className="flex gap-3 justify-end"><button type="button" onClick={()=>setModalOpen(false)} className="btn-secondary btn">Cancel</button><button type="submit" className="btn-primary btn">{editItem?'Update':'Create Coupon'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={()=>deleteMut.mutate(deleteId)} title="Delete Coupon" message="Permanently delete this coupon?" danger/>
    </div>
  )
}
