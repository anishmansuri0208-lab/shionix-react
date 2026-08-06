export function Skeleton({ className='' }) { return <div className={`skeleton ${className}`} /> }
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-2/5 mt-1" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  )
}
export function TableSkeleton({ rows=5, cols=4 }) {
  return (
    <div className="space-y-3">
      {Array.from({length:rows}).map((_,i) => (
        <div key={i} className="flex gap-4">
          {Array.from({length:cols}).map((_,j) => <Skeleton key={j} className="h-10 flex-1" />)}
        </div>
      ))}
    </div>
  )
}
