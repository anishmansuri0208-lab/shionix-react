import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
export const useProducts = (filters={}) => useQuery({ queryKey:['products',filters], queryFn:()=>productService.getAll(filters), staleTime:1000*60*5 })
export const useProduct = (id) => useQuery({ queryKey:['product',id], queryFn:()=>productService.getById(id), enabled:!!id })
export const useFeaturedProducts = () => useQuery({ queryKey:['featured'], queryFn:()=>productService.getFeatured() })
export const useBestSellers = () => useQuery({ queryKey:['bestsellers'], queryFn:()=>productService.getBestSellers() })
export const useNewArrivals = () => useQuery({ queryKey:['new-arrivals'], queryFn:()=>productService.getNewArrivals() })
