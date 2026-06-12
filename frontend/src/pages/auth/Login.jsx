import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authApi.login(data).then((r) => r.data),
    onSuccess: ({ user, token }) => {
      loginStore(user, token);
      navigate('/dashboard');
    },
    onError: (err) => {
      const msg = err.response?.data?.message ?? 'Login failed';
      setError('email', { message: msg });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
      <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">🐄 DairyForm</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to manage your farm</p>
        </div>

        <form onSubmit={handleSubmit(mutate)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={isPending} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
