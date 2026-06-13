import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/ui/Loader';

export default function AdminGuard({ children }) {
  const { token, user, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return <PageLoader />;

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
