import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';
import ProductModal from './ProductModal';

const EMOJI = { Milk:'🥛', Ghee:'🍯', Paneer:'🧀', Butter:'🧈', Dahi:'🥣', Khoya:'🍮', Drinks:'🥤', Cheese:'🧀' };

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
  const variants  = product.variants ?? [];
  const cat       = product.category?.name ?? '';
  const emoji     = EMOJI[cat] ?? '🥛';

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}
      onClick={() => onView(product)}
      initial={{ opacity:0, y:20 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }}
      whileHover={{ y:-4, boxShadow:'var(--d-shadow-lg)', transition:{ duration:0.2 } }}
    >
      {/* Image area */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background:'linear-gradient(135deg,#E0F8FF,#F0FFF4)' }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background:'linear-gradient(135deg,rgba(23,192,242,0.06),transparent)' }} />
        {product.image ? (
          <img src={product.image} alt={product.product_name}
            className="w-32 h-32 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </span>
        )}
        {/* Category chip */}
        <span className="absolute top-3 left-3 text-2xs font-bold px-2 py-1 rounded-lg"
          style={{ background:'rgba(23,192,242,0.12)', color:'var(--d-accent-dk)' }}>
          {cat}
        </span>
        {/* Offer badge */}
        {variants.some(v => v.active_offers?.length > 0) && (
          <span className="absolute top-3 right-3 text-2xs font-bold px-2 py-1 rounded-lg"
            style={{ background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA' }}>
            OFFER
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-sm sm:text-base mb-1 leading-snug line-clamp-2"
          style={{ color:'var(--d-text)' }}>
          {product.product_name}
        </h3>
        <p className="text-xs mb-3 line-clamp-2" style={{ color:'var(--d-muted)' }}>
          {product.short_description}
        </p>

        {/* Variant price chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {variants.slice(0,3).map(v => {
            const hasOffer = v.active_offers?.length > 0;
            return (
              <div key={v.id} className="px-2.5 py-1.5 rounded-xl text-center"
                style={{
                  background: hasOffer ? 'var(--d-accent-lt)' : 'var(--d-input)',
                  border:     `1px solid ${hasOffer ? 'rgba(23,192,242,0.28)' : 'var(--d-border-lt)'}`,
                }}>
                <span className="text-2xs block" style={{ color:'var(--d-muted)' }}>{v.variant_name}</span>
                <span className="text-xs font-bold block" style={{ color: hasOffer ? 'var(--d-accent)' : 'var(--d-text)' }}>
                  ₹{v.selling_price}
                </span>
                {v.mrp_price > v.selling_price && (
                  <span className="text-2xs line-through block" style={{ color:'var(--d-muted)' }}>₹{v.mrp_price}</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="w-full py-2 rounded-full text-xs font-semibold transition-all"
          style={{ background:'var(--d-accent-lt)', color:'var(--d-accent-dk)', border:'1px solid rgba(23,192,242,0.22)' }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--d-gradient-accent)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.border='1px solid transparent'; }}
          onMouseLeave={e => { e.currentTarget.style.background='var(--d-accent-lt)'; e.currentTarget.style.color='var(--d-accent-dk)'; e.currentTarget.style.border='1px solid rgba(23,192,242,0.22)'; }}
        >
          View Details →
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductsSection({ onBulkOrder }) {
  const [search,  setSearch]  = useState('');
  const [catFilter, setCat]   = useState('All');
  const [modal,   setModal]   = useState(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => apiGet(API.CATEGORIES.LIST).then(r => r.data?.data ?? []),
    staleTime: 600_000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products-showcase', catFilter, search],
    queryFn:  () => apiGet(API.PRODUCTS.LIST, { per_page:12, search: search||undefined, status:'active' })
                    .then(r => r.data?.data ?? MOCK_PRODUCTS),
    staleTime: 60_000,
  });

  const categories = ['All', ...(categoriesData?.map(c => c.name) ?? ['Milk','Ghee','Paneer','Butter','Dahi','Khoya'])];
  const products   = (data ?? MOCK_PRODUCTS)
    .filter(p => catFilter === 'All' || p.category?.name === catFilter)
    .filter(p => !search || p.product_name.toLowerCase().includes(search.toLowerCase()));

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color:'var(--d-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="d-input" style={{ paddingLeft:'2.25rem' }} />
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border:'1px solid var(--d-border-lt)' }}>
                <div className="h-44 animate-pulse" style={{ background:'var(--d-input)' }} />
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
