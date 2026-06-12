import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import AdminStatCard from '@/admin/components/AdminStatCard';
import { RevenueChart, OrderStatusChart, TopProductsChart } from '@/admin/components/Charts';
import { dashboardService, inventoryService, orderService } from '@/services/adminService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, orders: 68 },
  { month: 'Feb', revenue: 55000, orders: 82 },
  { month: 'Mar', revenue: 48000, orders: 71 },
  { month: 'Apr', revenue: 63000, orders: 95 },
  { month: 'May', revenue: 71000, orders: 108 },
  { month: 'Jun', revenue: 84000, orders: 124 },
];

const ORDER_STATUS_DATA = [
  { name: 'Delivered',  value: 148 },
  { name: 'Dispatched', value: 32 },
  { name: 'Processing', value: 18 },
  { name: 'Pending',    value: 12 },
  { name: 'Cancelled',  value: 7 },
];

const TOP_PRODUCTS = [
  { name: 'A2 Full Cream Milk', sales: 420 },
  { name: 'Pure Cow Ghee A2',   sales: 280 },
  { name: 'Fresh Paneer',        sales: 195 },
  { name: 'Probiotic Dahi',      sales: 165 },
  { name: 'Butter Unsalted',     sales: 130 },
];

const STATUS_STYLES = {
  placed:          'bg-slate-100 text-slate-600',
  confirmed:       'bg-blue-100 text-blue-700',
  processing:      'bg-yellow-100 text-yellow-700',
  dispatched:      'bg-blue-100 text-blue-700',
  out_for_delivery:'bg-violet-100 text-violet-700',
  delivered:       'bg-green-100 text-green-700',
  cancelled:       'bg-red-100 text-red-600',
};

export default function AdminDashboard() {
  const [stats,     setStats]     = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [lowStock,  setLowStock]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [lastSync,  setLastSync]  = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const [s, o, l] = await Promise.allSettled([
        dashboardService.stats(),
        orderService.list({ per_page: 6, sort: 'latest' }),
        inventoryService.lowStock(),
      ]);

      if (s.status === 'fulfilled') setStats(s.value.data);
      if (o.status === 'fulfilled') setOrders(o.value.data?.data ?? []);
      if (l.status === 'fulfilled') setLowStock(l.value.data?.data ?? []);
    } catch { /* silently use mock data */ }
    setLoading(false);
    setLastSync(new Date());
  };

  useEffect(() => { load(); }, []);

  // Mock stat fallbacks
  const s = stats ?? {
    total_products: 32, total_orders: 231, total_users: 57,
    today_revenue: 8240, month_revenue: 84000,
    pending_orders: 12, low_stock_count: 5,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Last synced: {lastSync.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200
                     text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard icon="💰" label="Today's Revenue"  value={formatCurrency(s.today_revenue)}  trend={12}  color="sky"    index={0} />
        <AdminStatCard icon="🛒" label="Total Orders"      value={s.total_orders}                   trend={8}   color="green"  index={1} />
        <AdminStatCard icon="👥" label="Total Users"       value={s.total_users}                    trend={5}   color="violet" index={2} />
        <AdminStatCard icon="⏳" label="Pending Orders"    value={s.pending_orders}
          sub="Needs attention" color="amber" index={3} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue + Orders area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-700">Revenue & Orders</h3>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <span className="badge-sky">₹{(s.month_revenue / 1000).toFixed(0)}k this month</span>
          </div>
          <RevenueChart data={REVENUE_DATA} height={240} />
        </div>

        {/* Order status donut */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-1">Order Status</h3>
          <p className="text-xs text-slate-400 mb-3">All time breakdown</p>
          <OrderStatusChart data={ORDER_STATUS_DATA} height={200} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <TopProductsChart data={TOP_PRODUCTS} height={220} />
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="pb-2 text-left font-semibold">Order</th>
                    <th className="pb-2 text-left font-semibold">Customer</th>
                    <th className="pb-2 text-left font-semibold">Total</th>
                    <th className="pb-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(orders.length ? orders : MOCK_ORDERS).map((order) => (
                    <tr key={order.id ?? order.order_number}
                      className="hover:bg-slate-50/50 cursor-pointer">
                      <td className="py-3 font-mono text-xs text-slate-500">
                        #{order.order_number ?? order.id}
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {order.delivery_name ?? order.customer}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        {formatCurrency(order.total_amount ?? order.total)}
                      </td>
                      <td className="py-3">
                        <span className={clsx(
                          'px-2 py-0.5 rounded-lg text-xs font-semibold capitalize',
                          STATUS_STYLES[order.order_status ?? order.status] ?? STATUS_STYLES.placed
                        )}>
                          {(order.order_status ?? order.status ?? 'placed').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {s.low_stock_count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700">
              {s.low_stock_count} product variant{s.low_stock_count > 1 ? 's' : ''} running low on stock
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Restock to avoid disruptions</p>
          </div>
          <Link to="/admin/inventory" className="btn-sm px-4 py-2 rounded-xl bg-amber-500
            text-white text-sm font-medium hover:bg-amber-600 transition-colors shrink-0">
            View Inventory
          </Link>
        </div>
      )}
    </div>
  );
}

const MOCK_ORDERS = [
  { order_number: 'DF20240604A1', delivery_name: 'Ramesh Kumar',  total_amount: 245, order_status: 'delivered' },
  { order_number: 'DF20240604B2', delivery_name: 'Priya Sharma',  total_amount: 850, order_status: 'dispatched' },
  { order_number: 'DF20240604C3', delivery_name: 'Anita Desai',   total_amount: 130, order_status: 'confirmed' },
  { order_number: 'DF20240604D4', delivery_name: 'Suresh Patel',  total_amount: 490, order_status: 'placed' },
  { order_number: 'DF20240604E5', delivery_name: 'Kavita Singh',  total_amount: 180, order_status: 'processing' },
];
