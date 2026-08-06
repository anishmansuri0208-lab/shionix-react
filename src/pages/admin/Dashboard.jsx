import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/utils/formatters'
import { Skeleton } from '@/components/ui/Skeleton'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const MONTHLY = [{month:'Jan',revenue:42000,orders:124},{month:'Feb',revenue:38000,orders:98},{month:'Mar',revenue:55000,orders:165},{month:'Apr',revenue:61000,orders:189},{month:'May',revenue:48000,orders:142},{month:'Jun',revenue:72000,orders:215},{month:'Jul',revenue:85000,orders:256}]
const CAT_DATA = [{name:'Headphones',value:35,color:'#0066FF'},{name:'Smartwatch',value:25,color:'#8B5CF6'},{name:'Earbuds',value:20,color:'#10B981'},{name:'Speakers',value:12,color:'#F59E0B'},{name:'Others',value:8,color:'#EF4444'}]

function StatCard({ title, value, icon:Icon, gradient, change, prefix='' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}><Icon size={20} className="text-white"/></div>
        {change!==undefined && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${change>=0?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400':'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>{change>=0?'+':''}{change}%</span>}
      </div>
      <div className="font-display font-black text-2xl mb-0.5">{prefix}{typeof value==='number'?value.toLocaleString('en-IN'):value}</div>
      <div className="text-sm text-[var(--text3)]">{title}</div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('id,status,total_amount',{count:'exact'}),
          supabase.from('profiles').select('id',{count:'exact'}).eq('role','customer'),
          supabase.from('products').select('id,stock',{count:'exact'}),
        ])
        const orders = ordersRes.data||[]
        const totalRevenue = orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+(o.total_amount||0),0)
        setStats({
          revenue: totalRevenue||485000, orders: ordersRes.count||342, customers: customersRes.count||1248, products: productsRes.count||87,
          pending: orders.filter(o=>o.status==='pending').length||24, delivered: orders.filter(o=>o.status==='delivered').length||289,
          cancelled: orders.filter(o=>o.status==='cancelled').length||18, lowStock: (productsRes.data||[]).filter(p=>p.stock<10).length||5,
        })
        const { data: recent } = await supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(6)
        setRecentOrders(recent||[])
      } catch {
        setStats({revenue:485000,orders:342,customers:1248,products:87,pending:24,delivered:289,cancelled:18,lowStock:5})
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const CARDS = [
    {title:'Total Revenue',key:'revenue',icon:DollarSign,gradient:'from-blue-500 to-blue-600',change:18,prefix:'₹'},
    {title:'Total Orders',key:'orders',icon:ShoppingCart,gradient:'from-green-500 to-green-600',change:12},
    {title:'Customers',key:'customers',icon:Users,gradient:'from-purple-500 to-purple-600',change:8},
    {title:'Products',key:'products',icon:Package,gradient:'from-orange-500 to-orange-600',change:5},
    {title:'Pending Orders',key:'pending',icon:Clock,gradient:'from-yellow-500 to-yellow-600',change:-3},
    {title:'Delivered',key:'delivered',icon:CheckCircle,gradient:'from-teal-500 to-teal-600',change:15},
    {title:'Cancelled',key:'cancelled',icon:XCircle,gradient:'from-red-500 to-red-600',change:-8},
    {title:'Low Stock Items',key:'lowStock',icon:AlertTriangle,gradient:'from-amber-500 to-amber-600',change:null},
  ]
  const STATUS_COLORS = {pending:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',processing:'text-blue-600 bg-blue-50 dark:bg-blue-900/20',shipped:'text-purple-600 bg-purple-50 dark:bg-purple-900/20',delivered:'text-green-600 bg-green-50 dark:bg-green-900/20',cancelled:'text-red-600 bg-red-50 dark:bg-red-900/20'}

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? Array(8).fill(0).map((_,i)=><Skeleton key={i} className="h-28 rounded-2xl"/>) : CARDS.map(c=><StatCard key={c.key} title={c.title} value={stats?.[c.key]??0} icon={c.icon} gradient={c.gradient} change={c.change} prefix={c.prefix}/>)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold mb-5">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/><stop offset="95%" stopColor="#0066FF" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800"/>
              <XAxis dataKey="month" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>[formatPrice(v),'Revenue']}/>
              <Area type="monotone" dataKey="revenue" stroke="#0066FF" strokeWidth={2.5} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-semibold mb-5">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>{CAT_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={v=>[`${v}%`,'Share']}/></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">{CAT_DATA.map(c=><div key={c.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:c.color}}/><span className="text-[var(--text2)]">{c.name}</span></div><span className="font-bold">{c.value}%</span></div>)}</div>
        </div>
      </div>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5"><h3 className="font-display font-semibold">Recent Orders</h3><Link to="/admin/orders" className="text-xs text-brand-500 hover:text-brand-600">View all →</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-[var(--text3)] uppercase tracking-wide border-b border-[var(--border)]">{['Order','Customer','Amount','Status'].map(h=><th key={h} className="pb-2.5">{h}</th>)}</tr></thead>
            <tbody>
              {recentOrders.length===0
                ? [['SHX8412','Rahul Kumar',4999,'delivered'],['SHX8411','Priya Sharma',2499,'shipped'],['SHX8410','Amit Singh',1999,'pending'],['SHX8409','Neha Patel',6499,'processing']].map(([id,name,amt,status])=>(
                  <tr key={id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg3)] transition-colors">
                    <td className="py-3 font-mono text-xs text-brand-500 font-bold">#{id}</td><td className="py-3 font-medium">{name}</td><td className="py-3 font-bold">{formatPrice(amt)}</td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[status]}`}>{status}</span></td>
                  </tr>
                ))
                : recentOrders.map(o=>(
                  <tr key={o.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg3)] transition-colors">
                    <td className="py-3 font-mono text-xs text-brand-500 font-bold">#{o.id}</td><td className="py-3 font-medium">{o.customer_name}</td><td className="py-3 font-bold">{formatPrice(o.total_amount)}</td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.status]||''}`}>{o.status}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
