import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
export const useCategories = () => useQuery({ queryKey:['categories'], queryFn:categoryService.getAll, staleTime:1000*60*10 })
