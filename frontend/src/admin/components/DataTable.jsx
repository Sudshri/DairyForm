import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Search, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { clsx } from 'clsx';

/**
 * DataTable — reusable admin table with search, sort, pagination, actions.
 *
 * Props:
 *   columns  [{ key, label, render?, sortable?, width? }]
 *   data     []
 *   loading  boolean
 *   meta     { current_page, last_page, total, per_page }   (server-side)
 *   onPage   (page) => void   — if provided, uses server-side pagination
 *   actions  [{ label, icon, onClick, variant? }]
 *   searchable  boolean
 *   onSearch    (value) => void  — if provided, search is server-side
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  meta,
  onPage,
  actions = [],
  searchable = true,
  onSearch,
  emptyText  = 'No records found',
  rowKey     = 'id',
  onRowClick,
  className,
}) {
  const [sortKey,    setSort]       = useState(null);
  const [sortDir,    setSortDir]    = useState('asc');
  const [localSearch, setLocalSearch] = useState('');
  const [localPage,   setLocalPage]   = useState(1);
  const PER_PAGE = 10;

  // Client-side sort+filter (when no server handlers)
  const processed = useMemo(() => {
    let rows = [...data];

    if (searchable && !onSearch && localSearch) {
      rows = rows.filter((row) =>
        columns.some(({ key }) =>
          String(row[key] ?? '').toLowerCase().includes(localSearch.toLowerCase())
        )
      );
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        const cmp = String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, localSearch, sortKey, sortDir, onSearch, searchable, columns]);

  // Client-side pagination (when no server meta)
  const pagedData  = meta ? processed : processed.slice((localPage - 1) * PER_PAGE, localPage * PER_PAGE);
  const totalPages = meta ? meta.last_page : Math.max(1, Math.ceil(processed.length / PER_PAGE));
  const currentPage = meta ? meta.current_page : localPage;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(key);
      setSortDir('asc');
    }
  };

  const handleSearch = (v) => {
    setLocalSearch(v);
    setLocalPage(1);
    onSearch?.(v);
  };

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={13} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-blue-500" />
      : <ChevronDown size={13} className="text-blue-500" />;
  };

  return (
    <div className={clsx('bg-white rounded-2xl border border-slate-100 overflow-hidden', className)}>
      {/* Toolbar */}
      {(searchable || actions.length > 0) && (
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl
                           text-sm focus:outline-none focus:border-blue-300 transition-all"
              />
              {localSearch && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            {actions.map((act) => (
              <button
                key={act.label}
                onClick={act.onClick}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                  act.variant === 'danger'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : act.variant === 'outline'
                    ? 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                )}
              >
                {act.icon} {act.label}
              </button>
            ))}
          </div>
          {meta && (
            <p className="text-xs text-slate-400">{meta.total} records</p>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left font-semibold select-none',
                    col.sortable && 'cursor-pointer hover:text-slate-700',
                    col.width && `w-${col.width}`
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          <div className="skeleton h-4 rounded-full w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                : pagedData.length === 0
                ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-16 text-slate-400">
                        <span className="text-3xl block mb-2">🔍</span>
                        {emptyText}
                      </td>
                    </tr>
                  )
                : pagedData.map((row, idx) => (
                    <motion.tr
                      key={row[rowKey] ?? idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onRowClick?.(row)}
                      className={clsx(
                        'group hover:bg-blue-50/40 transition-colors',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-slate-700 align-middle">
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                    </motion.tr>
                  ))
              }
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
            {meta && ` · ${meta.total} total`}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => meta ? onPage?.(currentPage - 1) : setLocalPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => meta ? onPage?.(page) : setLocalPage(page)}
                  className={clsx(
                    'w-7 h-7 rounded-lg text-xs font-medium transition-all',
                    page === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => meta ? onPage?.(currentPage + 1) : setLocalPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
