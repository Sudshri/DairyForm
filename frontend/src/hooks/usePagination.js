import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialPerPage = 15) {
  const [page,    setPage]    = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const goTo    = useCallback((p)  => setPage(p), []);
  const next    = useCallback(()   => setPage((p) => p + 1), []);
  const prev    = useCallback(()   => setPage((p) => Math.max(1, p - 1)), []);
  const reset   = useCallback(()   => setPage(1), []);

  return { page, perPage, setPage: goTo, setPerPage, next, prev, reset };
}
