import { useState } from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

export default function StarRating({ value = 0, max = 5, interactive = false, size = 16, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = (hover ?? value) > i;
        return (
          <Star
            key={i}
            size={size}
            className={clsx(
              'transition-colors duration-150',
              filled ? 'text-gold-400 fill-gold-400' : 'text-slate-200 fill-slate-200',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onMouseLeave={() => interactive && setHover(null)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
