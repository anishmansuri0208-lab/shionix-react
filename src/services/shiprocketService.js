// Shiprocket API Service
const SHIPROCKET_EMAIL = import.meta.env.VITE_SHIPROCKET_EMAIL
const SHIPROCKET_PASSWORD = import.meta.env.VITE_SHIPROCKET_PASSWORD
const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

// Get Shiprocket Token
async function getToken() {
  const cached = sessionStorage.getItem('sr_token')
  const expiry = sessionStorage.getItem('sr_token_expiry')
  
  // Use cached token if not expired
  if (cached && expiry && Date.now() < Number(expiry)) {
    return cached
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Shiprocket login failed')
  
  // Cache token for 9 days
  sessionStorage.setItem('sr_token', data.token)
  sessionStorage.setItem('sr_token_expiry', String(Date.now() + 9 * 24 * 60 * 60 * 1000))
  
  return data.token
}

// Create order on Shiprocket
export async function createShiprocketOrder(order) {
  try {
    const token = await getToken()
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []

    const payload = {
      order_id: order.id,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: 'Primary',
      channel_id: '',
      comment: 'Shionix Order',
      billing_customer_name: order.customer_name,
      billing_last_name: '',
      billing_address: order.address,
      billing_address_2: '',
      billing_city: order.city,
      billing_pincode: order.pin_code,
      billing_state: order.state,
      billing_country: 'India',
      billing_email: order.customer_email || '',
      billing_phone: order.customer_phone,
      shipping_is_billing: true,
      shipping_customer_name: order.customer_name,
      shipping_last_name: '',
      shipping_address: order.address,
      shipping_address_2: '',
      shipping_city: order.city,
      shipping_pincode: order.pin_code,
      shipping_country: 'India',
      shipping_state: order.state,
      shipping_email: order.customer_email || '',
      shipping_phone: order.customer_phone,
      order_items: items.map(item => ({
        name: item.name,
        sku: item.sku || item.id,
        units: item.qty,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: '',
      })),
      payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: order.shipping || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: order.subtotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    }

    const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log('Shiprocket order created:', data)
    return data

  } catch (err) {
    console.error('Shiprocket error:', err)
    throw err
  }
}
