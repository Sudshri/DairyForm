import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Truck, BadgeCheck } from 'lucide-react';

/* Brand palette — logo sky-blue + lime-green */
const CYAN  = { icon: '#17C0F2', bg: '#E0F8FF' };
const GREEN = { icon: '#8BC63E', bg: '#EEF7D8' };

const BADGES = [
  {
    icon: ShieldCheck,
    iconBg: CYAN.bg,
    iconColor: CYAN.icon,
    title: '100% Pure',
    sub: 'No Added Preservatives',
  },
  {
    icon: Leaf,
    iconBg: GREEN.bg,
    iconColor: GREEN.icon,
    title: 'Farm Fresh',
    sub: 'Direct From Farmers',
  },
  {
    icon: Truck,
    iconBg: CYAN.bg,
    iconColor: CYAN.icon,
    title: 'Same Day Delivery',
    sub: 'On Time, Every Time',
  },
  {
    icon: BadgeCheck,
    iconBg: GREEN.bg,
    iconColor: GREEN.icon,
    title: 'Quality Tested',
    sub: "For Your Family's Safety",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="bg-white rounded-2xl shadow-lg grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100"
          style={{ boxShadow: '0 4px 32px rgba(14,165,233,0.10)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {BADGES.map(({ icon: Icon, iconBg, iconColor, title, sub }, i) => (
            <motion.div
              key={title}
              className="flex items-center gap-4 px-6 py-5 sm:py-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: iconBg }}
              >
                <Icon size={22} style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base leading-tight" style={{ color: '#1E293B' }}>{title}</p>
                <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#64748B' }}>{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
