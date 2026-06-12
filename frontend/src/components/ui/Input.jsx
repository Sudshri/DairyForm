import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(function Input(
  { label, error, hint, icon, iconRight, className, wrapperClassName, ...props },
  ref
) {
  return (
    <div className={clsx('flex flex-col gap-0', wrapperClassName)}>
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-field',
            icon      && 'pl-11',
            iconRight && 'pr-11',
            error     && '!border-red-300 !ring-red-100',
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="input-error">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
});

export default Input;
