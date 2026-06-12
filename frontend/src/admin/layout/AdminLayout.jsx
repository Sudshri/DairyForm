import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader  from './AdminHeader';

export default function AdminLayout() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <AdminSidebar
                collapsed={false}
                isMobile
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onToggleSidebar={() => {
            if (window.innerWidth >= 1024) {
              setCollapsed(!collapsed);
            } else {
              setMobileOpen(!mobileOpen);
            }
          }}
        />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          key={pathname}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
