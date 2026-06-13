import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Receipt, Utensils } from 'lucide-react';
import section3 from '../../assets/section3.png';

const CERTS = [
  { icon: ShieldCheck, label:'FSSAI Licensed',        value:'12225039000413',    bg:'#E0F8FF', color:'#17C0F2' },
  { icon: Receipt,     label:'GST Registered',        value:'08AIYPH7023E1Z2',  bg:'#EEF7D8', color:'#8BC63E' },
  { icon: Building2,   label:'UDYAM / MSME Registered', value:'UDYAM-RJ-30-0003396', bg:'#FFFBEB', color:'#D97706' },
];

const STORIES = [
  { emoji:'🌾', title:'Traditional Taste',    desc:'Our ghee is made using the ancient bilona method — slow-churning curd from A2 milk.', color:'#D97706' },
  { emoji:'🥛', title:'Fresh Milk Products',  desc:'Collected twice daily, chilled immediately, dispatched before sunrise for your home.',color:'#17C0F2' },
  { emoji:'🌿', title:'Pure Ingredients',     desc:'Zero artificial additives, preservatives, or colorants. Honest dairy products.',       color:'#8BC63E' },
  { emoji:'⚗️', title:'Natural Processing',   desc:'Minimal processing preserves natural nutrients, vitamins and beneficial enzymes.',      color:'#168AC7' },
  { emoji:'🚜', title:'Farm to Home',         desc:'Our supply chain is under 12 hours — every drop was collected this morning.',           color:'#17C0F2' },
];

export default function QualitySection() {
  return (
    <section className="py-16 sm:py-20" style={{ background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left visual */}
          <motion.div className="relative"
            initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="aspect-square rounded-3xl overflow-hidden relative"
              style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-lg)' }}>
              <img src={section3} alt="Purity & Quality" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Right stories */}
          <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}>
            <span className="d-section-tag">🔬 Quality Story</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-6 leading-tight"
              style={{ color:'var(--d-text)' }}>
              Our Commitment to<br />
              <span style={{ color:'var(--d-accent)' }}>Purity & Quality</span>
            </h2>
            <div className="space-y-4">
              {STORIES.map(({ emoji, title, desc, color }, i) => (
                <motion.div key={title}
                  className="flex gap-4 p-4 rounded-2xl group bg-white"
                  style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}
                  initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                  whileHover={{ borderColor: color, boxShadow:`0 4px 16px ${color}22`, transition:{ duration:0.2 } }}>
                  <div className="text-2xl sm:text-3xl shrink-0 mt-0.5">{emoji}</div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color:'var(--d-text-2)' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Certifications strip */}
        <motion.div className="mt-12 sm:mt-14"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.15 }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color:'var(--d-muted)' }}>
            Certifications &amp; Registrations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CERTS.map(({ icon: Icon, label, value, bg, color }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
                style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold" style={{ color:'var(--d-text)' }}>{label}</p>
                  <p className="text-2xs font-mono truncate" style={{ color:'var(--d-muted)' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
