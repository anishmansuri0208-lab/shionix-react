import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export const useCartStore = create(persist((set, get) => ({
  items: [],
  add: (product, qty=1) => {
    const items = get().items
    const ex = items.find(i => i.id === product.id)
    if (ex) set({ items: items.map(i => i.id===product.id ? {...i, qty:i.qty+qty} : i) })
    else set({ items: [...items, {...product, qty}] })
  },
  remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  updateQty: (id, qty) => {
    if (qty < 1) { get().remove(id); return }
    set(s => ({ items: s.items.map(i => i.id===id ? {...i, qty} : i) }))
  },
  clear: () => set({ items: [] }),
}), { name:'shionix-cart' }))
