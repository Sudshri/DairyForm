import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, MapPin, Settings, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';

const TABS = [
  { id:'orders',   label:'My Orders',   icon:<Package size={16} /> },
  { id:'wishlist', label:'Wishlist',     icon:<Heart size={16} /> },
  { id:'address',  label:'Addresses',   icon:<MapPin size={16} /> },
  { id:'settings', label:'Settings',    icon:<Settings size={16} /> },
];

const MOCK_ORDERS = [
  { id:'DF1001', date:'2026-06-01', status:'delivered', total:245, items:[{name:'Full Cream Milk×2'},{name:'Ghee×1'}] },
  { id:'DF1002', date:'2026-06-03', status:'dispatched', total:65, items:[{name:'Farm Fresh Milk×1'}] },
  { id:'DF1003', date:'2026-06-04', status:'pending',   total:180, items:[{name:'Fresh Paneer×1'},{name:'Butter×1'}] },
];

const STATUS_BADGE = {
  pending:    { variant:'cream',  label:'Pending',    icon:<Clock size={12} /> },
  confirmed:  { variant:'sky',    label:'Confirmed',  icon:<CheckCircle size={12} /> },
  dispatched: { variant:'sky',    label:'Dispatched', icon:<ShoppingBag size={12} /> },
  delivered:  { variant:'green',  label:'Delivered',  icon:<CheckCircle size={12} /> },
  cancelled:  { variant:'red',    label:'Cancelled',  icon:<XCircle size={12} /> },
};

export default function UserDashboard() {
  const [tab, setTab] = useState('orders');
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Profile header */}
        <GlassCard variant="white" className="p-6 mb-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200
                          flex items-center justify-center text-3xl font-bold text-blue-600 shrink-0">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-2xl text-slate-800">{user?.name ?? 'Welcome!'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="sky">Active Member</Badge>
              <Badge variant="cream">3 Orders</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="sm:ml-auto">Edit Profile</Button>
        </GlassCard>

        <div className="grid sm:grid-cols-4 gap-8">
          {/* Sidebar tabs */}
          <nav className="sm:col-span-1">
            <div className="flex sm:flex-col gap-1">
              {TABS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium
                    transition-all text-left
                    ${tab === id ? 'bg-blue-500 text-white shadow-soft-md' : 'text-slate-600 hover:bg-blue-50'}`}
                >
                  {icon} <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="sm:col-span-3">
            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-slate-800">Order History</h2>
                {MOCK_ORDERS.map((order, i) => {
                  const status = STATUS_BADGE[order.status];
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay: i*0.08 }}
                    >
                      <GlassCard variant="white" className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-semibold text-slate-800">Order #{order.id}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.date)}</p>
                          </div>
                          <Badge variant={status.variant}>
                            <span className="flex items-center gap-1">{status.icon} {status.label}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">
                          {order.items.map((i) => i.name).join(' · ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800">{formatCurrency(order.total)}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reorder</Button>
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <Button variant="ghost" size="sm">Track</Button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {tab === 'wishlist' && (
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">💛</span>
                <p className="font-display text-xl text-slate-700">Your wishlist is empty</p>
                <p className="text-sm text-slate-400 mt-1">Save products you love for later</p>
              </div>
            )}

            {tab === 'address' && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-slate-800">Saved Addresses</h2>
                <GlassCard variant="white" className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Home</p>
                      <p className="text-sm text-slate-500 mt-1">123 Farm Road, Hadapsar, Pune – 411013</p>
                      <p className="text-xs text-slate-400 mt-0.5">+91 98765 43210</p>
                    </div>
                    <Badge variant="sky">Default</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </GlassCard>
                <Button variant="outline" className="w-full justify-center">+ Add New Address</Button>
              </div>
            )}

            {tab === 'settings' && (
              <GlassCard variant="white" className="p-6 space-y-5">
                <h2 className="font-display text-xl text-slate-800">Account Settings</h2>
                <div className="grid gap-4">
                  <div><label className="input-label">Full Name</label><input className="input-field" defaultValue={user?.name} /></div>
                  <div><label className="input-label">Email</label><input className="input-field" defaultValue={user?.email} type="email" /></div>
                  <div><label className="input-label">Phone</label><input className="input-field" placeholder="+91 98765 43210" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
