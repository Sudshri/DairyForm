import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-slate-200">404</p>
        <h2 className="text-xl font-semibold text-slate-700">Page not found</h2>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
}
