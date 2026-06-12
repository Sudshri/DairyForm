import { format, formatDistanceToNow } from 'date-fns';

export const formatDate    = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—';
export const formatDateTime = (d) => d ? format(new Date(d), 'dd MMM yyyy, HH:mm') : '—';
export const timeAgo       = (d) => d ? formatDistanceToNow(new Date(d), { addSuffix: true }) : '—';

export const formatCurrency = (n, currency = '₹') =>
  n != null ? `${currency}${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';

export const formatLiters = (n) => n != null ? `${Number(n).toFixed(2)} L` : '—';
