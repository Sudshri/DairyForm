import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, ShoppingCart, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import logo from '@/assets/logo.png';
import BulkOrderModal from '@/components/modals/BulkOrderModal';
import PartnerModal   from '@/components/modals/PartnerModal';

const NAV_LINKS = [
  { to: '/',        label: 'Home',       end: true },
  { to: '/about',   label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [bulkOpen,    setBulkOpen]    = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [query,       setQuery]       = useState('');
  const navigate    = useNavigate();
  const wrapperRef  = useRef(null);
  const prevScrollY = useRef(0);

  /* scroll: shadow + auto-hide */
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > prevScrollY.current && y > 80);
      prevScrollY.current = y;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* measure total header height → --navbar-h for PublicLayout offset */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--navbar-h', `${entry.contentRect.height}px`);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <>
      {/* ── Announcement bar + header slide as one unit ───────────── */}
      <div
        ref={wrapperRef}
        className={clsx(
          'fixed top-0 inset-x-0 z-30 transition-transform duration-300',
          hidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        {/* ── Announcement Bar ──────────────────────────────────────── */}
        <div
          className="h-10 flex items-center justify-center"
          style={{ background: '#8BC63E' }}
        >
          <p className="text-white text-sm font-semibold tracking-wide select-none">
            🌿 Purity is Priority 🌿
          </p>
        </div>

        {/* ── Main Header ───────────────────────────────────────────── */}
        <div className={clsx(
          'bg-white/95 backdrop-blur-md transition-shadow duration-300',
          scrolled ? 'shadow-md' : ''
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* Row 1: Logo | Search | Buttons ──────────────────────── */}
            <div className="flex items-center justify-between gap-4 py-3">

              {/* Left — Logo */}
              <NavLink to="/" className="shrink-0">
                <img
                  src={logo}
                  alt="EverFresh"
                  className="h-12 sm:h-[72px] w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))' }}
                />
              </NavLink>

              {/* Center — Search (tablet+) */}
              <div className="hidden sm:flex flex-1 justify-center px-2">
                <div className="relative w-full max-w-[520px]">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#17C0F2' }}
                  />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search for milk, ghee, paneer…"
                    className="w-full pl-11 pr-5 py-2.5 rounded-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all"
                    style={{ background:'#F5FAFF', border:'1.5px solid #DDEAF5', boxShadow:'0 1px 4px rgba(23,192,242,0.06)' }}
                    onFocus={e => { e.target.style.borderColor='#17C0F2'; e.target.style.boxShadow='0 0 0 3px rgba(23,192,242,0.12)'; e.target.style.background='#FFFFFF'; }}
                    onBlur={e => { e.target.style.borderColor='#DDEAF5'; e.target.style.boxShadow='0 1px 4px rgba(23,192,242,0.06)'; e.target.style.background='#F5FAFF'; }}
                  />
                </div>
              </div>

              {/* Right — CTA buttons (desktop) + mobile compact buttons + Hamburger */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-2.5">
                  <button
                    onClick={() => setBulkOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    style={{ background: '#17C0F2' }}
                  >
                    <ShoppingCart size={15} />
                    Bulk Order
                  </button>
                  <button
                    onClick={() => setPartnerOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    style={{ background: '#8BC63E' }}
                  >
                    <UserPlus size={15} />
                    Become A Partner
                  </button>
                </div>

                {/* Mobile compact icon buttons — always visible */}
                <div className="flex md:hidden items-center gap-1.5">
                  <button
                    onClick={() => setBulkOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-2xs font-semibold"
                    style={{ background: '#17C0F2' }}
                  >
                    <ShoppingCart size={12} />
                    Bulk
                  </button>
                  <button
                    onClick={() => setPartnerOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-2xs font-semibold"
                    style={{ background: '#8BC63E' }}
                  >
                    <UserPlus size={12} />
                    Partner
                  </button>
                </div>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-800 shrink-0"
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </div>

            {/* Mobile search row */}
            <div className="sm:hidden pb-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#17C0F2' }}
                />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search for milk, ghee, paneer…"
                  className="w-full pl-10 pr-4 py-2 rounded-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all"
                  style={{ background:'#F5FAFF', border:'1.5px solid #DDEAF5' }}
                  onFocus={e => { e.target.style.borderColor='#17C0F2'; e.target.style.boxShadow='0 0 0 3px rgba(23,192,242,0.12)'; e.target.style.background='#FFFFFF'; }}
                  onBlur={e => { e.target.style.borderColor='#DDEAF5'; e.target.style.boxShadow='none'; e.target.style.background='#F5FAFF'; }}
                />
              </div>
            </div>

            {/* Row 2 — Navigation (desktop, centered) */}
            <div className="hidden md:block border-t border-slate-200">
              <nav className="flex items-center justify-center gap-0.5 py-2">
                {NAV_LINKS.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) => clsx(
                      'px-4 py-1.5 text-sm font-medium transition-all duration-200 border-b-2',
                      isActive
                        ? 'border-[#17C0F2] text-[#17C0F2]'
                        : 'border-transparent text-slate-700 hover:text-[#17C0F2] hover:border-[#17C0F2]/60'
                    )}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 z-50 md:hidden flex flex-col shadow-2xl bg-white border-l border-slate-200"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <img src={logo} alt="EverFresh" className="h-10 w-auto object-contain" />
                <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => clsx(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sky-50 text-[#17C0F2]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#17C0F2]'
                    )}
                  >
                    {label}
                    <ChevronRight size={14} className="text-slate-300" />
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 space-y-3 border-t border-slate-200">
                <button
                  onClick={() => { setBulkOpen(true); setMobileOpen(false); }}
                  className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-md transition-opacity hover:opacity-90"
                  style={{ background: '#17C0F2' }}
                >
                  Bulk Order
                </button>
                <button
                  onClick={() => { setPartnerOpen(true); setMobileOpen(false); }}
                  className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-md transition-opacity hover:opacity-90"
                  style={{ background: '#8BC63E' }}
                >
                  Become A Partner
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BulkOrderModal open={bulkOpen}    onClose={() => setBulkOpen(false)} />
      <PartnerModal   open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </>
  );
}
