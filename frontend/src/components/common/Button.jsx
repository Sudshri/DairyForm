import { forwardRef } from 'react';
import { clsx } from 'clsx';

const variants = {
  primary:   'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-white border border-surface-border text-slate-700 hover:bg-surface-secondary',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-slate-600 hover:bg-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={loading || props.disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
});

export default Button;
