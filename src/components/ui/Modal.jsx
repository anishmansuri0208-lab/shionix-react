import { useEffect } from 'react'
import { X } from 'lucide-react'
export default function Modal({ open, onClose, title, children, size='md' }) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  useEffect(() => { const h=(e)=>{ if(e.key==='Escape') onClose() }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h) }, [onClose])
  if (!open) return null
  const sizes = { sm:'max-w-sm', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative card w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold font-display">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg3)] transition-colors"><X size={18}/></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
