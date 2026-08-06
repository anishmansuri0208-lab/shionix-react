const COLORS = {
  gray:'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green:'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  yellow:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple:'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  orange:'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}
export default function Badge({ children, color='gray', className='' }) {
  return <span className={`badge ${COLORS[color]} ${className}`}>{children}</span>
}
export function StatusBadge({ status }) {
  const map = {
    pending:{color:'yellow',label:'Pending'}, processing:{color:'blue',label:'Processing'},
    shipped:{color:'purple',label:'Shipped'}, delivered:{color:'green',label:'Delivered'},
    cancelled:{color:'red',label:'Cancelled'}, refunded:{color:'orange',label:'Refunded'},
    active:{color:'green',label:'Active'}, inactive:{color:'gray',label:'Inactive'},
    blocked:{color:'red',label:'Blocked'}, approved:{color:'green',label:'Approved'},
  }
  const { color, label } = map[status] || { color:'gray', label:status }
  return <Badge color={color}>{label}</Badge>
}
