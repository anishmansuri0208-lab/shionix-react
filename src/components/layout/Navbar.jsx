import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Sun, Moon, Search, Menu, X, User, LogOut, Package, ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useDebounce } from '@/hooks/useDebounce'
import { productService } from '@/services/productService'
import { formatPrice } from '@/utils/formatters'

const NAV_LINKS = [
  { to:'/', label:'Home' },{ to:'/shop', label:'Shop' },
  { to:'/categories', label:'Categories' },{ to:'/about', label:'About' },{ to:'/contact', label:'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [profileOpen, setProfileOpen] = useState(false)
  const debouncedQ = useDebounce(searchQ, 350)
  const { dark, toggle } = useThemeStore()
  const { user, profile, logout } = useAuthStore()
  const cartCount = useCartStore(s => s.items.reduce((a,i) => a+i.qty, 0))
  const wishlistCount = useWishlistStore(s => s.ids.length)
  const navigate = useNavigate()
  const profileRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!debouncedQ.trim()) { setSearchResults([]); return }
    productService.search(debouncedQ).then(setSearchResults).catch(()=>{})
  }, [debouncedQ])

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`); setSearchOpen(false); setSearchQ('') }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled?'bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm':'bg-[var(--bg)]/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 gap-4">
            <Link to="/" className="flex-shrink-0">
              <span className="font-display font-black text-xl tracking-tight">Shio<span className="text-brand-500">nix</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {NAV_LINKS.map(l => <Link key={l.to} to={l.to} className="px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-all">{l.label}</Link>)}
            </nav>
            <div className="flex-1"/>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors text-[var(--text2)] hidden sm:flex"><Search size={18}/></button>
              <button onClick={toggle} className="p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors text-[var(--text2)]">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
              <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors text-[var(--text2)]">
                <Heart size={18}/>
                {wishlistCount>0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors text-[var(--text2)]">
                <ShoppingBag size={18}/>
                {cartCount>0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(o=>!o)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[var(--bg3)] transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold">{profile?.full_name?.[0]?.toUpperCase()||'U'}</div>
                    <span className="hidden md:block text-sm font-medium max-w-[80px] truncate">{profile?.full_name?.split(' ')[0]||'User'}</span>
                    <ChevronDown size={14} className="text-[var(--text3)]"/>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                        <p className="font-semibold text-sm">{profile?.full_name||'User'}</p>
                        <p className="text-xs text-[var(--text3)] truncate">{user.email}</p>
                      </div>
                      {[{to:'/profile',icon:User,label:'My Profile'},{to:'/orders',icon:Package,label:'My Orders'},{to:'/wishlist',icon:Heart,label:'Wishlist'}].map(item=>(
                        <Link key={item.to} to={item.to} onClick={()=>setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)] transition-colors">
                          <item.icon size={15}/>{item.label}
                        </Link>
                      ))}
                      <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button onClick={()=>{logout();setProfileOpen(false)}} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                          <LogOut size={15}/>Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost btn text-sm px-3 py-2">Login</Link>
                  <Link to="/signup" className="btn-primary btn text-sm px-4 py-2">Sign Up</Link>
                </div>
              )}
              <button onClick={()=>setMobileOpen(o=>!o)} className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors">
                {mobileOpen?<X size={18}/>:<Menu size={18}/>}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(l => <Link key={l.to} to={l.to} onClick={()=>setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)] transition-colors">{l.label}</Link>)}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={()=>setMobileOpen(false)} className="btn-secondary btn flex-1 justify-center text-sm py-2.5">Login</Link>
                  <Link to="/signup" onClick={()=>setMobileOpen(false)} className="btn-primary btn flex-1 justify-center text-sm py-2.5">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-start justify-center pt-20 px-4" onClick={e=>{if(e.target===e.currentTarget){setSearchOpen(false);setSearchQ('')}}}>
          <div className="w-full max-w-2xl animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text3)]"/>
              <input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search for products…"
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl pl-14 pr-14 py-5 text-lg text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-brand-500 shadow-2xl"/>
              <button type="button" onClick={()=>{setSearchOpen(false);setSearchQ('')}} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]"><X size={20}/></button>
            </form>
            {searchResults.length>0 && (
              <div className="card mt-2 shadow-2xl overflow-hidden">
                {searchResults.map(p=>(
                  <Link key={p.id} to={`/product/${p.id}`} onClick={()=>{setSearchOpen(false);setSearchQ('')}}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg3)] transition-colors border-b border-[var(--border)] last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg3)] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {p.images?.[0]?<img src={p.images[0]} className="w-full h-full object-cover" alt=""/>:<span className="text-2xl">{p.emoji||'📦'}</span>}
                    </div>
                    <p className="flex-1 text-sm font-medium truncate">{p.name}</p>
                    <p className="text-sm font-bold text-brand-500 flex-shrink-0">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
