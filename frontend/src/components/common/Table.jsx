export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-surface-secondary text-left">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-surface-border">{children}</tbody>;
}

export function Tr({ children, onClick, className }) {
  return (
    <tr
      onClick={onClick}
      className={`bg-white hover:bg-surface-secondary transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }) {
  return <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>;
}
