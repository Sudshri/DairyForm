import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F97316'];

// ── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {prefix}{Number(entry.value).toLocaleString('en-IN')}{suffix}
        </p>
      ))}
    </div>
  );
};

// ── Revenue Area Chart ───────────────────────────────────────────────────────
export function RevenueChart({ data = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
        <Tooltip content={<CustomTooltip prefix="₹" />} />
        <Legend iconType="circle" iconSize={8} />
        <Area type="monotone" dataKey="revenue" name="Revenue"
              stroke="#0EA5E9" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
        <Area type="monotone" dataKey="orders" name="Orders"
              stroke="#10B981" fill="url(#ordGrad)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Orders by Status Pie Chart ───────────────────────────────────────────────
export function OrderStatusChart({ data = [], height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={55} outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [v, 'Orders']} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Top Products Bar Chart ───────────────────────────────────────────────────
export function TopProductsChart({ data = [], height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90}
               axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [v, 'Units Sold']} />
        <Bar dataKey="sales" name="Units Sold" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Daily Milk Production Line Chart ────────────────────────────────────────
export function MilkTrendChart({ data = [], height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={(v) => `${v}L`} />
        <Tooltip formatter={(v) => [`${v} Litres`, 'Milk']} />
        <Line type="monotone" dataKey="liters" name="Milk (L)"
              stroke="#0EA5E9" strokeWidth={2.5}
              dot={{ fill: '#0EA5E9', r: 3 }}
              activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Category Revenue Donut ───────────────────────────────────────────────────
export function CategoryRevenueChart({ data = [], height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%"
             innerRadius={50} outerRadius={78}
             paddingAngle={4} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
