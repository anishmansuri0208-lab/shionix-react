import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Ticket, Warehouse, CreditCard, Star, Image, Bell, Settings, BarChart3, LogOut, ChevronLeft, ChevronRight, Layers, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const NAV = [
  { section:'Overview', items:[{to:'/admin',icon:LayoutDashboard,label:'Dashboard',end:true},{to:'/admin/analytics',icon:BarChart3,label:'Analytics'}]},
  { section:'Commerce', items:[{to:'/admin/products',icon:Package,label:'Products'},{to:'/admin/categories',icon:Layers,label:'Categories'},{to:'/admin/orders',icon:ShoppingCart,label:'Orders'},{to:'/admin/customers',icon:Users,label:'Customers'}]},
  { section:'Marketing', items:[{to:'/admin/coupons',icon:Ticket,label:'Coupons'},{to:'/admin/banners',icon:Image,label:'Banners'},{to:'/admin/notifications',icon:Bell,label:'Notifications'}]},
  { section:'Finance', items:[{to:'/admin/inventory',icon:Warehouse,label:'Inventory'},{to:'/admin/payments',icon:CreditCard,label:'Payments'},{to:'/admin/reviews',icon:Star,label:'Reviews'}]},
  { section:'System', items:[{to:'/admin/settings',icon:Settings,label:'Settings'}]},
]

const PAGE_TITLES = {'/admin':'Dashboard','/admin/analytics':'Analytics','/admin/products':'Products','/admin/categories':'Categories','/admin/orders':'Orders','/admin/customers':'Customers','/admin/coupons':'Coupons','/admin/banners':'Banners','/admin/notifications':'Notifications','/admin/inventory':'Inventory','/admin/payments':'Payments','/admin/reviews':'Reviews','/admin/settings':'Settings'}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile, logout } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = async () => { await logout(); navigate('/admin/login') }

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center h-16 px-4 border-b border-[var(--border)] flex-shrink-0 ${collapsed?'justify-center':''}`}>
        <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0"><span className="text-white font-black text-sm">S</span></div>
        {!collapsed && <div className="ml-3"><div className="font-display font-black text-sm">SHIONIX</div><div className="text-[10px] text-brand-500 font-semibold uppercase tracking-widest">Admin</div></div>}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {NAV.map(({section,items})=>(
          <div key={section}>
            {!collapsed && <p className="px-3 mb-1 text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest">{section}</p>}
            <div className="space-y-0.5">
              {items.map(({to,icon:Icon,label,end})=>(
                <NavLink key={to} to={to} end={end} title={collapsed?label:''}
                  className={({isActive})=>`nav-link ${isActive?'active':''} ${collapsed?'justify-center px-2':''}`}>
                  <Icon size={18} className="flex-shrink-0"/>
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-[var(--border)] p-2 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-[var(--bg3)]">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase()||'A'}</div>
            <div className="min-w-0"><p className="text-xs font-semibold truncate">{profile?.full_name||'Admin'}</p><p className="text-[10px] text-brand-500 font-medium">Administrator</p></div>
          </div>
        )}
        <button onClick={handleLogout} className={`nav-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 ${collapsed?'justify-center px-2':''}`}>
          <LogOut size={16} className="flex-shrink-0"/>{!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={()=>setMobileOpen(false)}/>}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full flex-col bg-[var(--bg2)] border-r border-[var(--border)] z-40 transition-all duration-300 ${collapsed?'w-16':'w-60'}`}>
        <SidebarContent collapsed={collapsed}/>
        <button onClick={()=>setCollapsed(c=>!c)} className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center shadow-sm text-[var(--text2)] transition-shadow">
          {collapsed?<ChevronRight size={13}/>:<ChevronLeft size={13}/>}
        </button>
      </aside>
      {mobileOpen && (
        <aside className="lg:hidden fixed left-0 top-0 h-full w-60 bg-[var(--bg2)] border-r border-[var(--border)] z-40">
          <SidebarContent collapsed={false}/>
        </aside>
      )}
      <div className={`transition-all duration-300 ${collapsed?'lg:ml-16':'lg:ml-60'}`}>
        <header className="h-16 bg-[var(--bg2)] border-b border-[var(--border)] flex items-center px-6 gap-4 sticky top-0 z-20">
          <button onClick={()=>setMobileOpen(o=>!o)} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg3)]">{mobileOpen?<X size={18}/>:<Menu size={18}/>}</button>
          <h1 className="font-display font-semibold text-base flex-1">{PAGE_TITLES[pathname]||'Admin'}</h1>
          <button onClick={toggle} className="p-2 rounded-xl hover:bg-[var(--bg3)] transition-colors text-[var(--text2)]">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
        </header>
        <main className="p-6"><Outlet/></main>
      </div>
    </div>
  )
}
