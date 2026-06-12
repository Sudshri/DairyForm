import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, Warehouse, Image,
  Ticket, ShoppingCart, Users, BarChart3,
  ChevronDown, ChevronRight, X, Store,
  Star, MapPin, TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

const NAV = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    to: '/admin',
    end: true,
  },
  {
    label: 'Catalogue',
    icon: <Store size={18} />,
    children: [
      { label: 'Products',   icon: <Package size={16} />,    to: '/admin/products' },
      { label: 'Categories', icon: <Tag size={16} />,        to: '/admin/categories' },
      { label: 'Inventory',  icon: <Warehouse size={16} />,  to: '/admin/inventory' },
    ],
  },
  {
    label: 'Marketing',
    icon: <TrendingUp size={18} />,
    children: [
      { label: 'Banners',  icon: <Image size={16} />,  to: '/admin/banners' },
      { label: 'Coupons',  icon: <Ticket size={16} />, to: '/admin/coupons' },
    ],
  },
  {
    label: 'Orders',
    icon: <ShoppingCart size={18} />,
    to: '/admin/orders',
  },
  {
    label: 'Users',
    icon: <Users size={18} />,
    to: '/admin/users',
  },
  {
    label: 'Reviews',
    icon: <Star size={18} />,
    to: '/admin/reviews',
  },
  {
    label: 'Delivery Areas',
    icon: <MapPin size={18} />,
    to: '/admin/pincodes',
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={18} />,
    to: '/admin/analytics',
  },
];

function NavItem({ item, collapsed }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() =>
    item.children?.some((c) => pathname.startsWith(c.to)) ?? false
  );

  if (item.children) {
    const isGroupActive = item.children.some((c) => pathname.startsWith(c.to));

    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all',
            isGroupActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          )}
        >
          <span className="shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <span className="shrink-0 text-slate-400">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            </>
          )}
        </button>

        <AnimatePresence>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 mt-0.5 pl-3 border-l-2 border-blue-100"
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors my-0.5',
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    )
                  }
                >
                  {child.icon}
                  {child.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all',
          isActive
            ? 'bg-blue-500 text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
        )
      }
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export default function AdminSidebar({ collapsed, onClose, isMobile }) {
  return (
    <aside
      className={clsx(
        'flex flex-col bg-white border-r border-slate-100 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        isMobile && 'fixed top-0 left-0 h-full z-40 shadow-xl'
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center gap-3 p-4 border-b border-slate-100',
          collapsed && 'justify-center'
        )}
      >
        <div className="w-9 h-9 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shrink-0">
          🥛
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-base text-slate-800 leading-tight">DairyForm</p>
            <p className="text-2xs text-blue-500 font-medium">Admin Panel</p>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-hide">
        {NAV.map((item) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100">
          <p className="text-2xs text-slate-400 text-center">DairyForm Admin v1.0</p>
        </div>
      )}
    </aside>
  );
}
