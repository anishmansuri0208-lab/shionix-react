import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice } from '@/utils/formatters'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import toast from 'react-hot-toast'

const MONTHLY = [{month:'Jan',revenue:42000,orders:124,customers:45},{month:'Feb',revenue:38000,orders:98,customers:32},{month:'Mar',revenue:55000,orders:165,customers:67},{month:'Apr',revenue:61000,orders:189,customers:78},{month:'May',revenue:48000,orders:142,customers:54},{month:'Jun',revenue:72000,orders:215,customers:92},{month:'Jul',revenue:85000,orders:256,customers:110}]
const TOP_PRODUCTS = [{name:'AirPods Ultra Pro',sales:512,revenue:102400},{name:'Pro ANC Headphones',sales:234,revenue:116766},{name:'SmartWatch X Pro',sales:189,revenue:47250},{name:'Wireless Neckband Pro',sales:302,revenue:39160},{name:'GamePad Pro X',sales:156,revenue:43700}]

export default function AdminAnalytics() {
  const exportCSV = () => {
    const csv = Papa.unparse(MONTHLY.map(d=>({Month:d.month,Revenue:`Rs.${d.revenue}`,Orders:d.orders,Customers:d.customers})))
    const a = document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='shionix-report.csv'; a.click()
    toast.success('CSV exported!')
  }
  const exportPDF = () => {
    const doc = new jsPDF(); doc.setFontSize(18); doc.setTextColor(0,102,255); doc.text('SHIONIX',14,20); doc.setFontSize(12); doc.setTextColor(0); doc.text('Sales Report — 2026',14,30)
    autoTable(doc,{startY:40,head:[['Month','Revenue','Orders','Customers']],body:MONTHLY.map(d=>[d.month,formatPrice(d.revenue),d.orders,d.customers]),headStyles:{fillColor:[0,102,255]}})
    doc.save('shionix-report.pdf'); toast.success('PDF exported!')
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-3 justify-end">
        <button onClick={exportCSV} className="btn-secondary btn"><Download size={14}/> Export CSV</button>
        <button onClick={exportPDF} className="btn-secondary btn"><Download size={14}/> Export PDF</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{label:'Total Revenue',value:formatPrice(401000),change:18,up:true},{label:'Total Orders',value:'1,189',change:12,up:true},{label:'New Customers',value:'478',change:8,up:true},{label:'Avg Order Value',value:formatPrice(3372),change:-2,up:false}].map(k=>(
          <div key={k.label} className="card p-4">
            <div className="font-display font-black text-xl mb-1">{k.value}</div>
            <div className="text-sm text-[var(--text3)] mb-2">{k.label}</div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${k.up?'text-green-500':'text-red-500'}`}>{k.up?<TrendingUp size={12}/>:<TrendingDown size={12}/>}{k.up?'+':''}{k.change}%</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h3 className="font-display font-semibold mb-5">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY}>
            <defs><linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/><stop offset="95%" stopColor="#0066FF" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800"/><XAxis dataKey="month" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>[formatPrice(v),'Revenue']}/>
            <Area type="monotone" dataKey="revenue" stroke="#0066FF" strokeWidth={2.5} fill="url(#ag2)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold mb-5">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={200}><BarChart data={MONTHLY}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800"/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Bar dataKey="orders" fill="#0066FF" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p,i)=>(
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--bg3)] flex items-center justify-center text-xs font-bold text-[var(--text3)]">{i+1}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><div className="flex items-center gap-2 mt-1"><div className="flex-1 bg-[var(--border)] rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{width:`${(p.sales/512)*100}%`}}/></div><span className="text-xs text-[var(--text3)]">{p.sales} sold</span></div></div>
                <span className="text-sm font-bold">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
