import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="font-display font-black text-8xl text-brand-500 mb-4">404</div>
      <h1 className="font-display font-bold text-3xl mb-3">Page Not Found</h1>
      <p className="text-[var(--text3)] mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3"><Link to="/" className="btn-primary btn">Go Home</Link><Link to="/shop" className="btn-outline btn">Shop Products</Link></div>
    </div>
  )
}
