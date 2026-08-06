import { supabase } from '@/lib/supabase'
export const reviewService = {
  async getByProduct(productId) {
    const {data,error}=await supabase.from('reviews').select('*, profiles(full_name,avatar_url)').eq('product_id',productId).eq('status','approved').order('created_at',{ascending:false})
    if(error)throw error; return data||[]
  },
  async create(payload) { const {data,error}=await supabase.from('reviews').insert([payload]).select().single(); if(error)throw error; return data },
  async getAll({status,page=1,limit=20}={}) {
    let q=supabase.from('reviews').select('*, profiles(full_name), products(name)',{count:'exact'}).order('created_at',{ascending:false})
    if(status)q=q.eq('status',status)
    const {data,error,count}=await q.range((page-1)*limit,page*limit-1)
    if(error)throw error; return {data:data||[],count:count||0}
  },
  async updateStatus(id,status) { const {error}=await supabase.from('reviews').update({status}).eq('id',id); if(error)throw error },
}
