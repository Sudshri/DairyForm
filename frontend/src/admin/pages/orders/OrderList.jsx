import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/admin/components/DataTable';
import { orderService } from '@/services/adminService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

const STATUS_STYLES = {
  placed:          'bg-slate-100 text-slate-600',
  confirmed:       'bg-blue-100 text-blue-700',
  processing:      'bg-yellow-100 text-yellow-700',
  dispatched:      'bg-blue-100 text-blue-700',
  out_for_delivery:'bg-violet-100 text-violet-700',
  delivered:       'bg-green-100 text-green-700',
  cancelled:       'bg-red-100 text-red-600',
  returned:        'bg-orange-100 text-orange-700',
};

const PAYMENT_STYLES = {
  paid:    'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed:  'bg-red-100 text-red-600',
  refunded:'bg-violet-100 text-violet-700',
};

const STATUS_FILTERS = ['all', 'placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

export default function OrderList() {
  const navigate   = useNavigate();
  const [page,     setPage]    = useState(1);
  const [status,   setStatus]  = useState('all');
  const [search,   setSearch]  = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page, status, search],
    queryFn: () => orderService.list({
      page, per_page: 15,
      order_status: status !== 'all' ? status : undefined,
      search: search || undefined,
    }).then((r) => r.data),
    keepPreviousData: true,
  });

  const orders = data?.data ?? MOCK_ORDERS;
  const meta   = data?.meta;

  const columns = [
    {
      key: 'order_number', label: 'Order', sortable: true,
      render: (v) => <span className="font-mono text-xs text-slate-600">#{v}</span>,
    },
    {
      key: 'delivery_name', label: 'Customer',
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{v}</p>
          <p className="text-xs text-slate-400">{row.delivery_phone}</p>
        </div>
      ),
    },
    {
      key: 'total_amount', label: 'Total', sortable: true,
      render: (v) => <span className="font-bold text-slate-800">{formatCurrency(v)}</span>,
    },
    {
      key: 'payment_method', label: 'Payment',
      render: (v, row) => (
        <div>
          <p className="text-xs text-slate-600 capitalize">{v}</p>
          <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold capitalize',
            PAYMENT_STYLES[row.payment_status] ?? PAYMENT_STYLES.pending)}>
            {row.payment_status}
          </span>
        </div>
      ),
    },
    {
      key: 'order_status', label: 'Status',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize',
          STATUS_STYLES[v] ?? STATUS_STYLES.placed)}>
          {(v ?? 'placed').replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'created_at', label: 'Date', sortable: true,
      render: (v) => <span className="text-xs text-slate-500">{formatDate(v)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-display text-slate-800">Orders</h2>
        <p className="text-sm text-slate-400">{meta?.total ?? orders.length} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={clsx(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize',
              status === s
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
            )}>
            {s === 'all' ? 'All Orders' : s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={isLoading}
        meta={meta}
        onPage={setPage}
        onSearch={setSearch}
        onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
        emptyText="No orders found"
      />
    </div>
  );
}

const MOCK_ORDERS = [
  { id:1, order_number:'DF20240604A1', delivery_name:'Ramesh Kumar',  delivery_phone:'9876543210', total_amount:245, payment_method:'cod',      payment_status:'paid',    order_status:'delivered',  created_at:'2026-06-04' },
  { id:2, order_number:'DF20240604B2', delivery_name:'Priya Sharma',  delivery_phone:'9876543211', total_amount:850, payment_method:'razorpay', payment_status:'paid',    order_status:'dispatched', created_at:'2026-06-04' },
  { id:3, order_number:'DF20240604C3', delivery_name:'Anita Desai',   delivery_phone:'9876543212', total_amount:130, payment_method:'cod',      payment_status:'pending', order_status:'confirmed',  created_at:'2026-06-04' },
  { id:4, order_number:'DF20240604D4', delivery_name:'Suresh Patel',  delivery_phone:'9876543213', total_amount:490, payment_method:'upi',      payment_status:'paid',    order_status:'placed',     created_at:'2026-06-04' },
  { id:5, order_number:'DF20240604E5', delivery_name:'Kavita Singh',  delivery_phone:'9876543214', total_amount:180, payment_method:'cod',      payment_status:'refunded',order_status:'cancelled',  created_at:'2026-06-03' },
];
