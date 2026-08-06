import { Truck, Shield, RotateCcw, Zap, Headphones, Award } from 'lucide-react'
const items = [
  {icon:Truck,text:'Free Delivery on Orders ₹999+'},{icon:Shield,text:'1 Year Warranty on All Products'},
  {icon:RotateCcw,text:'Easy 30-Day Returns'},{icon:Zap,text:'Same Day Dispatch'},
  {icon:Headphones,text:'24/7 Customer Support'},{icon:Award,text:'100% Genuine Products'},
]
const doubled = [...items,...items]
export default function MarqueeBanner() {
  return (
    <div className="border-y border-[var(--border)] bg-[var(--bg2)] overflow-hidden py-3">
      <div className="flex gap-0 animate-marquee w-max">
        {doubled.map((item,i)=>(
          <div key={i} className="flex items-center gap-2.5 px-8 whitespace-nowrap">
            <item.icon size={14} className="text-brand-500 flex-shrink-0"/>
            <span className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wide">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
