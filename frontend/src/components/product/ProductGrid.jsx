import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { SkeletonProductCard } from '@/components/ui/Loader';
import EmptyState from '@/components/common/EmptyState';
import { addItem } from '@/store/redux/cartSlice';
import { toggleWishlist } from '@/store/redux/wishlistSlice';
import { setNotification, openCart } from '@/store/redux/uiSlice';

export default function ProductGrid({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  cols = 4,
  emptyTitle = 'No products found',
  emptyDesc = 'Try adjusting your filters',
}) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const colMap = { 2:'grid-cols-1 sm:grid-cols-2', 3:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' };

  const handleAddToCart = (product) => {
    dispatch(addItem({ product, qty: 1 }));
    dispatch(setNotification({ type: 'success', message: `${product.name} added to cart 🛒` }));
    dispatch(openCart());
  };

  const handleViewDetails = (product) => navigate(`/products/${product.id}`);

  if (isLoading) {
    return (
      <div className={`grid gap-5 ${colMap[cols] ?? colMap[4]}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <EmptyState emoji="🔍" title={emptyTitle} description={emptyDesc} />;
  }

  return (
    <motion.div
      className={`grid gap-5 ${colMap[cols] ?? colMap[4]}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
      ))}
    </motion.div>
  );
}
