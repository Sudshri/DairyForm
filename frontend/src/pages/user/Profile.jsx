import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Plus, Trash2, MapPin, Star, Edit2, Check,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import Breadcrumb from '@/components/common/Breadcrumb';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useProfile, useUpdateProfile, useChangePassword, useAddresses } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { clsx } from 'clsx';

const TABS = [
  { id:'profile',   label:'Profile',   icon:<User size={15} /> },
  { id:'security',  label:'Security',  icon:<Lock size={15} /> },
  { id:'addresses', label:'Addresses', icon:<MapPin size={15} /> },
];

const profileSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password:      z.string().min(8),
  password:              z.string().min(8),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match", path: ['password_confirmation'],
});

// ── Profile tab ──────────────────────────────────────────────────
function ProfileTab() {
  const user                         = useAuthStore((s) => s.user);
  const { mutate: update, isPending } = useUpdateProfile();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' },
  });

  return (
    <GlassCard variant="white" className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200
                          flex items-center justify-center text-3xl font-bold text-blue-600">
            {user?.name?.[0] ?? 'U'}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 text-white
                             flex items-center justify-center shadow-soft-md">
            <Edit2 size={12} />
          </button>
        </div>
        <div>
          <h2 className="font-display text-xl text-slate-800">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex gap-2 mt-1.5">
            <Badge variant="sky">Member</Badge>
            <Badge variant="cream">3 Orders</Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(update)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            icon={<User size={15} />}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <Input
          label="Phone Number"
          icon={<Phone size={15} />}
          placeholder="+91 98765 43210"
          {...register('phone')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending} icon={<Check size={15} />}>
            Save Changes
          </Button>
          <Button variant="outline" type="button">Cancel</Button>
        </div>
      </form>
    </GlassCard>
  );
}

// ── Security tab ─────────────────────────────────────────────────
function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const { mutate: change, isPending } = useChangePassword();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data) => {
    change(data, { onSuccess: () => reset() });
  };

  return (
    <GlassCard variant="white" className="p-6">
      <h2 className="font-display text-xl text-slate-800 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <Input
          label="Current Password"
          type={showCurrent ? 'text' : 'password'}
          icon={<Lock size={15} />}
          iconRight={
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.current_password?.message}
          {...register('current_password')}
        />
        <Input
          label="New Password"
          type={showNew ? 'text' : 'password'}
          icon={<Lock size={15} />}
          iconRight={
            <button type="button" onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          hint="Minimum 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm New Password"
          type="password"
          icon={<Lock size={15} />}
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" loading={isPending} icon={<Check size={15} />}>
          Update Password
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-blue-50">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm">Active Sessions</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
          <div>
            <p className="text-sm font-medium text-slate-700">Current device</p>
            <p className="text-xs text-slate-400">Windows · Chrome · Pune, India</p>
          </div>
          <Badge variant="green">Active now</Badge>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Addresses tab ────────────────────────────────────────────────
function AddressesTab() {
  const { data: addresses = [], isLoading } = useAddresses();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {isLoading
        ? <div className="skeleton h-24 rounded-3xl" />
        : addresses.map((addr) => (
            <GlassCard key={addr.id} variant="white" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-slate-800 text-sm">{addr.label}</p>
                      {addr.isDefault && <Badge variant="sky">Default</Badge>}
                    </div>
                    <p className="text-sm text-slate-500">{addr.name} · {addr.phone}</p>
                    <p className="text-sm text-slate-500">{addr.line1}, {addr.city} – {addr.pincode}</p>
                    <p className="text-xs text-slate-400">{addr.state}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" icon={<Edit2 size={13} />}>Edit</Button>
                {!addr.isDefault && (
                  <Button variant="ghost" size="sm" icon={<Star size={13} />}>Set Default</Button>
                )}
                {!addr.isDefault && (
                  <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-50">
                    <Trash2 size={13} />
                  </Button>
                )}
              </div>
            </GlassCard>
          ))
      }

      <Button variant="outline" className="w-full justify-center" icon={<Plus size={15} />}
        onClick={() => setAdding(true)}>
        Add New Address
      </Button>

      {/* Add address form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            className="overflow-hidden"
          >
            <GlassCard variant="white" className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Label (e.g. Home)"  placeholder="Home" />
                <Input label="Full Name"           placeholder="Ramesh Kumar" />
                <Input label="Phone"               placeholder="+91 98765 43210" />
                <Input label="Address Line"        placeholder="123 Farm Road" />
                <Input label="City"                placeholder="Pune" />
                <Input label="Pincode"             placeholder="411001" />
                <Input label="State"               placeholder="Maharashtra" wrapperClassName="sm:col-span-2" />
              </div>
              <div className="flex gap-3 mt-4">
                <Button icon={<Check size={14} />}>Save Address</Button>
                <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function Profile() {
  const [tab, setTab] = useState('profile');

  return (
    <>
      <SEOHead title="My Profile" />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
        <FloatingBlob color="#BAE6FD" size={400} opacity={0.18} className="top-10 -right-32" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Breadcrumb items={[{ label: 'Profile', to: '/profile' }]} className="mb-6" />
          <h1 className="font-display text-3xl text-slate-900 mb-8">My Account</h1>

          <div className="grid sm:grid-cols-4 gap-8">
            {/* Nav */}
            <nav className="sm:col-span-1">
              <div className="flex sm:flex-col gap-1.5">
                {TABS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={clsx(
                      'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-left transition-all',
                      tab === id ? 'bg-blue-500 text-white shadow-soft-md' : 'text-slate-600 hover:bg-blue-50'
                    )}
                  >
                    {icon} <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="sm:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {tab === 'profile'   && <ProfileTab />}
                  {tab === 'security'  && <SecurityTab />}
                  {tab === 'addresses' && <AddressesTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
