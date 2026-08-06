import { supabase } from '@/lib/supabase'
export const bannerService = {
  async getActive() { const {data,error}=await supabase.from('banners').select('*').eq('active',true).order('sort_order'); if(error)throw error; return data||[] },
  async getAll() { const {data,error}=await supabase.from('banners').select('*').order('sort_order'); if(error)throw error; return data||[] },
  async create(payload) { const {data,error}=await supabase.from('banners').insert([payload]).select().single(); if(error)throw error; return data },
  async update(id,payload) { const {data,error}=await supabase.from('banners').update(payload).eq('id',id).select().single(); if(error)throw error; return data },
  async delete(id) { const {error}=await supabase.from('banners').delete().eq('id',id); if(error)throw error },
}
