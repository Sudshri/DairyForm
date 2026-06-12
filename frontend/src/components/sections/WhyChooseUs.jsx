import { motion } from 'framer-motion';
import { Leaf, Award, Clock, Truck, Shield, Heart } from 'lucide-react';

const FEATURES = [
  { icon: Leaf,   title:'100% Farm Fresh',        desc:'Sourced directly from our certified organic partner farms every morning.', bg:'#EEF7D8', border:'#C5E89F', icon_color:'#8BC63E' },
  { icon: Award,  title:'Best Quality Assurance', desc:'Every batch is tested in our quality lab before reaching your doorstep.',  bg:'#E0F8FF', border:'#A5EDFD', icon_color:'#17C0F2' },
  { icon: Clock,  title:'Daily Fresh Delivery',   desc:'Fresh dairy delivered every morning before 8 AM to preserve nutrition.',   bg:'#FFFBEB', border:'#FDE68A', icon_color:'#D97706' },
  { icon: Truck,  title:'Pan-City Delivery',      desc:'We deliver across the city with temperature-controlled logistics.',        bg:'#E0F8FF', border:'#A5EDFD', icon_color:'#17C0F2' },
  { icon: Shield, title:'Hygienic Packaging',     desc:'Food-grade, eco-friendly packaging to keep products fresh.',               bg:'#EEF7D8', border:'#C5E89F', icon_color:'#8BC63E' },
  { icon: Heart,  title:'Trusted by Thousands',   desc:'Over 2,000+ happy families and businesses rely on us daily.',              bg:'#FFF1F2', border:'#FECDD3', icon_color:'#E11D48' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20" style={{ background:'var(--d-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12 sm:mb-14"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="d-section-tag">✨ Why Us</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ color:'var(--d-text)' }}>
            Why Choose <span style={{ color:'var(--d-accent)' }}>DairyForm</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color:'var(--d-text-2)' }}>
            We're more than just a dairy brand — your trusted partner for pure, natural nutrition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, bg, border, icon_color }, i) => (
            <motion.div key={title}
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 group bg-white"
              style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}
              initial={{ opacity:0, y:24 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.08, duration:0.4 }}
              whileHover={{ y:-4, boxShadow:'var(--d-shadow-lg)', transition:{ duration:0.2 } }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background:'var(--d-gradient-accent)' }} />

              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: bg, border:`1px solid ${border}` }}>
                <Icon size={20} style={{ color: icon_color }} />
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg mb-2" style={{ color:'var(--d-text)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color:'var(--d-text-2)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
