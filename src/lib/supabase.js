import { createClient } from '@supabase/supabase-js'
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || ''
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { persistSession: true, autoRefreshToken: true },
})
export const BUCKETS = { PRODUCTS:'product-images', BANNERS:'banner-images', AVATARS:'avatars', CATEGORIES:'category-images' }
export async function uploadFile(bucket, file, folder='') {
  const ext = file.name.split('.').pop()
  const { data, error } = await supabase.storage.from(bucket).upload(`${folder}/${Date.now()}.${ext}`, file)
  if (error) throw error
  const { data: u } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { path: data.path, url: u.publicUrl }
}
