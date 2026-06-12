import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartOpen:        false,
    searchOpen:      false,
    mobileSidebarOpen: false,
    activeModal:     null,   // 'login' | 'quickView' | null
    quickViewProduct: null,
    notification:    null,   // { type, message }
  },
  reducers: {
    openCart:     (state) => { state.cartOpen = true; },
    closeCart:    (state) => { state.cartOpen = false; },
    toggleCart:   (state) => { state.cartOpen = !state.cartOpen; },
    openSearch:   (state) => { state.searchOpen = true; },
    closeSearch:  (state) => { state.searchOpen = false; },
    toggleMobileSidebar: (state) => { state.mobileSidebarOpen = !state.mobileSidebarOpen; },
    closeMobileSidebar:  (state) => { state.mobileSidebarOpen = false; },
    openModal:    (state, { payload }) => { state.activeModal = payload; },
    closeModal:   (state) => { state.activeModal = null; state.quickViewProduct = null; },
    openQuickView: (state, { payload }) => {
      state.activeModal      = 'quickView';
      state.quickViewProduct = payload;
    },
    setNotification: (state, { payload }) => { state.notification = payload; },
    clearNotification: (state) => { state.notification = null; },
  },
});

export const {
  openCart, closeCart, toggleCart,
  openSearch, closeSearch,
  toggleMobileSidebar, closeMobileSidebar,
  openModal, closeModal, openQuickView,
  setNotification, clearNotification,
} = uiSlice.actions;

export const selectCartOpen        = (s) => s.ui.cartOpen;
export const selectSearchOpen      = (s) => s.ui.searchOpen;
export const selectActiveModal     = (s) => s.ui.activeModal;
export const selectQuickViewProduct = (s) => s.ui.quickViewProduct;
export const selectNotification    = (s) => s.ui.notification;

export default uiSlice.reducer;
