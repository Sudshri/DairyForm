import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import Breadcrumb from '@/components/common/Breadcrumb';
import SectionHeader from '@/components/ui/SectionHeader';
import CategoryCard from '@/components/product/CategoryCard';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/common/Pagination';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useCategories, useCategoryProducts, MOCK_CATEGORIES } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'total_sales', label: 'Most Popular' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest' },
];

function AllCategories() {
  const { data: categoriesRaw = [], isLoading } = useCategories();
  const categories = categoriesRaw.length ? categoriesRaw : MOCK_CATEGORIES;

  return (
    <>
      <SEOHead title="Shop by Category" />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
        <FloatingBlob color="#BAE6FD" size={400} opacity={0.2} className="top-20 -right-32" />
        <FloatingBlob color="#FDE8C8" size={280} opacity={0.2} className="bottom-40 -left-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Breadcrumb items={[{ label: 'Categories', to: '/categories' }]} className="mb-6" />
          <SectionHeader
            tag="Browse by Category"
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
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryDetail({ slug }) {
  const navigate              = useNavigate();
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [sort,    setSort]    = useState('total_sales');
  const debSearch             = useDebounce(search, 350);

  const sortDir = sort === 'price_asc' ? 'asc' : 'desc';
  const sortBy  = sort === 'price_asc' || sort === 'price_desc' ? 'selling_price' : sort;

  const { data: catData, isLoading: catLoading } = useCategoryProducts(slug, {
    page,
    per_page:  12,
    search:    debSearch || undefined,
    sort_by:   sortBy,
    sort_dir:  sortDir,
  });

  const { data: allCategories = [] } = useCategories();
  const categories = allCategories.length ? allCategories : MOCK_CATEGORIES;
  const category = categories.find((c) => c.slug === slug);

  const products = catData?.data ?? [];
  const meta     = catData?.meta;

  const CAT_COLORS = {
    sky: 'from-sky-50 to-sky-100',
    amber: 'from-amber-50 to-amber-100',
    green: 'from-green-50 to-green-100',
    orange: 'from-orange-50 to-amber-50',
    blue: 'from-blue-50 to-sky-50',
    cream: 'from-yellow-50 to-amber-50',
    gold: 'from-yellow-50 to-amber-50',
  };

  const bgClass = (category?.color && CAT_COLORS[category.color]) ? CAT_COLORS[category.color] : 'from-blue-50 to-sky-100';

  return (
    <>
      <SEOHead title={category?.name ?? slug} />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <Breadcrumb
            items={[
              { label: 'Categories', to: '/categories' },
              { label: category?.name ?? slug, to: `/categories/${slug}` },
            ]}
            className="mb-6"
          />

          <motion.div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgClass} p-8 mb-10 flex items-center gap-6`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          >
            {category?.image ? (
              <img src={category.image} alt={category.name} className="w-20 h-20 object-contain shrink-0" />
            ) : (
              <span className="text-7xl shrink-0">{category?.emoji ?? '??'}</span>
            )}
            <div>
              <h1 className="font-display text-3xl text-slate-800 mb-1">{category?.name ?? slug}</h1>
              {category?.description && <p className="text-slate-500">{category.description}</p>}
              {meta && <p className="text-sm text-blue-500 font-semibold mt-1">{meta.total} products available</p>}
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="ml-auto p-2 rounded-2xl hover:bg-white/50 text-slate-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </motion.div>

          {/* Search + Sort bar */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-10"
                placeholder="Search in this category..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input-field w-auto text-sm"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {meta && <span className="text-sm text-slate-400 ml-auto">{meta.total} products</span>}
          </div>

          <ProductGrid products={products} isLoading={catLoading} cols={4} />

          {meta && meta.last_page > 1 && (
            <div className="mt-10">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Categories() {
  const { slug } = useParams();
  return slug ? <CategoryDetail slug={slug} /> : <AllCategories />;
}
