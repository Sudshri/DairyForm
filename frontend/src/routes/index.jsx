import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PublicLayout from '@/components/layout/PublicLayout';
import { PageLoader } from '@/components/ui/Loader';
import AdminRoutes from './adminRoutes';

// ── New pages ─────────────────────────────────────────────────────
const Categories     = lazy(() => import('@/pages/public/Categories'));
const Profile        = lazy(() => import('@/pages/user/Profile'));
const Orders         = lazy(() => import('@/pages/user/Orders'));
const Wishlist       = lazy(() => import('@/pages/user/Wishlist'));

// Public pages
const Home           = lazy(() => import('@/pages/public/Home'));
const ProductListing = lazy(() => import('@/pages/public/ProductListing'));
const ProductDetail  = lazy(() => import('@/pages/public/ProductDetail'));
const Cart           = lazy(() => import('@/pages/public/Cart'));
const Checkout       = lazy(() => import('@/pages/public/Checkout'));
const Auth           = lazy(() => import('@/pages/public/Auth'));
const Testimonials   = lazy(() => import('@/pages/public/Testimonials'));
const Contact        = lazy(() => import('@/pages/public/Contact'));

// User pages (requires auth)
const UserDashboard  = lazy(() => import('@/pages/user/UserDashboard'));

// Misc
const NotFound       = lazy(() => import('@/pages/NotFound'));

function PrivateRoute({ children, role }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role === 'admin' && !user?.roles?.includes('admin')) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function AppInitializer({ children }) {
  const { initialize, isInitialized } = useAuthStore();
  useEffect(() => { initialize(); }, [initialize]);
  if (!isInitialized) return <PageLoader />;
  return children;
}

export default function AppRoutes() {
  return (
    <AppInitializer>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Public routes (with Navbar + Footer) ─────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"                  element={<Home />} />
            <Route path="/categories"        element={<Categories />} />
            <Route path="/categories/:slug"  element={<Categories />} />
            <Route path="/products"          element={<ProductListing />} />
            <Route path="/products/:id"      element={<ProductDetail />} />
            <Route path="/cart"              element={<Cart />} />
            <Route path="/testimonials"      element={<Testimonials />} />
            <Route path="/contact"           element={<Contact />} />
            {/* Protected – inside public layout (Navbar+Footer) */}
            <Route path="/dashboard"  element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/orders"     element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/wishlist"   element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          </Route>

          {/* ── Auth (full screen, no navbar) ─────────────────────────── */}
          <Route path="/login"    element={<GuestRoute><Auth /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Auth /></GuestRoute>} />
          <Route path="/checkout" element={<Checkout />} />

          {/* ── Admin (full screen with own sidebar + role guard) ─────── */}
          {AdminRoutes()}

          {/* ── Fallback ──────────────────────────────────────────────── */}
          <Route path="*"         element={<NotFound />} />

        </Routes>
      </Suspense>
    </AppInitializer>
  );
}
