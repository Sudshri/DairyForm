import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const touchStartX = useRef(null);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['banners', 'slider'],
    queryFn: () =>
      apiGet(API.BANNERS.LIST, { type: 'slider' }).then(r => r.data?.data ?? []),
    staleTime: 300000,
  });

  const slides = data || [];
  const count  = slides.length;

  const go = useCallback(n => {
    if (!count) return;
    setCurrent((n + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, paused, count, go]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden aspect-[3/1]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background slides */}
      {count > 0 ? (
        slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 flex items-center justify-center"
            style={{ opacity: i === current ? 1 : 0, background: '#FFFFFF' }}
          >
            <img
              src={slide.image}
              alt={slide.title || 'Banner'}
              className="w-full h-full object-cover object-center"
             
            />
          </div>
        ))
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #A9E0F8 0%, #EFF6FF 40%, #F0FDF4 100%)' }}
        />
      )}

      {/* Arrow controls — hidden on xs, shown sm+ */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.90)' }}
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
          <button
            onClick={() => go(current + 1)}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.90)' }}
          >
            <ChevronRight size={20} className="text-slate-700" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: i === current ? '1.75rem' : '0.375rem', background: i === current ? '#fff' : 'rgba(255,255,255,0.5)' }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
