import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  ShoppingCart, Package, Users, DollarSign,
  TrendingUp, Bell, Search, Menu, X,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatters';
import { clsx } from 'clsx';

const REVENUE_DATA = [
  { month:'Jan', revenue:42000, orders:68 },
  { month:'Feb', revenue:55000, orders:82 },
  { month:'Mar', revenue:48000, orders:71 },
  { month:'Apr', revenue:63000, orders:95 },
  { month:'May', revenue:71000, orders:108 },
  { month:'Jun', revenue:84000, orders:124 },
];

const PRODUCT_DATA = [
  { name:'Milk',   sales:62, color:'#0EA5E9' },
  { name:'Ghee',   sales:18, color:'#F59E0B' },
  { name:'Butter', sales:12, color:'#FDE8C8' },
  { name:'Others', sales:8,  color:'#BAE6FD' },
];

const RECENT_ORDERS = [
  { id:'DF1024', customer:'Priya Sharma', items:2, total:130, status:'delivered' },
  { id:'DF1023', customer:'Rahul Mehta',  items:1, total:850, status:'dispatched' },
  { id:'DF1022', customer:'Anita Desai',  items:3, total:255, status:'confirmed' },
  { id:'DF1021', customer:'Suresh Patel', items:2, total:145, status:'pending' },
];

const STATUS_V = { pending:'cream', confirmed:'sky', dispatched:'sky', delivered:'green', cancelled:'red' };

const NAV_ITEMS = ['Dashboard','Orders','Products','Customers','Reports','Settings'];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebar] = useState(false);
  const [activeNav,   setActiveNav] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-milk-soft flex">
      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-drawer lg:hidden"
               onClick={() => setSidebar(false)} />
        )}
        <aside className={clsx(
          'fixed top-0 left-0 h-full w-64 glass-heavy z-drawer flex flex-col',
          'transition-transform duration-350 ease-spring shadow-glass-xl',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-5 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center text-sm">🥛</div>
              <span className="font-display text-lg text-slate-800">DairyForm</span>
            </div>
            <button className="lg:hidden p-1.5 rounded-xl hover:bg-blue-50"
                    onClick={() => setSidebar(false)}><X size={16} /></button>
          </div>

          <div className="p-3 text-xs text-slate-400 uppercase tracking-wider mt-2 px-4">Admin Panel</div>

          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button key={item} onClick={() => setActiveNav(item)}
                className={clsx(
                  'w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors',
                  activeNav === item ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-blue-50'
                )}>
                {item}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-blue-100 text-sm text-slate-400 text-center">
            Admin v1.0
          </div>
        </aside>
      </>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="glass-heavy sticky top-0 z-sticky px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-blue-50" onClick={() => setSidebar(true)}>
            <Menu size={20} />
          </button>
          <h1 className="font-display text-xl text-slate-800 hidden sm:block">{activeNav}</h1>
          <div className="relative ml-auto w-56 hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input-field text-sm pl-9 py-2" placeholder="Search…" />
          </div>
          <button className="relative p-2 rounded-xl hover:bg-blue-50">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          </button>
          <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">A</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon="💰" label="Today's Revenue"  value="₹8,240"  trend={12}  color="sky"   index={0} />
            <StatCard icon="🛒" label="Total Orders"      value="124"     trend={8}   color="cream" index={1} />
            <StatCard icon="📦" label="Products"          value="38"      trend={2}   color="green" index={2} />
            <StatCard icon="👥" label="Customers"         value="2,148"   trend={-3}  color="sky"   index={3} />
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <GlassCard variant="white" className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Revenue Overview</h3>
                <span className="badge-sky">Last 6 Months</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                  <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Product mix donut */}
            <GlassCard variant="white" className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Sales Mix</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={PRODUCT_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                       dataKey="sales" paddingAngle={3}>
                    {PRODUCT_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {PRODUCT_DATA.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{d.sales}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Recent orders */}
          <GlassCard variant="white" className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-700">Recent Orders</h3>
              <button className="text-sm text-blue-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-blue-50">
                    {['Order ID','Customer','Items','Total','Status','Action'].map((h) => (
                      <th key={h} className="pb-3 pr-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {RECENT_ORDERS.map((o) => (
                    <tr key={o.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-slate-500">{o.id}</td>
                      <td className="py-3 pr-4 font-medium text-slate-800">{o.customer}</td>
                      <td className="py-3 pr-4 text-slate-500">{o.items} items</td>
                      <td className="py-3 pr-4 font-semibold">{formatCurrency(o.total)}</td>
                      <td className="py-3 pr-4"><Badge variant={STATUS_V[o.status]}>{o.status}</Badge></td>
                      <td className="py-3">
                        <button className="text-blue-500 text-xs hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </main>
      </div>
    </div>
  );
}
