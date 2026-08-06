export default function EmptyState({ icon:Icon, title, description, action, onAction, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && <div className="p-5 bg-[var(--bg3)] rounded-2xl mb-5 text-[var(--text3)]"><Icon size={36}/></div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text3)] max-w-sm mb-6">{description}</p>}
      {action || (onAction && <button onClick={onAction} className="btn-primary btn">{actionLabel}</button>)}
    </div>
  )
}
