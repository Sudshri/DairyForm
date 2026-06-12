import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems, selectCartCount, selectCartSubtotal,
  addItem, removeItem, updateQty, clearCart,
} from '@/store/redux/cartSlice';
import { setNotification, toggleCart } from '@/store/redux/uiSlice';

export function useCart() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const count    = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  const add = (product, qty = 1) => {
    dispatch(addItem({ product, qty }));
    dispatch(setNotification({ type: 'success', message: `${product.name} added to cart 🛒` }));
    dispatch(toggleCart());
  };

  const remove = (id) => dispatch(removeItem(id));
  const update = (id, qty) => dispatch(updateQty({ id, qty }));
  const clear  = () => dispatch(clearCart());

  const delivery   = subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal + delivery;

  return { items, count, subtotal, delivery, grandTotal, add, remove, update, clear };
}
