export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n)
export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { day:'numeric', month:'short', year:'numeric' }).format(new Date(d))
export const calcDiscount = (price, mrp) => mrp > price ? Math.round((1 - price/mrp) * 100) : 0
export const generateOrderId = () => 'SHX' + Date.now().toString().slice(-6)
export const truncate = (str, n=80) => str?.length > n ? str.slice(0,n) + '…' : str
