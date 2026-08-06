import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'
export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger=false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3 mb-6">
        <div className={`p-2 rounded-xl ${danger?'bg-red-100 dark:bg-red-900/20':'bg-yellow-100 dark:bg-yellow-900/20'} flex-shrink-0`}>
          <AlertTriangle size={18} className={danger?'text-red-500':'text-yellow-500'}/>
        </div>
        <p className="text-sm text-[var(--text2)] leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary btn">Cancel</button>
        <button onClick={()=>{onConfirm();onClose()}} className={danger?'btn-danger btn':'btn-primary btn'}>Confirm</button>
      </div>
    </Modal>
  )
}
