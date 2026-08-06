export default function Toggle({ checked, onChange, label, size='md' }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e=>onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked?'bg-brand-500':'bg-gray-300 dark:bg-gray-600'}`} />
        <div className={`absolute w-5 h-5 top-0.5 left-0.5 rounded-full bg-white shadow transition-transform ${checked?'translate-x-5':''}`} />
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  )
}
