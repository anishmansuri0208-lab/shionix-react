import { forwardRef } from 'react'
const Input = forwardRef(function Input({ label, error, icon, className='', ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text2)] mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)]">{icon}</span>}
        <input ref={ref} className={`input ${icon?'pl-10':''} ${error?'border-red-500':''} ${className}`} {...props} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
})
export default Input
