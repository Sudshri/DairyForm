import { useQuery } from '@tanstack/react-query';
import { Cow, Droplets, DollarSign, ShoppingCart } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon: Icon, label, value, color = 'primary', sub }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    blue:    'bg-blue-50 text-blue-600',
    amber:   'bg-amber-50 text-amber-600',
    green:   'bg-green-50 text-green-600',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/dashboard/stats').then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Cow}          label="Total Animals"     value={stats?.total_animals}     color="primary" />
        <StatCard icon={Droplets}     label="Today's Milk (L)"  value={stats?.today_milk_liters}  color="blue"    />
        <StatCard icon={ShoppingCart} label="Pending Orders"    value={stats?.pending_orders}    color="amber"   />
        <StatCard icon={DollarSign}   label="Month Revenue"     value={`₹${stats?.month_revenue ?? 0}`} color="green" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-slate-700 mb-4">Milk Production – Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={stats?.milk_trend ?? []}>
            <defs>
              <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="liters" stroke="#16a34a" fill="url(#milkGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
