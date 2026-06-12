import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { productApi } from '@/api/productApi';
import { MOCK_PRODUCTS } from './useProducts';

export function useSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery    = useDebounce(query, 350);

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'search', debouncedQuery],
    queryFn:  async () => {
      if (!debouncedQuery.trim()) return [];
      try { return (await productApi.search(debouncedQuery)).data; }
      catch {
        return MOCK_PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).slice(0, 8);
      }
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  return { query, setQuery, results: data ?? [], isLoading, hasQuery: debouncedQuery.length >= 2 };
}
