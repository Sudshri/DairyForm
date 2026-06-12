import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Cow, Droplets, Heart, Wheat,
  Users, ShoppingCart, DollarSign, BarChart2,
  Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { clsx } from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/animals',   label: 'Animals',     icon: Cow },
  { to: '/milk',      label: 'Milk Records',icon: Droplets },
  { to: '/health',    label: 'Health',      icon: Heart },
  { to: '/feed',      label: 'Feed',        icon: Wheat },
  { to: '/customers', label: 'Customers',   icon: Users },
  { to: '/orders',    label: 'Orders',      icon: ShoppingCart },
  { to: '/expenses',  label: 'Expenses',    icon: DollarSign },
  { to: '/reports',   label: 'Reports',     icon: BarChart2 },
  { to: '/settings',  label: 'Settings',    icon: Settings },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-60 bg-white border-r border-surface-border flex flex-col">
      <div className="p-5 border-b border-surface-border">
        <h1 className="text-lg font-bold text-primary">🐄 DairyForm</h1>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm
                     font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
