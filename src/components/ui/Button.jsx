import { Loader2 } from 'lucide-react'
export default function Button({ children, variant='primary', size='md', loading=false, icon, className='', ...props }) {
  const v = { primary:'btn-primary', secondary:'btn-secondary', outline:'btn-outline', danger:'btn-danger', ghost:'btn-ghost', whatsapp:'btn bg-[#25D366] hover:bg-[#20bd5a] text-white' }
  const s = { sm:'btn-sm', md:'', lg:'btn-lg' }
  return (
    <button disabled={loading||props.disabled} className={`${v[variant]} ${s[size]} ${className}`} {...props}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
