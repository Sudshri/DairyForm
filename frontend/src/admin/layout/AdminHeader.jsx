import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const PAGE_TITLES = {
  '/admin':            { title: 'Dashboard',      sub: 'Welcome back, Admin' },
  '/admin/products':   { title: 'Products',        sub: 'Manage your dairy catalogue' },
  '/admin/categories': { title: 'Categories',      sub: 'Organise product structure' },
  '/admin/inventory':  { title: 'Inventory',       sub: 'Track stock levels' },
  '/admin/banners':    { title: 'Banners',          sub: 'Manage homepage banners' },
  '/admin/coupons':    { title: 'Coupons & Offers', sub: 'Promotions and discounts' },
  '/admin/orders':     { title: 'Orders',           sub: 'Order management' },
  '/admin/users':      { title: 'Users',            sub: 'Customer management' },
  '/admin/reviews':    { title: 'Reviews',          sub: 'Moderate customer reviews' },
  '/admin/pincodes':   { title: 'Delivery Areas',   sub: 'Serviceable pincodes' },
  '/admin/analytics':  { title: 'Analytics',        sub: 'Revenue & sales insights' },
};

export default function AdminHeader({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const user         = useAuthStore((s) => s.user);
  const logout       = useAuthStore((s) => s.logout);
  const [dropOpen, setDropOpen] = useState(false);
  const [searchVal, setSearch]  = useState('');

  const key   = Object.keys(PAGE_TITLES).find((k) => pathname === k || pathname.startsWith(k + '/')) ?? '/admin';
  const page  = PAGE_TITLES[key];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-slate-800 font-display">{page?.title}</h1>
          <p className="text-xs text-slate-400">{page?.sub}</p>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-sm ml-2 hidden md:block">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchVal}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick search…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2
                         text-sm text-slate-700 placeholder:text-slate-400
                         focus:outline-none focus:border-blue-300 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* View storefront */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200
                       text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            <ExternalLink size={12} /> Storefront
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{   opacity: 0, scale: 0.95,  y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100
                             rounded-2xl shadow-lg overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/admin"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <button
                      onClick={() => { setDropOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
