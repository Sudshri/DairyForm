import { configureStore } from '@reduxjs/toolkit';
import cartReducer     from './cartSlice';
import wishlistReducer from './wishlistSlice';
import uiReducer       from './uiSlice';

const store = configureStore({
  reducer: {
    cart:     cartReducer,
    wishlist: wishlistReducer,
    ui:       uiReducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }),
});

export default store;
