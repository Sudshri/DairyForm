import { clsx } from 'clsx';

const colors = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  blue:   'bg-blue-100 text-blue-700',
  slate:  'bg-slate-100 text-slate-600',
};

export default function Badge({ color = 'slate', children }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', colors[color])}>
      {children}
    </span>
  );
}
