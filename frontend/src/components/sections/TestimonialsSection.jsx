import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';

const MOCK = [
  { id:1, user:{name:'Ramesh Kumar'},   rating:5, comment:"The A2 milk quality is outstanding. My kids refused store-bought milk after trying DairyForm!", location:'Pune' },
  { id:2, user:{name:'Priya Sharma'},   rating:5, comment:"The ghee reminds me of my grandmother's homemade ghee. Pure aroma, incredible taste.", location:'Mumbai' },
  { id:3, user:{name:'Chef Mahesh'},    rating:5, comment:"As a professional chef, I use DairyForm paneer exclusively. Quality is consistent.", location:'Nashik' },
  { id:4, user:{name:'Anita Desai'},    rating:5, comment:"Ordered 50kg ghee for my daughter's wedding. On-time, fresh, perfect cold-chain.", location:'Pune' },
  { id:5, user:{name:'Suresh Patel'},   rating:4, comment:"Best dahi in the city. Thick, creamy consistency. My smoothies have never been better.", location:'Nagpur' },
  { id:6, user:{name:'Hotel Manager'}, rating:5, comment:"Bulk dairy for our hotel for 2 years. Quality never drops. DairyForm is a reliable partner.", location:'Aurangabad' },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn:  () => apiGet(API.ADMIN.REVIEWS.LIST, { is_approved:true, per_page:12 }).then(r => r.data?.data ?? MOCK),
    staleTime: 300_000,
  });

  const reviews = data ?? MOCK;
  const count   = reviews.length;
  const VISIBLE = 3;

  const next = useCallback(() => setCurrent(c => (c+1)%count), [count]);
  const prev = useCallback(() => setCurrent(c => (c-1+count)%count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  const visible = Array.from({ length: Math.min(VISIBLE, count) }, (_, i) => reviews[(current+i)%count]);

  return (
    <section className="py-16 sm:py-20" style={{ background:'var(--d-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10 sm:mb-12"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="d-section-tag">⭐ Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ color:'var(--d-text)' }}>
            What Our Customers <span style={{ color:'var(--d-accent)' }}>Say</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color:'var(--d-text-2)' }}>
            Join thousands of happy families who trust DairyForm.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {visible.map((review, i) => (
            <motion.div key={`${review.id}-${current}-${i}`}
              className="p-5 sm:p-6 rounded-2xl flex flex-col gap-4 bg-white"
              style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}
              initial={{ opacity:0, y:20, scale:0.97 }}
              animate={{ opacity:1, y:0, scale:1 }}
              transition={{ delay:i*0.06, duration:0.4 }}
            >
              <Quote size={24} style={{ color:'var(--d-accent-lt)' }} />

              <p className="text-sm leading-relaxed flex-1 italic" style={{ color:'var(--d-text-2)' }}>
                "{review.comment ?? review.review}"
              </p>

              <div className="flex gap-0.5">
                {Array.from({length:5}).map((_,j) => (
                  <Star key={j} size={13}
                    style={{ color: j<(review.rating??5) ? '#FBBF24':'#E2E8F0', fill: j<(review.rating??5) ? '#FBBF24':'#E2E8F0' }} />
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor:'var(--d-border-lt)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background:'var(--d-accent-lt)', color:'var(--d-accent)' }}>
                  {(review.user?.name ?? 'C')[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color:'var(--d-text)' }}>
                    {review.user?.name ?? review.name}
                  </p>
                  {(review.location ?? review.user?.city) && (
                    <p className="text-xs" style={{ color:'var(--d-muted)' }}>📍 {review.location ?? review.user?.city}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white"
            style={{ border:'1.5px solid var(--d-border-lt)', color:'var(--d-text-2)', boxShadow:'var(--d-shadow-sm)' }}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {reviews.map((_,i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{ width:i===current?'1.75rem':'0.5rem', height:'0.5rem', background:i===current?'var(--d-accent)':'rgba(23,192,242,0.22)' }} />
            ))}
          </div>
          <button onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white"
            style={{ border:'1.5px solid var(--d-border-lt)', color:'var(--d-text-2)', boxShadow:'var(--d-shadow-sm)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
