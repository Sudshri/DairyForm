import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart, Crown, Snowflake, Droplets, Star } from 'lucide-react';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';
import ProductModal from './ProductModal';

const EMOJI = { Milk:'🥛', Ghee:'🍯', Paneer:'🧀', Butter:'🧈', Dahi:'🥣', Khoya:'🍮', Drinks:'🥤', Cheese:'🧀' };

/* Per-category accent color + badge icon */
const CAT_META = {
  'Milk':                         { color:'#17C0F2', light:'#E0F8FF', Icon: Droplets },
  'Paneer & Cheese':              { color:'#22C55E', light:'#DCFCE7', Icon: Crown    },
  'Ice Cream & Frozen Desserts':  { color:'#8B5CF6', light:'#EDE9FE', Icon: Snowflake},
  'Traditional Dairy Products':   { color:'#F97316', light:'#FFF7ED', Icon: Crown    },
  'Cheese Products':              { color:'#F59E0B', light:'#FFFBEB', Icon: Crown    },
  'Frozen & Dessert Mixes':       { color:'#EC4899', light:'#FDF2F8', Icon: Snowflake},
  'Premium Products':             { color:'#22C55E', light:'#DCFCE7', Icon: Crown    },
  'Ghee':                         { color:'#F59E0B', light:'#FFFBEB', Icon: Crown    },
  'Butter':                       { color:'#F97316', light:'#FFF7ED', Icon: Crown    },
  'Dahi':                         { color:'#17C0F2', light:'#E0F8FF', Icon: Droplets },
  'Khoya':                        { color:'#F97316', light:'#FFF7ED', Icon: Crown    },
};
const DEFAULT_META = { color:'#17C0F2', light:'#E0F8FF', Icon: Crown };

/* Seeded fake rating so it stays consistent between renders */
function fakeRating(id) {
  const ratings = [4.8, 4.7, 4.9, 4.6, 4.8, 4.7, 4.5, 4.9, 4.8, 4.6];
  const reviews = [126, 98, 210, 178, 143, 87, 234, 67, 192, 115];
  const i = (id ?? 0) % ratings.length;
  return { rating: ratings[i], reviews: reviews[i] };
}

const MOCK_PRODUCTS = [
  { id:1, product_name:'Farm Fresh Full Cream Milk A2', category:{name:'Milk'},  short_description:'Premium A2 milk from Gir cows, rich in natural vitamins.',
    variants:[{id:1,variant_name:'250ml',selling_price:15,mrp_price:18},{id:2,variant_name:'500ml',selling_price:30,mrp_price:35},{id:3,variant_name:'1 Litre',selling_price:58,mrp_price:65,active_offers:[{offer:{offer_name:'₹7 OFF',offer_type:'fixed',discount_value:7}}]}] },
  { id:2, product_name:'Pure Cow Ghee A2',              category:{name:'Ghee'},  short_description:'Handcrafted using bilona method from A2 cow milk.',
    variants:[{id:4,variant_name:'250g',selling_price:350,mrp_price:380},{id:5,variant_name:'500g',selling_price:680,mrp_price:720},{id:6,variant_name:'1kg',selling_price:1300,mrp_price:1400}] },
  { id:3, product_name:'Fresh Soft Paneer',             category:{name:'Paneer'},short_description:'Made fresh each morning from pure whole milk.',
    variants:[{id:7,variant_name:'200g',selling_price:90,mrp_price:100},{id:8,variant_name:'500g',selling_price:220,mrp_price:240},{id:9,variant_name:'1kg',selling_price:420,mrp_price:460}] },
  { id:4, product_name:'Probiotic Dahi',                category:{name:'Dahi'},  short_description:'Naturally fermented probiotic curd with live cultures.',
    variants:[{id:10,variant_name:'200g',selling_price:30,mrp_price:35},{id:11,variant_name:'400g',selling_price:58,mrp_price:65},{id:12,variant_name:'1kg',selling_price:135,mrp_price:150}] },
  { id:5, product_name:'Homestyle Butter Unsalted',     category:{name:'Butter'},short_description:'Creamy white butter from fresh cream, perfect for cooking.',
    variants:[{id:13,variant_name:'100g',selling_price:72,mrp_price:80},{id:14,variant_name:'250g',selling_price:170,mrp_price:185},{id:15,variant_name:'500g',selling_price:330,mrp_price:360}] },
  { id:6, product_name:'Pure Khoya / Mawa',             category:{name:'Khoya'}, short_description:'Thick, rich khoya made by slow-simmering full cream milk.',
    variants:[{id:16,variant_name:'250g',selling_price:120,mrp_price:130},{id:17,variant_name:'500g',selling_price:230,mrp_price:250}] },
];

