import { clsx } from 'clsx';

const variants = {
  sky:     'badge-sky',
  cream:   'badge-cream',
  green:   'badge-green',
  red:     'badge-red',
  gold:    'badge-gold',
  slate:   'badge bg-slate-100 text-slate-600',
  white:   'badge bg-white text-slate-600 border border-slate-100',
};

export default function Badge({ variant = 'sky', children, className }) {
  return (
    <span className={clsx(variants[variant], className)}>
      {children}
    </span>
  );
}
