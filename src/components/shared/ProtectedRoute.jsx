import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] gap-4">
      <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
        <span className="text-white font-black text-xl">S</span>
      </div>
      <Loader2 size={24} className="animate-spin text-brand-500"/>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  const location = useLocation()
  if (loading) return <LoadingScreen/>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace/>
  return children
}

export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuthStore()
  const location = useLocation()
  if (loading) return <LoadingScreen/>
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  if (!isAdmin) return <Navigate to="/" replace/>
  return children
}
