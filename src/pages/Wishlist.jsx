import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import ProductGrid from '@/components/home/ProductGrid'
import EmptyState from '@/components/ui/EmptyState'
import { Link } from 'react-router-dom'
export default function Wishlist() {
  const { ids } = useWishlistStore()
  const { data: products=[], isLoading } = useQuery({
    queryKey: ['wishlist-products', ids],
    queryFn: async () => { if(ids.length===0) return []; const r=await Promise.all(ids.map(id=>productService.getById(id).catch(()=>null))); return r.filter(Boolean) },
    enabled: ids.length>0,
  })
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display font-bold text-3xl mb-8">My Wishlist {ids.length>0&&`(${ids.length})`}</h1>
      {ids.length===0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save products you love to buy them later." action={<Link to="/shop" className="btn-primary btn">Discover Products</Link>}/>
      ) : (
        <ProductGrid products={products} loading={isLoading} cols={4}/>
      )}
    </div>
  )
}
