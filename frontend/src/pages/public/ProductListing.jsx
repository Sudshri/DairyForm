import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import GlassCard from '@/components/ui/GlassCard';
import { SkeletonProductCard } from '@/components/ui/Loader';
import { useProducts } from '@/hooks/useProducts';
import { useCategories, MOCK_CATEGORIES } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'total_sales', label: 'Most Popular' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'newest',      label: 'Newest First' },
];

export default function ProductListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [sort,             setSort]             = useState('total_sales');
  const [search,           setSearch]           = useState(searchParams.get('search') || '');
  const [page,             setPage]             = useState(1);

  const debSearch = useDebounce(search, 400);

  const sortDir = sort === 'price_asc' ? 'asc' : 'desc';
  const sortBy  = sort === 'price_asc' || sort === 'price_desc' ? 'selling_price' : sort;

  const { data: productsData, isLoading: productsLoading } = useProducts({
    category_id: activeCategoryId ?? undefined,
    search:      debSearch || undefined,
    sort_by:     sortBy,
    sort_dir:    sortDir,
    per_page:    12,
    page,
    status:      'active',
  });

  const { data: categoriesRaw = [], isLoading: catsLoading } = useCategories();
  const categories = categoriesRaw.length ? categoriesRaw : MOCK_CATEGORIES;

  const products = productsData?.data ?? [];
  const meta     = productsData?.meta;

  const handleCategoryChange = (id) => { setActiveCategoryId(id); setPage(1); };
  const handleSearchChange   = (val) => { setSearch(val); setPage(1); };
  const clearFilters         = () => { setActiveCategoryId(null); setSearch(''); setSort('total_sales'); setPage(1); };

  const activeCatName = categories.find((c) => c.id === activeCategoryId)?.name;

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <h1 className="font-display text-4xl text-slate-900 mb-2">Our Products</h1>
          <p className="text-slate-500">Farm-fresh dairy, delivered daily</p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <GlassCard variant="white" className="p-6 sticky top-28">
              <h3 className="font-semibold text-slate-700 mb-4">Categories</h3>
              {catsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-xl" />)}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeCategoryId === null ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        activeCategoryId === cat.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-blue-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              {(activeCategoryId !== null || search || sort !== 'total_sales') && (
                <button onClick={clearFilters} className="mt-6 text-sm text-blue-500 hover:underline flex items-center gap-1">
                  <X size={13} /> Clear Filters
                </button>
              )}
            </GlassCard>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-10"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="input-field w-auto text-sm"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="text-sm text-slate-400 ml-auto">
                {meta ? `${meta.total} products` : productsLoading ? '...' : `${products.length} products`}
              </span>
            </div>

            <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategoryId === null ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-blue-100'
                }`}
              >All</button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategoryId === cat.id ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-blue-100'
                  }`}
                >{cat.name}</button>
              ))}
            </div>

            {activeCatName && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-500">Showing:</span>
                <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  {activeCatName}
                  <button onClick={() => handleCategoryChange(null)}><X size={12} /></button>
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategoryId}-${debSearch}-${sort}-${page}`}
                className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {productsLoading
                  ? Array.from({ length: 9 }).map((_, i) => <SkeletonProductCard key={i} />)
                  : products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetails={() => navigate(`/products/${p.id}`)}
                      />
                    ))
                }
              </motion.div>
            </AnimatePresence>

            {!productsLoading && products.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <span className="text-5xl block mb-4">??</span>
                <p className="font-display text-xl">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button onClick={clearFilters} className="mt-4 text-blue-500 text-sm hover:underline">Clear all filters</button>
              </div>
            )}

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-blue-100 text-slate-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                ><ChevronLeft size={16} /></button>

                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === 'ellipsis' ? (
                      <span key={`e${i}`} className="w-9 text-center text-slate-400 text-sm">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                          p === page ? 'bg-blue-500 text-white shadow-soft-md' : 'border border-blue-100 text-slate-600 hover:bg-blue-50'
                        }`}
                      >{p}</button>
                    )
                  )
                }

                <button
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-blue-100 text-slate-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                ><ChevronRight size={16} /></button>

                <span className="text-sm text-slate-400 ml-2">Page {page} of {meta.last_page}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
