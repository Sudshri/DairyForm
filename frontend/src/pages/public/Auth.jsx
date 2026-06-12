import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Name too short'),
  email:    z.string().email('Enter a valid email'),
  phone:    z.string().optional(),
  password: z.string().min(8, 'Minimum 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

export default function Auth() {
  const [tab,       setTab]     = useState('login');
  const [showPass,  setShowPass] = useState(false);
  const navigate                = useNavigate();
  const loginStore              = useAuthStore((s) => s.login);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const regForm   = useForm({ resolver: zodResolver(registerSchema) });

  const loginMut = useMutation({
    mutationFn: (d) => authApi.login(d).then((r) => r.data),
    onSuccess: ({ user, token }) => { loginStore(user, token); navigate('/dashboard'); },
    onError: (e) => loginForm.setError('email', { message: e.response?.data?.message ?? 'Invalid credentials' }),
  });

  const regMut = useMutation({
    mutationFn: (d) => authApi.register(d).then((r) => r.data),
    onSuccess: ({ user, token }) => { loginStore(user, token); navigate('/dashboard'); },
    onError: (e) => regForm.setError('email', { message: e.response?.data?.errors?.email?.[0] ?? 'Registration failed' }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-dairy-hero px-4 py-20 relative overflow-hidden">
      <FloatingBlob color="#BAE6FD" size={500} opacity={0.3} className="top-0 -right-32" />
      <FloatingBlob color="#FDE8C8" size={350} opacity={0.25} className="-bottom-20 -left-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-3xl bg-blue-500 text-white text-2xl flex items-center justify-center shadow-soft-md">🥛</div>
            <span className="font-display text-2xl text-slate-800">Dairy<span className="text-blue-500">Form</span></span>
          </Link>
        </div>

        <GlassCard variant="heavy" className="p-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 glass rounded-2xl mb-8">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-250
                  ${tab === t ? 'bg-blue-500 text-white shadow-soft-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Login form */}
            {tab === 'login' && (
              <motion.form
                key="login"
                onSubmit={loginForm.handleSubmit((d) => loginMut.mutate(d))}
                className="space-y-4"
                initial={{ opacity:0, y:12 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-12 }}
                transition={{ duration: 0.25 }}
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={15} />}
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                  iconRight={
                    <button type="button" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />
                <div className="text-right">
                  <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" loading={loginMut.isPending}
                  className="w-full justify-center" size="lg"
                  iconRight={<ArrowRight size={16} />}>
                  Sign In
                </Button>

                {/* OAuth */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-blue-100" />
                  <span className="text-xs text-slate-400">or continue with</span>
                  <div className="flex-1 h-px bg-blue-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Google', 'Facebook'].map((provider) => (
                    <button key={provider}
                      className="btn-glass btn-sm justify-center text-slate-600">
                      {provider === 'Google' ? '🇬' : '📘'} {provider}
                    </button>
                  ))}
                </div>
              </motion.form>
            )}

            {/* Register form */}
            {tab === 'register' && (
              <motion.form
                key="register"
                onSubmit={regForm.handleSubmit((d) => regMut.mutate(d))}
                className="space-y-4"
                initial={{ opacity:0, y:12 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-12 }}
                transition={{ duration: 0.25 }}
              >
                <Input label="Full Name"  placeholder="Ramesh Kumar" icon={<User size={15} />}
                  error={regForm.formState.errors.name?.message}  {...regForm.register('name')} />
                <Input label="Email"      placeholder="you@example.com" icon={<Mail size={15} />}
                  error={regForm.formState.errors.email?.message} {...regForm.register('email')} />
                <Input label="Phone (optional)" placeholder="98765 43210" icon={<Phone size={15} />}
                  {...regForm.register('phone')} />
                <Input label="Password"   type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
                  icon={<Lock size={15} />}
                  iconRight={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
                  error={regForm.formState.errors.password?.message} {...regForm.register('password')} />
                <Input label="Confirm Password" type="password" placeholder="Repeat password"
                  icon={<Lock size={15} />}
                  error={regForm.formState.errors.password_confirmation?.message}
                  {...regForm.register('password_confirmation')} />
                <Button type="submit" loading={regMut.isPending}
                  className="w-full justify-center" size="lg"
                  iconRight={<ArrowRight size={16} />}>
                  Create Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>

        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing you agree to our <Link to="/terms" className="text-blue-500 hover:underline">Terms</Link> &
          <Link to="/privacy" className="text-blue-500 hover:underline"> Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
