import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Crown, Snowflake, Droplets } from 'lucide-react';
import { clsx } from 'clsx';

const CAT_META = {
  'Milk':                         { color:'#17C0F2', light:'#E0F8FF', Icon: Droplets  },
  'Paneer & Cheese':              { color:'#22C55E', light:'#DCFCE7', Icon: Crown     },
  'Ice Cream & Frozen Desserts':  { color:'#8B5CF6', light:'#EDE9FE', Icon: Snowflake },
  'Traditional Dairy Products':   { color:'#F97316', light:'#FFF7ED', Icon: Crown     },
  'Cheese Products':              { color:'#F59E0B', light:'#FFFBEB', Icon: Crown     },
  'Frozen & Dessert Mixes':       { color:'#EC4899', light:'#FDF2F8', Icon: Snowflake },
  'Premium Products':             { color:'#22C55E', light:'#DCFCE7', Icon: Crown     },
  'Ghee':                         { color:'#F59E0B', light:'#FFFBEB', Icon: Crown     },
  'Butter':                       { color:'#F97316', light:'#FFF7ED', Icon: Crown     },
  'Dahi':                         { color:'#17C0F2', light:'#E0F8FF', Icon: Droplets  },
  'Khoya':                        { color:'#F97316', light:'#FFF7ED', Icon: Crown     },
};
const DEFAULT_META = { color:'#17C0F2', light:'#E0F8FF', Icon: Crown };

export default function ProductCard({ product, onViewDetails, className }) {
  const [hovered,  setHovered]  = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [selIdx,   setSelIdx]   = useState(0);
  const [btnHover, setBtnHover] = useState(false);

  const cat      = product.category ?? '';
  const meta     = CAT_META[cat] ?? DEFAULT_META;
  const { Icon } = meta;

  /* Variants: prefer product.variants array, else build one from price/unit */
  const variants = product.variants ?? (product.price ? [{ id: 0, variant_name: product.unit ?? '1 unit', selling_price: product.price, mrp_price: product.originalPrice }] : []);
  const selVar   = variants[selIdx] ?? null;
  const selling  = selVar?.selling_price ?? product.price ?? 0;
  const mrp      = selVar?.mrp_price     ?? product.originalPrice ?? 0;
  const discount = mrp > selling ? Math.round((1 - selling / mrp) * 100) : (product.discount ?? 0);

  return (
    <motion.div
      className={clsx('bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col', className)}
      style={{
        border: '1.5px solid #E8EFF5',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      }}
      onClick={() => onViewDetails?.(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBtnHover(false); }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Image ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height:'220px', background:'linear-gradient(135deg,#F8FBFF,#F0FBF4)', flexShrink:0 }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform 0.5s ease' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl"
              style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform 0.5s ease', display:'block' }}>
              🥛
            </span>
          </div>
        )}

        {/* Category badge – top left */}
        {cat && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: meta.color, boxShadow:`0 2px 8px ${meta.color}44` }}>
            <Icon size={11} color="#fff" />
            <span className="text-2xs font-bold text-white leading-none">{cat}</span>
          </div>
        )}

        {/* Badges (New / Best Seller) – also top left, stack below category */}
        {(product.isNew || product.isBest) && (
          <div className="absolute top-10 left-3 flex flex-col gap-1.5 mt-1">
            {product.isNew  && <span className="badge-sky">New</span>}
            {product.isBest && <span className="badge-gold">Best Seller</span>}
          </div>
        )}

        {/* Heart – top right */}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background:'#FFFFFF', border:'1.5px solid #E5EDF5', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' }}
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}>
          <Heart size={15} style={{ color: liked ? '#EF4444' : '#94A3B8', fill: liked ? '#EF4444' : 'none', transition:'all 0.2s' }} />
        </button>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Name */}
        <h3 className="font-display font-bold text-base sm:text-lg leading-snug line-clamp-2 mb-1"
          style={{ color:'#1E293B' }}>
          {product.name}
        </h3>

        {/* Rating */}
        {(product.rating ?? 0) > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} style={{ color:'#F59E0B', fill:'#F59E0B' }} />
            <span className="text-sm font-bold" style={{ color:'#1E293B' }}>{product.rating}</span>
            <span className="text-xs" style={{ color:'#94A3B8' }}>({product.reviews ?? 0} Reviews)</span>
          </div>
        )}

        {/* Short description */}
        {product.shortDescription && (
          <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color:'#64748B' }}>
            {product.shortDescription}
          </p>
        )}

        {/* Variant size pills */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {variants.slice(0, 3).map((v, i) => {
              const isSel = i === selIdx;
              return (
                <button key={v.id ?? i}
                  onClick={(e) => { e.stopPropagation(); setSelIdx(i); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isSel ? meta.light : '#FFFFFF',
                    border: `1.5px solid ${isSel ? meta.color : '#E2EAF0'}`,
                    color: isSel ? meta.color : '#64748B',
                  }}>
                  {v.variant_name ?? v.unit}
                </button>
              );
            })}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-display text-2xl font-bold" style={{ color:'#1E293B' }}>
            ₹{selling}
          </span>
          {mrp > selling && (
            <span className="text-sm line-through" style={{ color:'#94A3B8' }}>₹{mrp}</span>
          )}
          {discount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background:'#FEF2F2', color:'#EF4444' }}>
              {discount}% OFF
            </span>
          )}
        </div>

        {/* View Details CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails?.(product); }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '14px',
            border: btnHover || hovered ? '1.5px solid transparent' : '1.5px solid #17C0F2',
            background: btnHover || hovered ? 'linear-gradient(135deg,#17C0F2,#168AC7)' : '#FFFFFF',
            color: btnHover || hovered ? '#FFFFFF' : '#17C0F2',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.22s ease',
            boxShadow: btnHover || hovered ? '0 4px 16px rgba(23,192,242,0.35)' : 'none',
            letterSpacing: '0.01em',
            marginTop: 'auto',
          }}
        >
          View Details →
        </button>
      </div>
    </motion.div>
  );
}
