import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const variantMap = {
  primary:  'btn-primary',
  outline:  'btn-outline',
  ghost:    'btn-ghost',
  cream:    'btn-cream',
  glass:    'btn-glass',
  danger:   'btn inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 hover:shadow-soft-md hover:-translate-y-0.5',
  white:    'btn bg-white text-blue-700 border border-blue-100 px-6 py-3 shadow-soft hover:shadow-soft-md hover:-translate-y-0.5',
};

const sizeMap = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-xl',
  icon: 'btn-icon',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, icon, iconRight, className, children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      disabled={loading || props.disabled}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        variantMap[variant],
        sizeMap[size],
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  );
});

export default Button;
