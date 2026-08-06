import { supabase } from '@/lib/supabase'
export const couponService = {
  async validate(code, orderAmount) {
    const {data,error}=await supabase.from('coupons').select('*').eq('code',code.toUpperCase()).eq('active',true).single()
    if(error||!data) throw new Error('Invalid coupon code')
    if(data.expiry && new Date(data.expiry)<new Date()) throw new Error('Coupon has expired')
    if(data.used>=data.max_uses) throw new Error('Coupon limit reached')
    if(data.min_order && orderAmount<data.min_order) throw new Error(`Min order ₹${data.min_order} required`)
    const discount = data.type==='percentage' ? (orderAmount*data.value)/100 : data.value
    return { coupon:data, discount:Math.round(discount) }
  },
  async getAll() { const {data}=await supabase.from('coupons').select('*').order('created_at',{ascending:false}); return data||[] },
  async create(p) { const {data,error}=await supabase.from('coupons').insert([p]).select().single(); if(error)throw error; return data },
  async update(id,p) { const {data,error}=await supabase.from('coupons').update(p).eq('id',id).select().single(); if(error)throw error; return data },
  async delete(id) { const {error}=await supabase.from('coupons').delete().eq('id',id); if(error)throw error },
}