function ProductCard({ product, onView }) {
  const [hovered,   setHovered]   = useState(false);
  const [liked,     setLiked]     = useState(false);
  const [selIdx,    setSelIdx]    = useState(0);
  const [btnHover,  setBtnHover]  = useState(false);

  const variants  = product.variants ?? [];
  const cat       = product.category?.name ?? '';
  const emoji     = EMOJI[cat] ?? '🥛';
  const meta      = CAT_META[cat] ?? DEFAULT_META;
  const { Icon }  = meta;
  const { rating, reviews } = fakeRating(product.id);

  const selVariant  = variants[selIdx] ?? variants[0] ?? null;
  const selling     = selVariant?.selling_price ?? 0;
  const mrp         = selVariant?.mrp_price ?? 0;
  const discountPct = mrp > selling ? Math.round((1 - selling / mrp) * 100) : 0;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        border: '1.5px solid var(--d-border-lt)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      }}
      onClick={() => onView(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBtnHover(false); }}
      initial={{ opacity:0, y:20 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }}
    >
      {/* ── Image area ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height:'220px', background:'linear-gradient(135deg,#F8FBFF,#F0FBF4)' }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.product_name}
            className="w-full h-full object-contain"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform 0.5s ease' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl"
              style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform 0.5s ease', display:'block' }}>
              {emoji}
            </span>
          </div>
        )}

        {/* Category badge – top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: meta.color, boxShadow:`0 2px 8px ${meta.color}44` }}>
          <Icon size={11} color="#fff" />
          <span className="text-2xs font-bold text-white leading-none">{cat}</span>
        </div>

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
          {product.product_name}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} style={{ color:'#F59E0B', fill:'#F59E0B' }} />
          <span className="text-sm font-bold" style={{ color:'#1E293B' }}>{rating}</span>
          <span className="text-xs" style={{ color:'#94A3B8' }}>({reviews} Reviews)</span>
        </div>

        {/* Short description */}
        <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color:'#64748B' }}>
          {product.short_description}
        </p>

        {/* Variant size pills */}
        {variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {variants.slice(0, 3).map((v, i) => {
              const isSel = i === selIdx;
              return (
                <button key={v.id}
                  onClick={(e) => { e.stopPropagation(); setSelIdx(i); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isSel ? meta.light : '#FFFFFF',
                    border: `1.5px solid ${isSel ? meta.color : '#E2EAF0'}`,
                    color: isSel ? meta.color : '#64748B',
                  }}>
                  {v.variant_name}
                </button>
              );
            })}
          </div>
        )}

        {/* Price row */}
        {selVariant && (
          <div className="flex items-center gap-2 mb-4">
            <span className="font-display text-2xl font-bold" style={{ color:'#1E293B' }}>
              ₹{selling}
            </span>
            {mrp > selling && (
              <span className="text-sm line-through" style={{ color:'#94A3B8' }}>₹{mrp}</span>
            )}
            {discountPct > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background:'#FEF2F2', color:'#EF4444' }}>
                {discountPct}% OFF
              </span>
            )}
          </div>
        )}

        {/* View Details CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(product); }}
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

export default function ProductsSection({ onBulkOrder }) {
  const [catFilter, setCat] = useState('All');
  const [modal,   setModal] = useState(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => apiGet(API.CATEGORIES.LIST).then(r => r.data?.data ?? []),
    staleTime: 600_000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products-showcase'],
    queryFn:  () => apiGet(API.PRODUCTS.LIST, { per_page:100, status:'active' })
                    .then(r => r.data?.data ?? MOCK_PRODUCTS),
    staleTime: 60_000,
  });

  const categories = ['All', ...(categoriesData?.map(c => c.name) ?? ['Milk','Ghee','Paneer','Butter','Dahi','Khoya'])];
  const products = (data ?? MOCK_PRODUCTS)
    .filter(p => catFilter === 'All' || p.category?.name === catFilter);

  return (
    <section id="products" className="py-16 sm:py-20" style={{ background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10 sm:mb-12"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="d-section-tag">📦 Our Products</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ color:'var(--d-text)' }}>
            Fresh Dairy <span style={{ color:'var(--d-accent)' }}>Collection</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color:'var(--d-text-2)' }}>
            Click any product to view details and variants.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCat(cat)}
              className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
              style={{
                background: catFilter===cat ? 'var(--d-gradient-accent)' : '#FFFFFF',
                color:      catFilter===cat ? '#FFFFFF'                  : '#1F2937',
                border:     `1.5px solid ${catFilter===cat ? 'transparent' : '#DDEAF5'}`,
                boxShadow:  catFilter===cat ? '0 2px 10px rgba(23,192,242,0.25)' : 'none',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border:'1px solid var(--d-border-lt)' }}>
                <div className="h-56 animate-pulse" style={{ background:'var(--d-input)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded-full animate-pulse" style={{ background:'var(--d-input)', width:'75%' }} />
                  <div className="h-3 rounded-full animate-pulse" style={{ background:'var(--d-input)', width:'50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p style={{ color:'var(--d-muted)' }}>No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} onView={setModal} />)}
          </div>
        )}
      </div>

      <ProductModal product={modal} open={!!modal} onClose={() => setModal(null)} onBulkOrder={onBulkOrder} />
    </section>
  );
}
