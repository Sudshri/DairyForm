import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function EmptyState({
  emoji = '🔍',
  title = 'Nothing here yet',
  description,
  action,
  actionLabel = 'Go Back',
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-6xl mb-5 block animate-bounce-soft">{emoji}</span>
      <h3 className="font-display text-2xl text-slate-700 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action && (
        <Button variant="outline" onClick={action}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
