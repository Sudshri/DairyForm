import { useRef, useState, useEffect } from 'react';

export function useIntersection(options = {}) {
  const ref     = useRef(null);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([e]) => setEntry(e), {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
      ...options,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView: entry?.isIntersecting ?? false, entry };
}
