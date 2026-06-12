import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import GlassCard from './GlassCard';
import { clsx } from 'clsx';

export default function StatCard({ icon, label, value, trend, trendLabel, color = 'sky', index = 0 }) {
  const colorMap = {
    sky:   { bg: 'bg-blue-100',   icon: 'text-blue-600',   ring: 'ring-blue-200' },
    cream: { bg: 'bg-cream-200', icon: 'text-amber-600', ring: 'ring-cream-300' },
    green: { bg: 'bg-green-100', icon: 'text-green-600', ring: 'ring-green-200' },
    red:   { bg: 'bg-red-100',   icon: 'text-red-500',   ring: 'ring-red-200' },
  };
  const c = colorMap[color];
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <GlassCard variant="white" className="p-5 flex items-center gap-4">
        <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center ring-4', c.bg, c.ring)}>
          <span className={clsx('text-xl', c.icon)}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-accent">{label}</p>
          <p className="text-2xl font-bold text-slate-800 font-display leading-tight">{value}</p>
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
