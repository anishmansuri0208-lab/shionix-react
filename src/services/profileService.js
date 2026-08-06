import { supabase } from '@/lib/supabase'
export const profileService = {
  async get(id) { const {data,error}=await supabase.from('profiles').select('*').eq('id',id).single(); if(error)throw error; return data },
  async update(id,payload) { const {data,error}=await supabase.from('profiles').update(payload).eq('id',id).select().single(); if(error)throw error; return data },
  async getAll({page=1,limit=20,search}={}) {
    let q=supabase.from('profiles').select('*',{count:'exact'}).eq('role','customer')
    if(search) q=q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    const {data,error,count}=await q.order('created_at',{ascending:false}).range((page-1)*limit,page*limit-1)
    if(error)throw error; return {data:data||[],count:count||0}
  },
}
