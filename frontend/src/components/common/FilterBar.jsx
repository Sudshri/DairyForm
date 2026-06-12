import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export default function FilterBar({
  search, onSearch,
  sort, onSort, sortOptions = [],
  activeFilters = [], onRemoveFilter,
  onOpenFilters,
  resultCount,
  className,
}) {
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const debounced = useDebounce(localSearch, 350);

  useEffect(() => { onSearch?.(debounced); }, [debounced]);

  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-10 text-sm"
            placeholder="Search products…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(''); onSearch?.(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        {sortOptions.length > 0 && (
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSort?.(e.target.value)}
              className="input-field text-sm w-auto pr-8 appearance-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}

        {/* Filter button */}
        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className={clsx(
              'btn-glass btn-sm flex items-center gap-2',
              activeFilters.length > 0 && 'ring-2 ring-blue-300'
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        )}

        {/* Result count */}
        {resultCount !== undefined && (
          <span className="text-sm text-slate-400 ml-auto shrink-0">
            {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </span>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                         bg-blue-100 text-blue-700 border border-blue-200"
            >
              {f.label}
              <button onClick={() => onRemoveFilter?.(f.key)} className="hover:text-blue-900">
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={() => activeFilters.forEach((f) => onRemoveFilter?.(f.key))}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
