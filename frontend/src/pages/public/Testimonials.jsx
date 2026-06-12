import { motion } from 'framer-motion';
import { useState } from 'react';
import TestimonialCard from '@/components/ui/TestimonialCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { FloatingBlob } from '@/components/ui/MilkWave';
import MilkWave from '@/components/ui/MilkWave';

const ALL_TESTIMONIALS = [
  { name:'Priya Sharma',    rating:5, location:'Pune',      comment:"The milk is so fresh and the delivery is always on time. My kids love the A2 milk!", verified:true },
  { name:'Rahul Mehta',     rating:5, location:'Mumbai',    comment:"Pure ghee that reminds me of my grandmother's kitchen. Absolutely divine taste.", verified:true },
  { name:'Anita Desai',     rating:4, location:'Nagpur',    comment:"Packaging is excellent — products always arrive fresh. Would recommend!", verified:true },
  { name:'Suresh Patel',    rating:5, location:'Ahmedabad', comment:"I've tried many dairy brands but DairyForm is genuinely different. You can taste the quality.", verified:false },
  { name:'Kavita Singh',    rating:5, location:'Nashik',    comment:"Butter quality is incredible. Perfect for cooking and spreading. Family favourite!", verified:true },
  { name:'Arjun Nair',      rating:4, location:'Thane',     comment:"Good quality products at reasonable prices. Delivery could be a little earlier though.", verified:true },
  { name:'Meena Krishnan',  rating:5, location:'Kolhapur',  comment:"The curd is thick and creamy — exactly like what I used to have in my hometown in Tamil Nadu.", verified:true },
  { name:'Deepak Joshi',    rating:5, location:'Solapur',   comment:"Running a restaurant and DairyForm has been our dairy partner for over a year. Never disappointed.", verified:false },
  { name:'Sunita Wagh',     rating:5, location:'Aurangabad',comment:"I switched from a local dairy to DairyForm and the difference is immediately obvious.", verified:true },
];

const FILTERS = ['All', '5 Stars', '4 Stars', 'Verified'];

export default function Testimonials() {
  const [filter, setFilter] = useState('All');

  const filtered = ALL_TESTIMONIALS.filter((t) => {
    if (filter === '5 Stars') return t.rating === 5;
    if (filter === '4 Stars') return t.rating === 4;
    if (filter === 'Verified') return t.verified;
    return true;
  });

  const avgRating = (ALL_TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / ALL_TESTIMONIALS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-milk-soft overflow-hidden">
      {/* Hero */}
      <section className="relative bg-dairy-hero pt-32 pb-24 overflow-hidden">
        <FloatingBlob color="#BAE6FD" size={500} opacity={0.3} className="top-0 -right-32" />
        <FloatingBlob color="#FDE8C8" size={300} opacity={0.25} className="bottom-10 -left-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <SectionHeader
            tag="⭐ Customer Reviews"
            title={<>What Our Customers<br />Are Saying</>}
            subtitle="Join 2,000+ happy families who trust DairyForm for their daily dairy needs."
          />
          {/* Stats row */}
          <div className="flex items-center justify-center gap-10 mt-10">
            {[
              { val: `${avgRating}/5`, lbl: 'Average Rating' },
              { val: ALL_TESTIMONIALS.length + '+', lbl: 'Reviews' },
              { val: '98%', lbl: 'Satisfaction Rate' },
              { val: '2K+', lbl: 'Happy Customers' },
            ].map(({ val, lbl }) => (
              <motion.div
                key={lbl}
                className="text-center"
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5 }}
              >
                <p className="font-display text-3xl font-bold text-blue-600">{val}</p>
                <p className="text-sm text-slate-500 mt-0.5">{lbl}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <MilkWave className="absolute bottom-0 inset-x-0" color="#FAFCFF" height={80} />
      </section>

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14">
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f ? 'bg-blue-500 text-white shadow-soft-md' : 'bg-white border border-blue-100 text-slate-600 hover:border-blue-300'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-400 self-center shrink-0">{filtered.length} reviews</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filtered.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
