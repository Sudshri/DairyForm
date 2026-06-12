import { useSelector, useDispatch } from 'react-redux';
import {
  selectWishlistItems, selectWishlistCount, selectIsWishlisted,
  toggleWishlist, removeFromWishlist, clearWishlist,
} from '@/store/redux/wishlistSlice';
import { addItem } from '@/store/redux/cartSlice';
import { setNotification } from '@/store/redux/uiSlice';

export function useWishlist() {
  const dispatch = useDispatch();
  const items    = useSelector(selectWishlistItems);
  const count    = useSelector(selectWishlistCount);

  const toggle = (product) => {
    const wasWishlisted = items.some((i) => i.id === product.id);
    dispatch(toggleWishlist(product));
    dispatch(setNotification({
      type:    'success',
      message: wasWishlisted ? 'Removed from wishlist' : `${product.name} added to wishlist ♡`,
    }));
  };

  const remove = (id) => dispatch(removeFromWishlist(id));

  const moveToCart = (product) => {
    dispatch(addItem({ product, qty: 1 }));
    dispatch(removeFromWishlist(product.id));
    dispatch(setNotification({ type: 'success', message: `${product.name} moved to cart` }));
  };

  const clear = () => dispatch(clearWishlist());

  return { items, count, toggle, remove, moveToCart, clear };
}

export function useIsWishlisted(productId) {
  return useSelector(selectIsWishlisted(productId));
}
