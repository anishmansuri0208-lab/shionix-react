import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import ProductCard from '@/components/product/ProductCard'
import EmptyState from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'

export default function ProductGrid({ products, loading, cols=4, skeletonCount=8 }) {
  const gridCols = { 2:'grid-cols-1 sm:grid-cols-2', 3:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4:'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }
  if (loading) return <div className={`grid ${gridCols[cols]} gap-5`}>{Array.from({length:skeletonCount}).map((_,i)=><ProductCardSkeleton key={i}/>)}</div>
  if (!products?.length) return <EmptyState icon={Package} title="No products found" description="Try adjusting your filters."/>
  return <div className={`grid ${gridCols[cols]} gap-5`}>{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>
}
