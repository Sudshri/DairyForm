import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === product.id);
          if (existing) {
            return { items: s.items.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i) };
          }
          return { items: [...s.items, { ...product, qty }] };
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => i.id === id ? { ...i, qty } : i),
        })),

      clear: () => set({ items: [] }),

      total:    () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      subTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count:    () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'dairyform-cart' }
  )
);
