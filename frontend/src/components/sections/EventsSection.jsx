import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, PartyPopper, Star } from 'lucide-react';

const EVENTS = [
  { icon: PartyPopper, title:'Marriage & Weddings',  desc:'Custom dairy packages for all wedding functions — from haldi to reception.', bg:'#FFFBEB', color:'#D97706' },
  { icon: Users,       title:'Party & Celebrations', desc:'Fresh dairy for birthday parties, kitty parties, and family gatherings.',     bg:'#E0F8FF', color:'#17C0F2' },
  { icon: Building2,   title:'Corporate Events',     desc:'Bulk dairy supply for office lunches, corporate meetings, and events.',       bg:'#EEF7D8', color:'#8BC63E' },
  { icon: Star,        title:'Religious Functions',  desc:'Pure milk, ghee and dairy for puja, havan, festivals, and ceremonies.',       bg:'#E0F8FF', color:'#168AC7' },
];

export default function EventsSection({ onBulkOrder }) {
  return (
    <section className="py-16 sm:py-20" style={{ background:'var(--d-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left content */}
          <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <span className="d-section-tag">🎊 Bulk & Events</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 leading-tight"
              style={{ color:'var(--d-text)' }}>
              Dairy for Every<br />
              <span style={{ color:'var(--d-accent)' }}>Occasion</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color:'var(--d-text-2)' }}>
              From intimate family gatherings to grand weddings with 1,000+ guests,
              fresh bulk dairy supply at the best prices with guaranteed quality.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {EVENTS.map(({ icon: Icon, title, desc, bg, color }) => (
                <motion.div key={title}
                  className="p-4 rounded-2xl group bg-white"
                  style={{ border:'1.5px solid var(--d-border-lt)' }}
                  whileHover={{ borderColor: color, boxShadow:`0 4px 16px ${color}22`, transition:{ duration:0.2 } }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: bg }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color:'var(--d-text)' }}>{title}</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color:'var(--d-text-2)' }}>{desc}</p>
                </motion.div>
              ))}
            </div>

            <button onClick={onBulkOrder} className="d-btn-accent text-sm sm:text-base px-8 py-3.5 flex items-center gap-2 w-fit">
              Place Bulk Order <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Right visual */}
          <motion.div className="relative" initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}>
            <div className="aspect-square rounded-3xl overflow-hidden relative"
              style={{ background:'linear-gradient(135deg,#E0F8FF,#EEF7D8)', border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-lg)' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                  {['🎊','🥛','🎂','🧈','💒','🍯'].map((e,i) => (
                    <motion.span key={i} className="text-3xl sm:text-4xl"
                      animate={{ scale:[1,1.12,1] }} transition={{ duration:2, repeat:Infinity, delay:i*0.3 }}>
                      {e}
                    </motion.span>
                  ))}
                </div>
                <p className="font-display text-base sm:text-xl font-bold mt-4 text-center" style={{ color:'var(--d-accent)' }}>
                  Fresh Dairy for Every Celebration
                </p>
              </div>
            </div>

            <motion.div className="absolute -bottom-3 right-4 sm:-bottom-4 px-4 py-3 sm:py-4 rounded-2xl"
              style={{ background:'#FFFFFF', border:'1px solid var(--d-border-lt)', boxShadow:'var(--d-shadow)' }}
              animate={{ y:[0,-6,0] }} transition={{ duration:3, repeat:Infinity }}>
              <p className="text-2xs" style={{ color:'var(--d-muted)' }}>Events Served</p>
              <p className="font-display text-2xl sm:text-3xl font-bold" style={{ color:'var(--d-accent)' }}>500+</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
