import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { ArrowLeft, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { orderService } from '@/services/adminService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

const ORDER_STEPS = [
  { key: 'placed',           label: 'Placed',           icon: '📋' },
  { key: 'confirmed',        label: 'Confirmed',        icon: '✅' },
  { key: 'processing',       label: 'Processing',       icon: '📦' },
  { key: 'dispatched',       label: 'Dispatched',       icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered',        label: 'Delivered',        icon: '🎉' },
];

const STATUS_OPTIONS = ['confirmed','processing','dispatched','out_for_delivery','delivered','cancelled'];

export default function OrderDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [statusVal, setStatusVal] = useState('');
  const [trackMsg,  setTrackMsg]  = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => orderService.show(id).then((r) => r.data ?? MOCK_ORDER),
  });

  const statusMut = useMutation({
    mutationFn: (data) => orderService.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'orders']);
      dispatch(setNotification({ type: 'success', message: 'Order status updated' }));
      setStatusVal(''); setTrackMsg('');
    },
  });

  const o = order ?? MOCK_ORDER;
  const currentStep = ORDER_STEPS.findIndex((s) => s.key === o.order_status);

  if (isLoading) return <div className="space-y-4">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-24 rounded-2xl"/>)}</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-display text-slate-800">Order #{o.order_number}</h2>
          <p className="text-sm text-slate-400">{formatDate(o.created_at)}</p>
        </div>
        <span className={clsx(
          'ml-auto px-3 py-1 rounded-xl text-sm font-semibold capitalize',
          o.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
          o.order_status === 'cancelled' ? 'bg-red-100 text-red-600' :
          'bg-blue-100 text-blue-700'
        )}>
          {o.order_status?.replace(/_/g,' ')}
        </span>
      </div>

      {/* Progress stepper */}
      {o.order_status !== 'cancelled' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 text-sm mb-5">Order Progress</h3>
          <div className="flex items-center">
            {ORDER_STEPS.map((step, i) => {
              const done   = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all',
                      active ? 'bg-blue-500 shadow-[0_4px_12px_rgba(14,165,233,0.4)] scale-110' :
                      done   ? 'bg-green-500' : 'bg-slate-100'
                    )}>
                      {done ? (active ? step.icon : '✓') : step.icon}
                    </div>
                    <p className={clsx('text-xs mt-2 text-center w-16 font-medium',
                      active ? 'text-blue-600' : done ? 'text-green-600' : 'text-slate-400')}>
                      {step.label}
                    </p>
                  </div>
                  {i < ORDER_STEPS.length - 1 && (
                    <div className={clsx('flex-1 h-1 mx-1 rounded-full transition-colors',
                      i < currentStep ? 'bg-green-400' : 'bg-slate-100')} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {(o.items ?? MOCK_ORDER.items).map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">🥛</div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{item.product_name}</p>
                    <p className="text-xs text-slate-400">{item.variant_name} × {item.qty}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(o.sub_total)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Delivery</span><span className={o.delivery_charge === 0 ? 'text-green-600' : ''}>{o.delivery_charge === 0 ? 'FREE' : formatCurrency(o.delivery_charge)}</span></div>
              {o.discount_amount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(o.discount_amount)}</span></div>}
              <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-100"><span>Total</span><span className="font-display text-lg">{formatCurrency(o.total_amount)}</span></div>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4">Update Order Status</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <select className="input-field" value={statusVal} onChange={(e) => setStatusVal(e.target.value)}>
                <option value="">— Select new status —</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
              <input className="input-field" placeholder="Message for customer…"
                value={trackMsg} onChange={(e) => setTrackMsg(e.target.value)} />
            </div>
            <button
              disabled={!statusVal || statusMut.isPending}
              onClick={() => statusMut.mutate({ status: statusVal, message: trackMsg, notify_customer: true })}
              className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold
                         hover:bg-blue-600 disabled:opacity-50 shadow-sm">
              {statusMut.isPending ? 'Updating…' : 'Update Status'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">Customer</h4>
            <p className="font-medium text-slate-800 text-sm">{o.delivery_name}</p>
            <p className="text-xs text-slate-500">{o.delivery_phone}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">Delivery Address</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {o.delivery_address}, {o.delivery_city}, {o.delivery_state} – {o.delivery_pincode}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">Payment</h4>
            <p className="text-sm text-slate-600 capitalize">{o.payment_method}</p>
            <span className={clsx('mt-1 inline-block px-2 py-0.5 rounded-lg text-xs font-semibold',
              o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
              {o.payment_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_ORDER = {
  id:1, order_number:'DF20240604A1',
  delivery_name:'Ramesh Kumar', delivery_phone:'9876543210',
  delivery_address:'123 Farm Rd', delivery_city:'Pune', delivery_state:'Maharashtra', delivery_pincode:'411001',
  sub_total:225, delivery_charge:20, discount_amount:0, total_amount:245,
  payment_method:'cod', payment_status:'paid', order_status:'delivered', created_at:'2026-06-04',
  items:[
    { product_name:'A2 Full Cream Milk', variant_name:'1 Litre', qty:2, total:116 },
    { product_name:'Probiotic Dahi',     variant_name:'400g',    qty:1, total:58  },
    { product_name:'Butter Unsalted',    variant_name:'100g',    qty:1, total:51  },
  ],
};
