import { Bell, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/animals':   'Animals',
  '/milk':      'Milk Records',
  '/health':    'Health Records',
  '/feed':      'Feed Records',
  '/customers': 'Customers',
  '/orders':    'Orders',
  '/expenses':  'Expenses',
  '/reports':   'Reports',
  '/settings':  'Settings',
};

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();

  const title = pageTitles[pathname] ?? 'DairyForm';

  return (
    <header className="bg-white border-b border-surface-border px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-surface-border">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
