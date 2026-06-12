import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ChevronRight, Clock, CheckCircle, Truck,
  XCircle, RotateCcw, MapPin, CreditCard, ArrowLeft,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import Breadcrumb from '@/components/common/Breadcrumb';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/common/EmptyState';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useOrders, useOrder, useCancelOrder } from '@/hooks/useOrders';
import { useAddToCart } from '@/hooks/useProducts';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

const STATUS_CONFIG = {
  pending:    { variant:'cream',  label:'Pending',    icon:<Clock size={13} />,         steps:1 },
  confirmed:  { variant:'sky',    label:'Confirmed',  icon:<CheckCircle size={13} />,    steps:2 },
  dispatched: { variant:'sky',    label:'Dispatched', icon:<Truck size={13} />,          steps:3 },
  delivered:  { variant:'green',  label:'Delivered',  icon:<CheckCircle size={13} />,    steps:4 },
  cancelled:  { variant:'red',    label:'Cancelled',  icon:<XCircle size={13} />,        steps:0 },
};

const ORDER_STEPS = ['Order Placed', 'Confirmed', 'Dispatched', 'Delivered'];

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

// ── Order list ───────────────────────────────────────────────────
function OrderList() {
  const [statusFilter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { data, isLoading } = useOrders(
    statusFilter !== 'all' ? { status: statusFilter } : {}
  );
  const orders = data?.data ?? [];

  return (
    <>
      <SEOHead title="My Orders" />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
        <FloatingBlob color="#BAE6FD" size={350} opacity={0.18} className="top-20 -right-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Breadcrumb items={[{ label: 'Orders', to: '/orders' }]} className="mb-6" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Package size={22} className="text-blue-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl text-slate-900">My Orders</h1>
              <p className="text-slate-400 text-sm">{orders.length} total orders</p>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={clsx(
                  'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all',
                  statusFilter === s
                    ? 'bg-blue-500 text-white shadow-soft-md'
                    : 'bg-white border border-blue-100 text-slate-600 hover:border-blue-300'
                )}
              >
                {s === 'all' ? 'All Orders' : s}
              </button>
            ))}
          </div>

          {/* Order cards */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-3xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              emoji="📦"
              title="No orders yet"
              description="Place your first order and track it here."
              action={() => navigate('/products')}
              actionLabel="Shop Now"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <GlassCard
                      variant="white"
                      className="p-5 cursor-pointer hover:shadow-card-hover transition-all"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-slate-400">#{order.id}</span>
                            <Badge variant={s.variant}>
                              <span className="flex items-center gap-1">{s.icon} {s.label}</span>
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">{formatDate(order.date)}</p>
                        </div>
                        <span className="font-display text-xl font-bold text-slate-800">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mb-3">
                        {order.items.map((i) => `${i.name} ×${i.qty ?? 1}`).join('  ·  ')}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
                          View details <ChevronRight size={12} />
                        </span>
                        {order.status === 'delivered' && (
                          <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                            <CheckCircle size={12} /> Delivered
                          </span>
                        )}
                        {order.status === 'dispatched' && order.tracking && (
                          <span className="text-xs text-blue-500">
                            ETA: {order.tracking.eta}
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Order detail ─────────────────────────────────────────────────
function OrderDetail({ orderId }) {
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId);
  const { mutate: cancel, isPending: cancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-milk-soft pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) return <EmptyState emoji="📭" title="Order not found" action={() => navigate('/orders')} actionLabel="Back to Orders" />;

  const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <>
      <SEOHead title={`Order #${order.id}`} />
      <div className="min-h-screen bg-milk-soft pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[{ label: 'Orders', to: '/orders' }, { label: `#${order.id}`, to: `/orders/${order.id}` }]}
            className="mb-6"
          />

          {/* Page header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate('/orders')}
              className="w-9 h-9 rounded-2xl hover:bg-blue-50 flex items-center justify-center text-slate-400">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-display text-2xl text-slate-900">Order #{order.id}</h1>
              <p className="text-sm text-slate-400">{formatDate(order.date)}</p>
            </div>
            <Badge variant={s.variant} className="ml-auto">
              <span className="flex items-center gap-1">{s.icon} {s.label}</span>
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Order progress */}
              {order.status !== 'cancelled' && (
                <GlassCard variant="white" className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-5 text-sm">Order Progress</h3>
                  <div className="flex items-center gap-0">
                    {ORDER_STEPS.map((step, i) => {
                      const done  = i < s.steps;
                      const active = i === s.steps - 1;
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                              done   ? 'bg-blue-500 text-white shadow-soft-md'
                                     : 'bg-blue-50 text-slate-300 border-2 border-blue-100'
                            )}>
                              {done ? <CheckCircle size={14} /> : i + 1}
                            </div>
                            <p className={clsx(
                              'text-xs mt-1.5 text-center w-16',
                              done ? 'text-blue-600 font-medium' : 'text-slate-400'
                            )}>{step}</p>
                          </div>
                          {i < ORDER_STEPS.length - 1 && (
                            <div className={clsx(
                              'flex-1 h-0.5 mb-5 mx-1 transition-colors',
                              i < s.steps - 1 ? 'bg-blue-400' : 'bg-blue-100'
                            )} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              )}

              {/* Items */}
              <GlassCard variant="white" className="p-5">
                <h3 className="font-semibold text-slate-700 mb-4 text-sm">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-blue-50 last:border-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">🥛</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400">×{item.qty ?? 1}</p>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm shrink-0">
                        {formatCurrency((item.qty ?? 1) * item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Tracking */}
              {order.tracking && (
                <GlassCard variant="white" className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
                    <Truck size={16} className="text-blue-500" /> Tracking
                  </h3>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Carrier: <strong>{order.tracking.carrier}</strong></p>
                    <p>AWB: <span className="font-mono text-blue-600">{order.tracking.awb}</span></p>
                    <p>Estimated Delivery: <strong className="text-green-600">{order.tracking.eta}</strong></p>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <GlassCard variant="white" className="p-5">
                <h3 className="font-semibold text-slate-700 mb-4 text-sm">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(order.total)}</span></div>
                  <div className="flex justify-between text-slate-500"><span>Delivery</span><span className="text-green-500">FREE</span></div>
                  <div className="border-t border-blue-50 pt-2 flex justify-between font-bold text-slate-800">
                    <span>Total</span>
                    <span className="font-display">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="white" className="p-5">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
                  <MapPin size={15} className="text-blue-400" /> Delivery Address
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{order.address}</p>
              </GlassCard>

              <GlassCard variant="white" className="p-5">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
                  <CreditCard size={15} className="text-blue-400" /> Payment
                </h3>
                <p className="text-sm text-slate-600 font-medium">{order.payment}</p>
              </GlassCard>

              {/* Actions */}
              <div className="space-y-2">
                {order.status === 'delivered' && (
                  <Button variant="outline" className="w-full justify-center" size="sm"
                    icon={<RotateCcw size={14} />}>
                    Reorder
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-500 hover:bg-red-50"
                    size="sm"
                    loading={cancelling}
                    onClick={() => cancel(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Orders() {
  const { id } = useParams();
  return id ? <OrderDetail orderId={id} /> : <OrderList />;
}
