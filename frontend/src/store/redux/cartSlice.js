import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try { return JSON.parse(localStorage.getItem('df_cart') ?? '[]'); } catch { return []; }
};
const save = (items) => localStorage.setItem('df_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: load() },
  reducers: {
    addItem(state, { payload: { product, qty = 1 } }) {
      const idx = state.items.findIndex((i) => i.id === product.id);
      if (idx !== -1) {
        state.items[idx].qty += qty;
      } else {
        state.items.push({ ...product, qty });
      }
      save(state.items);
    },
    removeItem(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
      save(state.items);
    },
    updateQty(state, { payload: { id, qty } }) {
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) item.qty = qty;
      }
      save(state.items);
    },
    clearCart(state) {
      state.items = [];
      save([]);
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems    = (s) => s.cart.items;
export const selectCartCount    = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartSubtotal = (s) => s.cart.items.reduce((t, i) => t + i.price * i.qty, 0);
export const selectCartItem     = (id) => (s) => s.cart.items.find((i) => i.id === id);

export default cartSlice.reducer;
