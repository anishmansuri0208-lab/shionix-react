import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Globe, Phone, Package, CreditCard, Shield, Save } from 'lucide-react'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const TABS=[
  {key:'general',label:'General',icon:Globe},
  {key:'contact',label:'Contact',icon:Phone},
  {key:'shipping',label:'Shipping',icon:Package},
  {key:'payment',label:'Payment',icon:CreditCard},
  {key:'security',label:'Security',icon:Shield},
]

export default function AdminSettings() {
  const [tab, setTab] = useState('general')
  const [cod, setCod] = useState(true)
  const [maintenance, setMaintenance] = useState(false)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset } = useForm()

  // Load settings from database
  useEffect(() => {
    supabase.from('settings').select('key,value')
      .then(({ data }) => {
        if (data) {
          const s = {}
          data.forEach(r => { s[r.key] = r.value })
          reset({
            site_name:          s.site_name          || 'Shionix',
            tagline:            s.tagline            || 'Smart Products, Smart Shopping',
            email:              s.email              || 'support@shionix.in',
            phone:              s.phone              || '+91 98765 43210',
            whatsapp:           s.whatsapp           || '+91 98765 43210',
            instagram:          s.instagram          || '',
            facebook:           s.facebook           || '',
            shipping_charge:    s.shipping_charge    || '79',
            free_shipping_above:s.free_shipping_above|| '999',
            tax_percent:        s.tax_percent        || '18',
            razorpay_key:       s.razorpay_key       || '',
            address:            s.address            || '',
          })
          setCod(s.cod_enabled !== 'false')
          setMaintenance(s.maintenance_mode === 'true')
        }
        setLoading(false)
      })
  }, [])

  const onSave = async (data) => {
    try {
      const entries = [
        ...Object.entries(data).map(([key, value]) => ({ key, value: String(value) })),
        { key: 'cod_enabled', value: String(cod) },
        { key: 'maintenance_mode', value: String(maintenance) },
      ]
      const { error } = await supabase.from('settings').upsert(entries)
      if (error) throw error
      toast.success('Settings saved!')
    } catch (err) {
      toast.error('Failed to save: ' + err.message)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"/>
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap gap-2">
        {TABS.map(({key,label,icon:Icon})=>(
          <button key={key} onClick={()=>setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab===key?'bg-brand-500 text-white shadow-md':'card border border-[var(--border)] text-[var(--text2)] hover:border-brand-500'}`}>
            <Icon size={14}/> {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        {tab==='general' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-semibold border-b border-[var(--border)] pb-3">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Website Name" {...register('site_name')}/>
              <Input label="Tagline" {...register('tagline')}/>
              <Input label="Instagram URL" placeholder="https://instagram.com/..." {...register('instagram')}/>
              <Input label="Facebook URL" placeholder="https://facebook.com/..." {...register('facebook')}/>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl border ${maintenance?'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800':'bg-[var(--bg3)] border-[var(--border)]'}`}>
              <div>
                <p className="font-semibold text-sm text-red-600 dark:text-red-400">Maintenance Mode</p>
                <p className="text-xs text-[var(--text3)] mt-0.5">Visitors will see a maintenance page.</p>
              </div>
              <Toggle checked={maintenance} onChange={setMaintenance}/>
            </div>
          </div>
        )}

        {tab==='contact' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-semibold border-b border-[var(--border)] pb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Support Email" type="email" {...register('email')}/>
              <Input label="Phone Number" placeholder="+91 98765 43210" {...register('phone')}/>
              <Input label="WhatsApp Number (with country code)" placeholder="919876543210" {...register('whatsapp')}/>
              <Input label="Address" placeholder="City, State, India" {...register('address')}/>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                ⚠️ WhatsApp Number format: <strong>919876543210</strong> (91 + 10 digit number, no spaces or +)
              </p>
            </div>
          </div>
        )}

        {tab==='shipping' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-semibold border-b border-[var(--border)] pb-3">Shipping Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Shipping Charge (₹)" type="number" min="0" {...register('shipping_charge')}/>
              <Input label="Free Shipping Above (₹)" type="number" min="0" {...register('free_shipping_above')}/>
              <Input label="GST / Tax (%)" type="number" min="0" max="100" {...register('tax_percent')}/>
            </div>
          </div>
        )}

        {tab==='payment' && (
          <div className="card p-6 space-y-5">
            <h3 className="font-display font-semibold border-b border-[var(--border)] pb-3">Payment Settings</h3>
            <div className="flex items-center justify-between p-4 bg-[var(--bg3)] rounded-xl">
              <div>
                <p className="font-semibold text-sm">Cash on Delivery</p>
                <p className="text-xs text-[var(--text3)]">Allow customers to pay on delivery</p>
              </div>
              <Toggle checked={cod} onChange={setCod}/>
            </div>
            <Input label="Razorpay Key ID" placeholder="rzp_live_xxxxxxxxxx" className="font-mono" {...register('razorpay_key')}/>
          </div>
        )}

        {tab==='security' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-semibold border-b border-[var(--border)] pb-3">Security Settings</h3>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <Shield size={16} className="text-green-500"/>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">Account protected with Supabase Auth</p>
            </div>
            <Input label="New Password" type="password" placeholder="Min 8 characters"/>
            <Input label="Confirm Password" type="password" placeholder="Re-enter password"/>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button type="submit" className="btn-primary btn px-8">
            <Save size={16}/> Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
