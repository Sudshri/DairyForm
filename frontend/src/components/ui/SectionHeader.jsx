import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function SectionHeader({
  tag, title, subtitle,
  align = 'center',
  className,
  titleClassName,
}) {
  const alignMap = {
    center: 'text-center items-center',
    left:   'text-left items-start',
    right:  'text-right items-end',
  };

  return (
    <motion.div
      className={clsx('flex flex-col gap-3', alignMap[align], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {tag && <span className="section-tag">{tag}</span>}
      <h2 className={clsx('section-title text-balance', titleClassName)}>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}
