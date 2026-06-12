import AppRoutes from '@/routes';
import CartDrawer from '@/components/common/CartDrawer';
import Notification from '@/components/common/Notification';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      {/* Global UI overlays */}
      <CartDrawer />
      <Notification />
    </ErrorBoundary>
  );
}
