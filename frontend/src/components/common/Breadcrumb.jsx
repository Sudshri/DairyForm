import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-1 text-sm', className)}>
      <Link to="/"
        className="flex items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors">
        <Home size={13} />
      </Link>
      {items.map(({ label, to }, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={label} className="flex items-center gap-1">
            <ChevronRight size={13} className="text-slate-300" />
            {isLast ? (
              <span className="text-slate-600 font-medium">{label}</span>
            ) : (
              <Link to={to} className="text-slate-400 hover:text-blue-500 transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
