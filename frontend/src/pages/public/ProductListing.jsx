import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { SkeletonProductCard } from '@/components/ui/Loader';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useCartStore } from '@/store/cartStore';

const CATEGORIES = ['All', 'Milk', 'Ghee', 'Butter', 'Curd', 'Cheese', 'Paneer'];
const SORT_OPTIONS = [
  { value: 'popular',     label: 'Most Popular' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Highest Rated' },
  { value: 'newest',      label: 'Newest First' },
];

const ALL_PRODUCTS = [
  { id:1, name:'Farm Fresh Full Cream Milk',  category:'Milk',   price:65,  unit:'litre', rating:4.8, reviews:124, isNew:true,  image:null },
  { id:2, name:'Pure A2 Cow Ghee',            category:'Ghee',   price:850, unit:'kg',    rating:4.9, reviews:87,  isBest:true, image:null },
  { id:3, name:'Homestyle Butter Unsalted',   category:'Butter', price:280, unit:'500g',  rating:4.7, reviews:63,  discount:10, image:null },
  { id:4, name:'Probiotic Dahi',              category:'Curd',   price:90,  unit:'kg',    rating:4.6, reviews:45,  image:null },
  { id:5, name:'Toned Milk',                  category:'Milk',   price:52,  unit:'litre', rating:4.5, reviews:38,  image:null },
  { id:6, name:'Buffalo Milk',                category:'Milk',   price:75,  unit:'litre', rating:4.7, reviews:29,  image:null },
  { id:7, name:'Organic Butter Salted',       category:'Butter', price:310, unit:'500g',  rating:4.8, reviews:51,  image:null },
  { id:8, name:'Fresh Paneer',                category:'Paneer', price:180, unit:'200g',  rating:4.6, reviews:72,  image:null },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setCategory]  = useState('All');
  const [sort,          setSort]        = useState('popular');
  const [search,        setSearch]      = useState(searchParams.get('search') || '');
  const [priceRange,    setPriceRange]  = useState([0, 1000]);
  const [gridView,      setGridView]    = useState(true);
  const [filterOpen,    setFilterOpen]  = useState(false);
  const [loading,       setLoading]     = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const filtered = ALL_PRODUCTS.filter((p) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-slate-900 mb-2">Our Products</h1>
          <p className="text-slate-500">Farm-fresh dairy, delivered daily</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filter — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <GlassCard variant="white" className="p-6 sticky top-28">
              <h3 className="font-semibold text-slate-700 mb-4">Categories</h3>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-blue-50">
                <h3 className="font-semibold text-slate-700 mb-4">Price Range</h3>
                <div className="flex gap-2 text-sm text-slate-500">
                  <span>₹{priceRange[0]}</span>
                  <span className="mx-auto">—</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range" min="0" max="1000" step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, +e.target.value])}
                  className="w-full mt-2 accent-blue-500"
                />
              </div>

              <button
                onClick={() => { setCategory('All'); setPriceRange([0, 1000]); setSearch(''); }}
                className="mt-6 text-sm text-blue-500 hover:underline"
              >
                Clear Filters
              </button>
            </GlassCard>
          </aside>

          {/* Main area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-10"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field w-auto text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <div className="flex gap-1 glass rounded-2xl p-1">
                <button onClick={() => setGridView(true)}
                  className={`p-2 rounded-xl ${gridView ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-blue-500'}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setGridView(false)}
                  className={`p-2 rounded-xl ${!gridView ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-blue-500'}`}>
                  <List size={16} />
                </button>
              </div>

              <button onClick={() => setFilterOpen(true)}
                className="lg:hidden btn-glass btn-sm flex items-center gap-2">
                <SlidersHorizontal size={15} /> Filters
              </button>

              <span className="text-sm text-slate-400 ml-auto">
                {filtered.length} products
              </span>
            </div>

            {/* Category pills (mobile) */}
            <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-blue-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${search}`}
                className={`grid gap-5 ${gridView ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonProductCard key={i} />)
                  : filtered.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAddToCart={(p) => addItem(p)}
                        className={!gridView ? 'flex-row !flex' : ''}
                      />
                    ))
                }
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="font-display text-xl">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
