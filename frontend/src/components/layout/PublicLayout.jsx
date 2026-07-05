import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col showcase-page" style={{ overflowX: 'hidden' }}>
      <Navbar />
      <main className="flex-1 w-full" style={{ paddingTop: 'var(--navbar-h, 0px)', overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
