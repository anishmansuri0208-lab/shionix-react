import { supabase } from '@/lib/supabase'
export const productService = {
  async getAll({ category, search, sort, maxPrice, featured, limit=20, offset=0 }={}) {
    let q = supabase.from('products').select('*, categories!category_id(name,slug)', { count:'exact' }).eq('status','active')
    if (search)   q = q.ilike('name', `%${search}%`)
    if (featured) q = q.eq('featured', true)
    if (maxPrice) q = q.lte('price', maxPrice)
    if (sort==='price-asc')  q = q.order('price', {ascending:true})
    else if (sort==='price-desc') q = q.order('price', {ascending:false})
    else if (sort==='rating')     q = q.order('rating', {ascending:false})
    else q = q.order('created_at', {ascending:false})
    const { data, error, count } = await q.range(offset, offset+limit-1)
    if (error) throw error
    return { data: data||[], count: count||0 }
  },
  async getById(id) {
    const { data, error } = await supabase.from('products').select('*, categories!category_id(name,slug)').eq('id',id).single()
    if (error) throw error
    return data
  },
  async getFeatured(limit=8) {
    const { data } = await supabase.from('products').select('*, categories!category_id(name,slug)').eq('status','active').eq('featured',true).limit(limit)
    return data||[]
  },
  async getBestSellers(limit=8) {
    const { data } = await supabase.from('products').select('*, categories!category_id(name,slug)').eq('status','active').eq('best_seller',true).limit(limit)
    return data||[]
  },
  async getNewArrivals(limit=8) {
    const { data } = await supabase.from('products').select('*, categories!category_id(name,slug)').eq('status','active').eq('new_arrival',true).order('created_at',{ascending:false}).limit(limit)
    return data||[]
  },
  async getRelated(productId, categoryId, limit=4) {
    const { data } = await supabase.from('products').select('*, categories!category_id(name,slug)').eq('status','active').eq('category_id',categoryId).neq('id',productId).limit(limit)
    return data||[]
  },
  async search(query, limit=8) {
    const { data } = await supabase.from('products').select('id,name,price,images,emoji').eq('status','active').ilike('name',`%${query}%`).limit(limit)
    return data||[]
  },
  async create(payload) { const { data, error } = await supabase.from('products').insert([payload]).select().single(); if(error) throw error; return data },
  async update(id, payload) { const { data, error } = await supabase.from('products').update(payload).eq('id',id).select().single(); if(error) throw error; return data },
  async delete(id) { const { error } = await supabase.from('products').delete().eq('id',id); if(error) throw error },
}
