import { forwardRef, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GlassCard = forwardRef(function GlassCard(
  { children, className, tilt = false, glow = false, variant = 'default', onClick, ...props },
  ref
) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!tilt) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRotate({ x: -dy * 6, y: dx * 6 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const variants = {
    default: 'glass',
    heavy:   'glass-heavy',
    sky:     'glass-sky',
    cream:   'bg-cream-100/80 backdrop-blur-lg border border-cream-200/60',
    white:   'bg-white/95 backdrop-blur-md border border-blue-100/80',
  };

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
        if (ref) { typeof ref === 'function' ? ref(node) : (ref.current = node); }
      }}
      className={clsx(
        variants[variant],
        'rounded-3xl transition-all duration-350',
        glow && isHovered && 'shadow-glass-xl',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transform: tilt
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : undefined,
        transition: 'transform 0.15s ease-out, box-shadow 0.35s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export default GlassCard;
