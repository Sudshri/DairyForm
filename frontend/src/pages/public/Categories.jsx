import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import Breadcrumb from '@/components/common/Breadcrumb';
import SectionHeader from '@/components/ui/SectionHeader';
import CategoryCard from '@/components/product/CategoryCard';
import ProductGrid from '@/components/product/ProductGrid';
import FilterBar from '@/components/common/FilterBar';
import Pagination from '@/components/common/Pagination';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useCategories, useCategoryProducts, MOCK_CATEGORIES } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useState as useS } from 'react';

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'newest',     label: 'Newest' },
];

// ── Category listing (no slug) ──────────────────────────────────
function AllCategories() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <>
      <SEOHead title="Shop by Category" />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
        <FloatingBlob color="#BAE6FD" size={400} opacity={0.2} className="top-20 -right-32" />
        <FloatingBlob color="#FDE8C8" size={280} opacity={0.2} className="bottom-40 -left-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Breadcrumb items={[{ label: 'Categories', to: '/categories' }]} className="mb-6" />
          <SectionHeader
            tag="🧺 Browse by Category"
            title="Shop by Category"
            subtitle="Choose from our range of pure, farm-fresh dairy products."
            className="mb-12"
          />

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-44 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {(categories.length ? categories : MOCK_CATEGORIES).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Single category (with products) ─────────────────────────────
function CategoryDetail({ slug }) {
  const navigate           = useNavigate();
  const { page, setPage }  = usePagination(1, 12);
  const [search, setSearch] = useState('');
  const [sort,   setSort]   = useState('popular');
  const debSearch           = useDebounce(search, 350);

  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  // Reuse generic products hook with category filter
  const { data, isLoading } = useProducts({
    category: category?.name?.split(' ')[0],
    page,
    per_page: 12,
    search:   debSearch || undefined,
    sort_by:  sort,
  });

  const products = data?.data ?? [];
  const meta     = data?.meta;

  return (
    <>
      <SEOHead title={category?.name ?? slug} />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Categories', to: '/categories' },
              { label: category?.name ?? slug, to: `/categories/${slug}` },
            ]}
            className="mb-6"
          />

          {/* Category hero */}
          <motion.div
            className={`relative overflow-hidden rounded-4xl bg-gradient-to-br ${category?.bg ?? 'from-blue-50 to-blue-100'}
                        p-8 mb-10 flex items-center gap-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="text-7xl shrink-0">{category?.emoji ?? '🥛'}</span>
            <div>
              <h1 className="font-display text-3xl text-slate-800 mb-1">{category?.name ?? slug}</h1>
              <p className="text-slate-500">{category?.description}</p>
              <p className="text-sm text-blue-500 font-semibold mt-1">{category?.count} products available</p>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="ml-auto p-2 rounded-2xl hover:bg-white/50 text-slate-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </motion.div>

          {/* Filter bar */}
          <FilterBar
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={(s) => { setSort(s); setPage(1); }}
            sortOptions={SORT_OPTIONS}
            resultCount={meta?.total}
            className="mb-8"
          />

          {/* Products */}
          <ProductGrid products={products} isLoading={isLoading} cols={4} />

          {/* Pagination */}
          {meta && (
            <div className="mt-10">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Router outlet ────────────────────────────────────────────────
export default function Categories() {
  const { slug } = useParams();
  return slug ? <CategoryDetail slug={slug} /> : <AllCategories />;
}
