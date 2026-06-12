import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/categories/${category.slug}`}>
        <div className={clsx(
          'group relative overflow-hidden rounded-3xl bg-gradient-to-br',
          category.bg,
          'border border-white/60 shadow-card hover:shadow-card-hover',
          'transition-all duration-350 hover:-translate-y-1 cursor-pointer'
        )}>
          {/* Emoji */}
          <div className="p-6 pb-4">
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-350">
              {category.emoji}
            </div>
            <h3 className="font-display text-lg text-slate-800 leading-tight mb-0.5">
              {category.name}
            </h3>
            <p className="text-sm text-slate-500 leading-snug">{category.description}</p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <span className="text-xs text-slate-400">{category.count} products</span>
            <span className="w-8 h-8 rounded-full glass flex items-center justify-center
                             text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50
                             translate-x-2 group-hover:translate-x-0
                             transition-all duration-300">
              <ArrowRight size={14} />
            </span>
          </div>

          {/* Hover glow overlay */}
          <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/5
                          transition-colors duration-350 pointer-events-none rounded-3xl" />
        </div>
      </Link>
    </motion.div>
  );
}
