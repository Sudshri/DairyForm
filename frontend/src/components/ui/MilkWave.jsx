import { clsx } from 'clsx';

export default function MilkWave({ className, height = 120, color = '#FFFFFF', speed = 8 }) {
  return (
    <div className={clsx('relative overflow-hidden pointer-events-none', className)} style={{ height }}>
      {/* Wave 1 */}
      <div
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ animation: `wave ${speed}s linear infinite` }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill={color}
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Wave 2 (offset) */}
      <div
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ animation: `wave ${speed * 1.4}s linear infinite reverse`, animationDelay: `-${speed * 0.3}s` }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path
            d="M0,20 C360,60 720,-20 1080,20 C1260,40 1380,10 1440,20 L1440,80 L0,80 Z"
            fill={color}
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Solid base */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: height * 0.35, background: color }} />
    </div>
  );
}

export function MilkDrop({ className, size = 40 }) {
  return (
    <div className={clsx('relative', className)}>
      <svg width={size} height={size * 1.3} viewBox="0 0 40 52" className="animate-drop-fall">
        <path
          d="M20 2 C20 2 4 22 4 34 C4 43.9 11.2 50 20 50 C28.8 50 36 43.9 36 34 C36 22 20 2 20 2Z"
          fill="url(#milkGrad)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="milkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>
        {/* Shine */}
        <ellipse cx="14" cy="28" rx="4" ry="6" fill="white" opacity="0.5" transform="rotate(-15 14 28)" />
      </svg>
    </div>
  );
}

export function FloatingBlob({ className, color = '#BAE6FD', size = 300, opacity = 0.4, delay = 0 }) {
  return (
    <div
      className={clsx('absolute rounded-full blur-3xl pointer-events-none blob-shape', className)}
      style={{
        width: size,
        height: size,
        background: color,
        opacity,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
