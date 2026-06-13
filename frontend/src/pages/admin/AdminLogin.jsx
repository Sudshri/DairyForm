import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import logo from '@/assets/logo.png';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLogin() {
  const navigate    = useNavigate();
  const loginStore  = useAuthStore((s) => s.login);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (d) => authApi.login(d).then((r) => r.data),
    onSuccess: ({ user, token }) => {
      if (user?.role !== 'admin') {
        setError('email', { message: 'Access denied. Admin account required.' });
        return;
      }
      loginStore(user, token);
      navigate('/admin', { replace: true });
    },
    onError: (e) => {
      setError('email', { message: e.response?.data?.message ?? 'Invalid credentials' });
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#0F172A' }}>

      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#0F2744,#0D1B2E)' }}>

        {/* Decorative rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ border: '1px solid #17C0F2' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ border: '1px solid #8BC63E' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ border: '1px solid #17C0F2' }} />
        </div>

        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={logo} alt="EverFresh" className="h-24 w-auto object-contain mx-auto mb-8"
            style={{ filter: 'drop-shadow(0 0 24px rgba(23,192,242,0.4))' }} />

          <h1 className="font-display text-3xl font-bold mb-3" style={{ color: '#F1F5F9' }}>
            EverFresh Admin
          </h1>
          <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: '#64748B' }}>
            Secure administration portal for managing products, orders, and dairy operations.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[
              { label: 'Products', value: '15+' },
              { label: 'Categories', value: '7' },
              { label: 'Active', value: '100%' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(23,192,242,0.07)', border: '1px solid rgba(23,192,242,0.15)' }}>
                <p className="font-bold text-lg" style={{ color: '#17C0F2' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom compliance */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 text-xs"
          style={{ color: '#334155' }}>
          <span>FSSAI: 12225039000413</span>
          <span>GST: 08AIYPH7023E1Z2</span>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="EverFresh" className="h-14 w-auto object-contain mx-auto mb-3" />
            <p className="text-sm" style={{ color: '#64748B' }}>Admin Portal</p>
          </div>

          <div className="rounded-2xl p-8"
            style={{ background: '#1E293B', border: '1px solid #334155' }}>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(23,192,242,0.12)', border: '1px solid rgba(23,192,242,0.25)' }}>
                <ShieldCheck size={20} style={{ color: '#17C0F2' }} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold" style={{ color: '#F1F5F9' }}>Admin Sign In</h2>
                <p className="text-xs" style={{ color: '#475569' }}>Restricted access</p>
              </div>
            </div>

            <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: '#64748B' }}>Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#475569' }} />
                  <input
                    type="email"
                    autoComplete="username"
                    placeholder="admin@everfresh.org.in"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#0F172A',
                      border: `1px solid ${errors.email ? '#EF4444' : '#334155'}`,
                      color: '#F1F5F9',
                    }}
                    onFocus={e => e.target.style.borderColor = '#17C0F2'}
                    onBlur={e => e.target.style.borderColor = errors.email ? '#EF4444' : '#334155'}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: '#64748B' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#475569' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#0F172A',
                      border: `1px solid ${errors.password ? '#EF4444' : '#334155'}`,
                      color: '#F1F5F9',
                    }}
                    onFocus={e => e.target.style.borderColor = '#17C0F2'}
                    onBlur={e => e.target.style.borderColor = errors.password ? '#EF4444' : '#334155'}
                    {...register('password')}
                  />
                  <button type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    <AlertCircle size={12} /> {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-60"
                style={{
                  background: isPending ? '#0e8cb0' : 'linear-gradient(135deg,#17C0F2,#168AC7)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(23,192,242,0.3)',
                }}
              >
                {isPending ? 'Signing in…' : 'Sign In to Admin'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-xs" style={{ color: '#334155' }}>
            SHYAM DAIRY UDYOG &bull; EverFresh Admin Panel &bull; Authorised access only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
