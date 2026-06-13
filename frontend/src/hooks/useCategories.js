import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/api/categoryApi';

export const MOCK_CATEGORIES = [
  { id:1, slug:'milk',   name:'Fresh Milk',    emoji:'🥛', description:'A2, toned, full cream', count:8,  color:'sky',   bg:'from-sky-50 to-sky-100'    },
  { id:2, slug:'ghee',   name:'Pure Ghee',     emoji:'🍯', description:'Cow & buffalo ghee',   count:5,  color:'amber', bg:'from-amber-50 to-cream-200' },
  { id:3, slug:'butter', name:'Butter',        emoji:'🧈', description:'Salted & unsalted',    count:4,  color:'yellow',bg:'from-yellow-50 to-cream-100' },
  { id:4, slug:'curd',   name:'Curd & Dahi',   emoji:'🥣', description:'Probiotic & sweet',    count:6,  color:'green', bg:'from-green-50 to-green-100' },
  { id:5, slug:'paneer', name:'Paneer',        emoji:'🧀', description:'Soft & firm varieties',count:3,  color:'cream', bg:'from-cream-100 to-cream-200' },
  { id:6, slug:'khoya',  name:'Khoya & Mawa',  emoji:'🍮', description:'For sweets & cooking', count:3,  color:'orange',bg:'from-orange-50 to-amber-50'  },
  { id:7, slug:'drinks', name:'Dairy Drinks',  emoji:'🥤', description:'Lassi, chaas & more',  count:7,  color:'blue',  bg:'from-blue-50 to-sky-50'     },
  { id:8, slug:'cheese', name:'Cheese',        emoji:'🧀', description:'Cheddar, mozzarella',  count:4,  color:'gold',  bg:'from-gold-300/20 to-cream-200'},
];

const normalizeProduct = (p) => ({
  ...p,
  name:             p.product_name      ?? p.name             ?? '',
  category:         p.category?.name    ?? p.category         ?? '',
  image:            p.images?.find((i) => i.is_primary)?.image_path
                    ?? p.images?.[0]?.image_path
                    ?? p.image
                    ?? null,
  shortDescription: p.short_description ?? p.shortDescription ?? null,
});

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  async () => {
      try {
        const res = await categoryApi.list();
        const items = res.data?.data;
        return Array.isArray(items) ? items : MOCK_CATEGORIES;
      }
      catch { return MOCK_CATEGORIES; }
    },
    staleTime: 600_000,
  });
}

export function useCategoryProducts(slug, params = {}) {
  return useQuery({
    queryKey: ['categories', slug, 'products', params],
    queryFn:  async () => {
      try {
        const res = await categoryApi.products(slug, params);
        const env = res.data;
        return { data: (env.data ?? []).map(normalizeProduct), meta: env.meta };
      } catch {
        const { MOCK_PRODUCTS } = await import('@/hooks/useProducts');
        const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
        const filtered = MOCK_PRODUCTS.filter((p) =>
          cat ? p.category.toLowerCase() === cat.name.split(' ')[0].toLowerCase() ||
                p.category.toLowerCase() === slug
              : true
        );
        return { data: filtered, meta: { total: filtered.length, current_page: 1, last_page: 1 } };
      }
    },
    enabled: !!slug,
  });
}
