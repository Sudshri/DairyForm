import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function Pagination({ meta, onPageChange, className }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: cur, last_page: last, from, to, total } = meta;

  const pages = Array.from({ length: last }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === last || Math.abs(p - cur) <= 2
  );

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      <p className="text-sm text-slate-400">
        Showing {from}–{to} of {total} products
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(cur - 1)}
          disabled={cur === 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
                     hover:bg-blue-50 hover:text-blue-500 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && (
                <span className="text-slate-300 text-sm px-1">…</span>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onPageChange(p)}
                className={clsx(
                  'w-9 h-9 rounded-xl text-sm font-medium transition-all',
                  p === cur
                    ? 'bg-blue-500 text-white shadow-soft-md'
                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                )}
              >
                {p}
              </motion.button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(cur + 1)}
          disabled={cur === last}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
                     hover:bg-blue-50 hover:text-blue-500 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
