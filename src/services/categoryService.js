import { supabase } from '@/lib/supabase'
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase.from('categories').select('*').eq('status','active').order('sort_order')
    if (error) throw error; return data||[]
  },
  async create(payload) { const {data,error}=await supabase.from('categories').insert([payload]).select().single(); if(error)throw error; return data },
  async update(id,payload) { const {data,error}=await supabase.from('categories').update(payload).eq('id',id).select().single(); if(error)throw error; return data },
  async delete(id) { const {error}=await supabase.from('categories').delete().eq('id',id); if(error)throw error },
}
