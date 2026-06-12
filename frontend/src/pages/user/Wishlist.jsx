import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/common/SEOHead';
import Breadcrumb from '@/components/common/Breadcrumb';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import EmptyState from '@/components/common/EmptyState';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatters';

export default function Wishlist() {
  const navigate                    = useNavigate();
  const { items, remove, moveToCart } = useWishlist();
  const { add: addToCart }          = useCart();

  return (
    <>
      <SEOHead title="My Wishlist" />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
        <FloatingBlob color="#FDE8C8" size={350} opacity={0.2} className="top-20 -right-20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <Breadcrumb items={[{ label: 'Wishlist', to: '/wishlist' }]} className="mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <Heart size={22} className="text-red-400 fill-red-200" />
              </div>
              <div>
                <h1 className="font-display text-3xl text-slate-900">My Wishlist</h1>
                <p className="text-slate-400 text-sm">{items.length} saved items</p>
              </div>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => items.forEach((item) => moveToCart(item))}
                icon={<ShoppingCart size={15} />}
              >
                Move All to Cart
              </Button>
            )}
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <EmptyState
              emoji="♡"
              title="Your wishlist is empty"
              description="Save products you love by tapping the heart icon on any product."
              action={() => navigate('/products')}
              actionLabel="Browse Products"
            />
          )}

          {/* Grid */}
          <AnimatePresence>
            {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <GlassCard variant="white" className="overflow-hidden flex flex-col">
                      {/* Product image */}
                      <div
                        className="relative h-44 bg-gradient-to-br from-blue-50 to-cream-100
                                   flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        <span className="text-6xl">{item.emoji ?? '🥛'}</span>
                        {item.discount && (
                          <span className="absolute top-3 left-3 badge bg-red-100 text-red-600 text-xs font-bold">
                            -{item.discount}%
                          </span>
                        )}
                        {/* Remove button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); remove(item.id); }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full glass
                                     flex items-center justify-center text-red-400
                                     hover:bg-red-50 hover:scale-110 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div>
                          <p className="text-xs text-blue-500 font-semibold uppercase">{item.category}</p>
                          <h3
                            className="font-display text-base text-slate-800 leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          {item.rating && <StarRating value={item.rating} size={12} />}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="font-bold text-slate-900 text-lg">{formatCurrency(item.price)}</span>
                            {item.originalPrice && (
                              <span className="text-xs text-slate-400 line-through ml-1">
                                {formatCurrency(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full justify-center"
                          icon={<ShoppingCart size={14} />}
                          onClick={() => moveToCart(item)}
                        >
                          Move to Cart
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Continue shopping */}
          {items.length > 0 && (
            <div className="mt-12 text-center">
              <Link to="/products">
                <Button variant="outline" iconRight={<ArrowRight size={16} />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
