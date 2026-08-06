import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/Skeleton'
export default function Categories() {
  const { data: categories=[], isLoading } = useCategories()
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display font-bold text-3xl mb-2">Shop By Category</h1>
      <p className="text-[var(--text3)] mb-10">Browse our wide range of smart product categories</p>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">{Array.from({length:8}).map((_,i)=><Skeleton key={i} className="h-48 rounded-2xl"/>)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map(cat=>(
            <Link key={cat.id} to={`/shop?category=${cat.slug}`}
              className="card p-8 flex flex-col items-center text-center hover:border-brand-500 hover:-translate-y-1 transition-all cursor-pointer h-48 justify-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-3xl mb-4 overflow-hidden">
                {cat.image_url?<img src={cat.image_url} className="w-full h-full object-cover rounded-2xl" alt={cat.name}/>:cat.emoji||'📦'}
              </div>
              <h3 className="font-bold text-base mb-1">{cat.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
