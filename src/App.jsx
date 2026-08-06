import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { ProtectedRoute, AdminRoute } from '@/components/shared/ProtectedRoute'

import MainLayout  from '@/components/layout/MainLayout'
import AdminLayout from '@/components/layout/AdminLayout'

import Home          from '@/pages/Home'
import Shop          from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Categories    from '@/pages/Categories'
import About         from '@/pages/About'
import Contact       from '@/pages/Contact'
import Login         from '@/pages/Login'
import Signup        from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import Terms         from '@/pages/Terms'
import NotFound      from '@/pages/NotFound'
import TrackOrder    from '@/pages/TrackOrder'
import Cart          from '@/pages/Cart'
import Checkout      from '@/pages/Checkout'
import Orders        from '@/pages/Orders'
import Wishlist      from '@/pages/Wishlist'
import Profile       from '@/pages/Profile'

import AdminLogin         from '@/pages/admin/AdminLogin'
import Dashboard          from '@/pages/admin/Dashboard'
import AdminProducts      from '@/pages/admin/AdminProducts'
import AdminCategories    from '@/pages/admin/AdminCategories'
import AdminOrders        from '@/pages/admin/AdminOrders'
import AdminCustomers     from '@/pages/admin/AdminCustomers'
import AdminCoupons       from '@/pages/admin/AdminCoupons'
import AdminInventory     from '@/pages/admin/AdminInventory'
import AdminPayments      from '@/pages/admin/AdminPayments'
import AdminReviews       from '@/pages/admin/AdminReviews'
import AdminBanners       from '@/pages/admin/AdminBanners'
import AdminNotifications from '@/pages/admin/AdminNotifications'
import AdminAnalytics     from '@/pages/admin/AdminAnalytics'
import AdminSettings      from '@/pages/admin/AdminSettings'

export default function App() {
  const { initialize } = useAuthStore()
  const { init }       = useThemeStore()
  useEffect(() => { init(); initialize() }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/"             element={<Home/>}/>
          <Route path="/shop"         element={<Shop/>}/>
          <Route path="/product/:id"  element={<ProductDetail/>}/>
          <Route path="/categories"   element={<Categories/>}/>
          <Route path="/about"        element={<About/>}/>
          <Route path="/contact"      element={<Contact/>}/>
          <Route path="/track-order"  element={<TrackOrder/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/terms"        element={<Terms/>}/>
          <Route path="/login"        element={<Login/>}/>
          <Route path="/signup"       element={<Signup/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/cart"         element={<Cart/>}/>
          <Route path="/wishlist"     element={<Wishlist/>}/>
          <Route path="/checkout"     element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
          <Route path="/orders"       element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
          <Route path="/profile"      element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        </Route>

        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
          <Route index                element={<Dashboard/>}/>
          <Route path="analytics"     element={<AdminAnalytics/>}/>
          <Route path="products"      element={<AdminProducts/>}/>
          <Route path="categories"    element={<AdminCategories/>}/>
          <Route path="orders"        element={<AdminOrders/>}/>
          <Route path="customers"     element={<AdminCustomers/>}/>
          <Route path="coupons"       element={<AdminCoupons/>}/>
          <Route path="inventory"     element={<AdminInventory/>}/>
          <Route path="payments"      element={<AdminPayments/>}/>
          <Route path="reviews"       element={<AdminReviews/>}/>
          <Route path="banners"       element={<AdminBanners/>}/>
          <Route path="notifications" element={<AdminNotifications/>}/>
          <Route path="settings"      element={<AdminSettings/>}/>
        </Route>

        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}
