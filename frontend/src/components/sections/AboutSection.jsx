import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Building2, Receipt } from 'lucide-react';
import section1 from '../../assets/section1.png';

const REGISTRATIONS = [
  { icon: Building2,   label:'UDYAM Registration', value:'UDYAM-RJ-30-0003396', bg:'#FFFBEB', color:'#D97706' },
  { icon: Receipt,     label:'GST Registration',   value:'08AIYPH7023E1Z2',     bg:'#EEF7D8', color:'#8BC63E' },
  { icon: ShieldCheck, label:'FSSAI License',       value:'12225039000413',       bg:'#E0F8FF', color:'#17C0F2' },
];

const PILLARS = [
  { label:'Vision',            text:'To be India\'s most trusted dairy brand delivering pure, natural products to millions of families.' },
  { label:'Mission',           text:'Farm-fresh dairy through ethical farming, sustainable practices, and a deep commitment to quality.' },
  { label:'Quality Standards', text:'Every product batch undergoes rigorous lab testing for fat content, SNF, hygiene, and freshness.' },
];

const HIGHLIGHTS = [
  'Established in 2010 with a single farm',
  '50+ premium dairy products',
  'Partnered with 200+ ethical farms',
  'ISO 22000 & FSSAI certified',
  'Serving 2,000+ customers daily',
  'Zero artificial preservatives',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20" style={{ background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left content */}
          <motion.div
            initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
          >
            <span className="d-section-tag">🏭 About Us</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-5 leading-tight"
              style={{ color:'var(--d-text)' }}>
              Rooted in Tradition,<br />
              <span style={{ color:'var(--d-accent)' }}>Driven by Quality</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color:'var(--d-text-2)' }}>
              DairyForm was born from a simple belief: every family deserves pure, natural dairy products
              as good as what grandmothers made at home. From a single farm in Maharashtra,
              we've grown into a trusted dairy brand serving thousands of families.
            </p>

            <div className="space-y-3 mb-8">
              {PILLARS.map(({ label, text }) => (
                <div key={label} className="p-4 rounded-2xl"
                  style={{ background:'var(--d-input)', border:'1px solid var(--d-border-lt)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:'var(--d-accent)' }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--d-text-2)' }}>{text}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {HIGHLIGHTS.map(h => (
                <div key={h} className="flex items-center gap-2 text-sm" style={{ color:'var(--d-text-2)' }}>
                  <CheckCircle size={14} style={{ color:'var(--d-accent)', flexShrink:0 }} />{h}
                </div>
              ))}
            </div>

            <div className="pt-6" style={{ borderTop:'1px solid var(--d-border-lt)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:'var(--d-muted)' }}>
                Certifications &amp; Registrations
              </p>
              <div className="space-y-2">
                {REGISTRATIONS.map(({ icon: Icon, label, value, bg, color }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background:'var(--d-input)', border:'1px solid var(--d-border-lt)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold" style={{ color:'var(--d-text)' }}>{label}</p>
                      <p className="text-2xs font-mono" style={{ color:'var(--d-muted)' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div className="relative"
            initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.1 }}
          >
            <div className="aspect-square rounded-3xl overflow-hidden relative"
              style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-lg)' }}>
              <img
                src={section1}
                alt="Farm to Your Doorstep"
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-4 py-3 rounded-2xl"
              style={{ background:'#FFFFFF', border:'1px solid var(--d-border-lt)', boxShadow:'var(--d-shadow)' }}
              animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity }}>
              <p className="text-xs" style={{ color:'var(--d-muted)' }}>Since</p>
              <p className="font-display text-2xl font-bold" style={{ color:'var(--d-accent)' }}>2010</p>
            </motion.div>
            <motion.div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 px-4 py-3 rounded-2xl"
              style={{ background:'#FFFFFF', border:'1px solid var(--d-border-lt)', boxShadow:'var(--d-shadow)' }}
              animate={{ y:[0,-6,0] }} transition={{ duration:3.5, repeat:Infinity, delay:0.8 }}>
              <p className="text-xs" style={{ color:'var(--d-muted)' }}>Farms Partnered</p>
              <p className="font-display text-2xl font-bold" style={{ color:'var(--d-accent)' }}>200+</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
