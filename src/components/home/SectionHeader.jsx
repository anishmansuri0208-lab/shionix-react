import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
export default function SectionHeader({ eyebrow, title, subtitle, linkTo, linkLabel='View All' }) {
  return (
    <div className="flex items-end justify-between mb-10 gap-4">
      <div>
        {eyebrow && <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">{eyebrow}</p>}
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text)]">{title}</h2>
        {subtitle && <p className="text-[var(--text3)] mt-2">{subtitle}</p>}
      </div>
      {linkTo && <Link to={linkTo} className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors flex-shrink-0 group">{linkLabel}<ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform"/></Link>}
    </div>
  )
}
