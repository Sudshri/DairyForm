import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Truck, BadgeCheck } from 'lucide-react';

const CYAN  = { icon: '#17C0F2', bg: '#E0F8FF' };
const GREEN = { icon: '#8BC63E', bg: '#EEF7D8' };

const BADGES = [
  { icon: ShieldCheck, iconBg: CYAN.bg,  iconColor: CYAN.icon,  title: '100% Pure',         sub: 'No Added Preservatives' },
  { icon: Leaf,        iconBg: GREEN.bg, iconColor: GREEN.icon, title: 'Farm Fresh',         sub: 'Direct From Farmers' },
  { icon: Truck,       iconBg: CYAN.bg,  iconColor: CYAN.icon,  title: 'Same Day Delivery',  sub: 'On Time, Every Time' },
  { icon: BadgeCheck,  iconBg: GREEN.bg, iconColor: GREEN.icon, title: 'Quality Tested',     sub: "For Your Family's Safety" },
];

export default function TrustBadges() {
  return (
    <section className="py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 32px rgba(14,165,233,0.10)', border: '1px solid #E8F4FD' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* 2×2 on mobile, 4×1 on lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {BADGES.map(({ icon: Icon, iconBg, iconColor, title, sub }, i) => (
              <motion.div
                key={title}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:px-6 sm:py-5"
                style={{
                  borderRight:  (i % 2 === 0) ? '1px solid #F1F5F9' : 'none',
                  borderBottom: (i < 2)        ? '1px solid #F1F5F9' : 'none',
                  // On lg: always show right border except last
                  ...(i < 3 ? { '--lg-border': '1px solid #F1F5F9' } : {}),
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div
                  className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  style={{ background: iconBg }}
                >
                  <Icon size={18} style={{ color: iconColor }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm leading-tight truncate" style={{ color: '#1E293B' }}>{title}</p>
                  <p className="text-2xs sm:text-xs mt-0.5 leading-tight" style={{ color: '#64748B' }}>{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
