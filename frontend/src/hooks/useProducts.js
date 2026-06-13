import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { addItem } from '@/store/redux/cartSlice';

const normalize = (p) => ({
  ...p,
  name:             p.product_name       ?? p.name             ?? '',
  category:         p.category?.name     ?? p.category         ?? '',
  image:            p.images?.find((i) => i.is_primary)?.image_path
                    ?? p.images?.[0]?.image_path
                    ?? p.image
                    ?? null,
  shortDescription: p.short_description  ?? p.shortDescription ?? null,
});

const KEYS = {
  all:         ['products'],
  list:        (p) => ['products', 'list', p],
  detail:      (id) => ['products', id],
  featured:    ['products', 'featured'],
  newArrivals: ['products', 'new-arrivals'],
  bestSellers: ['products', 'best-sellers'],
  related:     (id) => ['products', id, 'related'],
  reviews:     (id) => ['products', id, 'reviews'],
  search:      (q)  => ['products', 'search', q],
};

// ── Mock data (used when API is unavailable in dev) ──────────────
const MOCK_PRODUCTS = [
  { id:1,  name:'Farm Fresh Full Cream Milk A2', category:'Milk',   price:65,  unit:'litre', rating:4.8, reviews:124, isNew:true,  image:null },
  { id:2,  name:'Pure Cow Ghee A2',             category:'Ghee',   price:850, unit:'kg',    rating:4.9, reviews:87,  isBest:true, image:null },
  { id:3,  name:'Homestyle Butter Unsalted',    category:'Butter', price:280, unit:'500g',  rating:4.7, reviews:63,  discount:10, image:null },
  { id:4,  name:'Probiotic Dahi',               category:'Curd',   price:90,  unit:'kg',    rating:4.6, reviews:45,  image:null },
  { id:5,  name:'Toned Milk',                   category:'Milk',   price:52,  unit:'litre', rating:4.5, reviews:38,  image:null },
  { id:6,  name:'Buffalo Milk',                 category:'Milk',   price:75,  unit:'litre', rating:4.7, reviews:29,  image:null },
  { id:7,  name:'Organic Butter Salted',        category:'Butter', price:310, unit:'500g',  rating:4.8, reviews:51,  image:null },
  { id:8,  name:'Fresh Paneer',                 category:'Paneer', price:180, unit:'200g',  rating:4.6, reviews:72,  image:null },
  { id:9,  name:'Mishti Doi',                   category:'Curd',   price:70,  unit:'200g',  rating:4.7, reviews:34,  image:null },
  { id:10, name:'Lassi (Sweet)',                category:'Drinks', price:45,  unit:'250ml', rating:4.5, reviews:28,  image:null },
  { id:11, name:'Chaas (Buttermilk)',           category:'Drinks', price:30,  unit:'200ml', rating:4.4, reviews:19,  image:null },
  { id:12, name:'Khoya / Mawa',                 category:'Khoya',  price:220, unit:'250g',  rating:4.8, reviews:41,  image:null },
];

const mockPage = (items, page = 1, perPage = 8, filters = {}) => {
  let filtered = [...items];
  if (filters.category) filtered = filtered.filter((p) => p.category === filters.category);
  if (filters.search)   filtered = filtered.filter((p) => p.name.toLowerCase().includes(filters.search.toLowerCase()));
  const total = filtered.length;
  const data  = filtered.slice((page - 1) * perPage, page * perPage);
  return {
    data,
    meta: { current_page: page, last_page: Math.ceil(total / perPage), total, from: (page-1)*perPage+1, to: Math.min(page*perPage, total), per_page: perPage },
  };
};

// ── Hooks ─────────────────────────────────────────────────────────

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn:  async () => {
      try {
        const res = await productApi.list(filters);
        const env = res.data;
        return { data: (env.data ?? []).map(normalize), meta: env.meta };
      } catch {
        return mockPage(MOCK_PRODUCTS, filters.page, filters.per_page, filters);
      }
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
}

export function useInfiniteProducts(filters = {}) {
  return useInfiniteQuery({
    queryKey: KEYS.list({ ...filters, infinite: true }),
    queryFn:  async ({ pageParam = 1 }) => {
      try {
        const res = await productApi.list({ ...filters, page: pageParam });
        return res.data;
      } catch {
        return mockPage(MOCK_PRODUCTS, pageParam, 8, filters);
      }
    },
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn:  async () => {
      try {
        const res = await productApi.get(id);
        return normalize(res.data?.data ?? res.data);
      } catch {
        return MOCK_PRODUCTS.find((p) => p.id === +id) ?? null;
      }
    },
    enabled: !!id,
    staleTime: 120_000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: KEYS.featured,
    queryFn:  async () => {
      try { return (await productApi.featured()).data; }
      catch { return MOCK_PRODUCTS.filter((p) => p.isBest || p.isNew).slice(0, 4); }
    },
    staleTime: 300_000,
  });
}

export function useRelatedProducts(id) {
  return useQuery({
    queryKey: KEYS.related(id),
    queryFn:  async () => {
      try { return (await productApi.related(id)).data; }
      catch { return MOCK_PRODUCTS.filter((p) => p.id !== +id).slice(0, 4); }
    },
    enabled: !!id,
    staleTime: 120_000,
  });
}

export function useProductReviews(id) {
  return useQuery({
    queryKey: KEYS.reviews(id),
    queryFn:  async () => {
      try { return (await productApi.reviews(id)).data; }
      catch { return [
        { id:1, name:'Priya S.', rating:5, date:'2 days ago',  comment:'Absolutely the freshest!' },
        { id:2, name:'Arjun M.', rating:5, date:'1 week ago',  comment:'A2 quality is top notch.' },
        { id:3, name:'Meena K.', rating:4, date:'2 weeks ago', comment:'Great product overall.' },
      ]; }
    },
    enabled: !!id,
  });
}

export function useAddReview(productId) {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => productApi.addReview(productId, data),
    onSuccess: () => {
      qc.invalidateQueries(KEYS.reviews(productId));
      dispatch(setNotification({ type: 'success', message: 'Review submitted!' }));
    },
  });
}

export function useAddToCart() {
  const dispatch = useDispatch();
  return (product, qty = 1) => {
    dispatch(addItem({ product, qty }));
    dispatch(setNotification({ type: 'success', message: `${product.name} added to cart` }));
  };
}

export { MOCK_PRODUCTS };
