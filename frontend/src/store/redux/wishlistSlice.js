import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try { return JSON.parse(localStorage.getItem('df_wishlist') ?? '[]'); } catch { return []; }
};
const save = (items) => localStorage.setItem('df_wishlist', JSON.stringify(items));

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: load() },
  reducers: {
    toggleWishlist(state, { payload: product }) {
      const idx = state.items.findIndex((i) => i.id === product.id);
      if (idx !== -1) {
        state.items.splice(idx, 1);
      } else {
        state.items.push({ ...product, savedAt: new Date().toISOString() });
      }
      save(state.items);
    },
    removeFromWishlist(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
      save(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      save([]);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (s) => s.wishlist.items;
export const selectWishlistCount = (s) => s.wishlist.items.length;
export const selectIsWishlisted  = (id) => (s) => s.wishlist.items.some((i) => i.id === id);

export default wishlistSlice.reducer;
