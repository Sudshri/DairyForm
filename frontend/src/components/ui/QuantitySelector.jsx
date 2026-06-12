import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value = 1, min = 1, max = 99, onChange }) {
  const dec = () => value > min && onChange(value - 1);
  const inc = () => value < max && onChange(value + 1);

  return (
    <div className="flex items-center gap-0 glass rounded-2xl overflow-hidden border border-blue-100">
      <button
        onClick={dec}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-blue-600
                   hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-slate-800 select-none">
        {value}
      </span>
      <button
        onClick={inc}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-blue-600
                   hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
