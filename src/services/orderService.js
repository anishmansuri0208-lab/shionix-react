import { supabase } from '@/lib/supabase'
export const orderService = {
  async create(payload) { const {data,error}=await supabase.from('orders').insert([payload]).select().single(); if(error)throw error; return data },
  async getByCustomer(customerId) {
    const {data,error}=await supabase.from('orders').select('*').eq('customer_id',customerId).order('created_at',{ascending:false})
    if(error)throw error; return data||[]
  },
  async trackById(id) {
    const {data,error}=await supabase.from('orders').select('id,status,created_at,updated_at,customer_name,city,state').eq('id',id).single()
    if(error)throw error; return data
  },
  async getAll({status,page=1,limit=20}={}) {
    let q=supabase.from('orders').select('*',{count:'exact'}).order('created_at',{ascending:false})
    if(status) q=q.eq('status',status)
    const {data,error,count}=await q.range((page-1)*limit,page*limit-1)
    if(error)throw error; return {data:data||[],count:count||0}
  },
  async updateStatus(id,status) {
    const {data,error}=await supabase.from('orders').update({status,updated_at:new Date().toISOString()}).eq('id',id).select().single()
    if(error)throw error; return data
  },
}
