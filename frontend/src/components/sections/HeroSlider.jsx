import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
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

  return (
    <section
      className="relative w-full h-[350px] sm:h-[500px] lg:h-[650px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ─────────────────────────────────────── */}
      {count > 0 ? (
        slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.title || 'Banner'}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))
      ) : (
        /* Fallback when no slides loaded yet */
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #A9E0F8 0%, #EFF6FF 40%, #F0FDF4 100%)' }}
        />
      )}

      {/* ── Dark gradient overlay for text legibility ─────────────── */}
      <div
        className="absolute inset-0"
        // style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.04) 100%)' }}
      />

    

      {/* ── Arrow controls ────────────────────────────────────────── */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.90)' }}
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
          <button
            onClick={() => go(current + 1)}
            aria-label="Next slide"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.90)' }}
          >
            <ChevronRight size={20} className="text-slate-700" />
          </button>
        </>
      )}

      {/* ── Dot indicators ────────────────────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
