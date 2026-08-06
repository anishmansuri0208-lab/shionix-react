import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { useAuthStore } from '@/store/authStore'
export const useMyOrders = () => {
  const { user } = useAuthStore()
  return useQuery({ queryKey:['my-orders',user?.id], queryFn:()=>orderService.getByCustomer(user.id), enabled:!!user?.id })
}
