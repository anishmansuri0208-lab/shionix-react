import { supabase } from '@/lib/supabase'

// Supabase Edge Function ke through Shiprocket order create karo
export async function createShiprocketOrder(order) {
  try {
    const { data, error } = await supabase.functions.invoke('shiprocket', {
      body: order,
    })
    if (error) throw error
    console.log('Shiprocket order created:', data)
    return data
  } catch (err) {
    console.error('Shiprocket error:', err)
    throw err
  }
}
