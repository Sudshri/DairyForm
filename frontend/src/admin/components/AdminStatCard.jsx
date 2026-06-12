import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const COLORS = {
  sky:   { bg: 'bg-blue-50',   ring: 'ring-blue-200',   text: 'text-blue-600' },
  green: { bg: 'bg-green-50', ring: 'ring-green-200', text: 'text-green-600' },
  amber: { bg: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-600' },
  red:   { bg: 'bg-red-50',   ring: 'ring-red-200',   text: 'text-red-500' },
  violet:{ bg: 'bg-violet-50',ring: 'ring-violet-200',text: 'text-violet-600' },
};

export default function AdminStatCard({
  icon, label, value, sub,
  trend, trendLabel,
  color  = 'sky',
  index  = 0,
  onClick,
}) {
  const c = COLORS[color] ?? COLORS.sky;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl border border-slate-100 p-5',
        'shadow-sm hover:shadow-md transition-all duration-300',
        onClick && 'cursor-pointer hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={clsx(
          'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-4 text-xl',
          c.bg, c.ring
        )}>
          {icon}
        </div>

        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          )}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5 font-display">{value}</p>
        {(sub || trendLabel) && (
          <p className="text-xs text-slate-400 mt-1">{sub ?? trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
