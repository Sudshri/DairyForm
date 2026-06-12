import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        ref={ref}
        className={clsx(
          'input',
          error && 'border-red-400 focus:ring-red-200 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
