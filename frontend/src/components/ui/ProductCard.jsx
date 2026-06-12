import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency } from '@/utils/formatters';

export default function ProductCard({ product, onAddToCart, onViewDetails, className }) {
  const [liked,   setLiked]   = useState(false);
  const [added,   setAdded]   = useState(false);
  const [rotate,  setRotate]  = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    setRotate({ x: y, y: x });
  };

  const handleAddCart = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      ref={cardRef}
      className={clsx(
        'card-product group relative bg-white overflow-hidden',
        className
      )}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : 'perspective(1000px) rotateX(0) rotateY(0)',
        transition: 'transform 0.15s ease-out, box-shadow 0.35s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRotate({ x: 0, y: 0 }); }}
      onClick={() => onViewDetails?.(product)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image container */}
      <div className="relative h-52 bg-gradient-to-br from-blue-50 to-cream-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-60">🥛</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew    && <span className="badge-sky">New</span>}
          {product.isBest   && <span className="badge-gold">Best Seller</span>}
          {product.discount && (
            <span className="badge bg-red-100 text-red-600 text-xs font-bold">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Action buttons (appear on hover) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2
                        translate-x-12 group-hover:translate-x-0
                        transition-transform duration-350 ease-spring">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={clsx(
              'w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft',
              'transition-colors duration-200',
              liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
            )}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(product); }}
            className="w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft
                       text-slate-400 hover:text-blue-500 transition-colors duration-200"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg text-slate-800 mb-1 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating ?? 0)
                  ? 'text-gold-400 fill-gold-400'
                  : 'text-slate-200 fill-slate-200'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviews ?? 0})</span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-slate-400 ml-1">/{product.unit}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddCart}
            className={clsx(
              'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-250',
              added
                ? 'bg-green-500 text-white shadow-soft-md'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white hover:shadow-soft-md'
            )}
          >
            {added ? (
              <span className="text-sm font-bold">✓</span>
            ) : (
              <ShoppingCart size={16} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
