import { motion } from 'framer-motion';

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
              style={{ background:'linear-gradient(135deg,#E0F8FF,#EEF7D8)', border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-lg)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {[200,160,120,80].map((size,i) => (
                  <div key={size} className="absolute rounded-full border"
                    style={{
                      width: size, height: size,
                      borderColor: `rgba(23,192,242,${0.08+i*0.05})`,
                      animation: `spin ${12+i*4}s linear infinite${i%2?' reverse':''}`,
                    }} />
                ))}
                <span className="text-6xl sm:text-7xl relative z-10"
                  style={{ filter:'drop-shadow(0 4px 20px rgba(23,192,242,0.30))' }}>
                  🐄
                </span>
              </div>
              {['FSSAI Certified','ISO 22000','Zero Additives','A2 Certified'].map((label,i) => (
                <motion.div key={label}
                  className="absolute px-2.5 py-1 rounded-full text-2xs font-bold"
                  style={{
                    background:'var(--d-accent-lt)',
                    border:'1px solid rgba(23,192,242,0.22)',
                    color:'var(--d-accent-dk)',
                    top:    i<2?(i===0?'10%':'25%'):'auto',
                    bottom: i>=2?(i===2?'25%':'10%'):'auto',
                    left:   i%2===0?'5%':'auto',
                    right:  i%2!==0?'5%':'auto',
                  }}
                  animate={{ opacity:[0.7,1,0.7] }} transition={{ duration:2.5, repeat:Infinity, delay:i*0.5 }}>
                  ✓ {label}
                </motion.div>
              ))}
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
      </div>
    </section>
  );
}
