import { Star } from 'lucide-react'
export default function Stars({ rating=0, size=14, showNum=false, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({length:5}).map((_,i) => (
          <Star key={i} size={size} className={i<Math.round(rating)?'fill-yellow-400 text-yellow-400':'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'} />
        ))}
      </div>
      {showNum && <span className="text-sm font-bold">{rating}</span>}
      {count!==undefined && <span className="text-xs text-[var(--text3)]">({Number(count).toLocaleString('en-IN')})</span>}
    </div>
  )
}
