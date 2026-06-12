import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import DataTable from '@/admin/components/DataTable';
import ConfirmModal from '@/admin/components/ConfirmModal';
import CouponForm from './CouponForm';
import { offerService } from '@/services/adminService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

const TYPE_BADGE = {
  percentage: 'bg-blue-50 text-blue-700',
  fixed:      'bg-green-50 text-green-700',
  bogo:       'bg-violet-50 text-violet-700',
  category:   'bg-amber-50 text-amber-700',
};

export default function CouponList() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [delTarget,setDelTarget]= useState(null);
  const [copied,   setCopied]   = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'offers'],
    queryFn: () => offerService.list().then((r) => r.data?.data ?? MOCK_OFFERS),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => offerService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'offers']);
      dispatch(setNotification({ type: 'success', message: 'Offer deleted' }));
      setDelTarget(null);
    },
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const columns = [
    {
      key: 'offer_name', label: 'Offer', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{v}</p>
          {row.offer_code && (
            <button
              onClick={(e) => { e.stopPropagation(); copyCode(row.offer_code); }}
              className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-0.5"
            >
              <code className="bg-blue-50 px-1.5 py-0.5 rounded font-mono">{row.offer_code}</code>
              {copied === row.offer_code ? <CheckCircle size={10} className="text-green-500" /> : <Copy size={10} />}
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'offer_type', label: 'Type',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold capitalize',
          TYPE_BADGE[v] ?? TYPE_BADGE.fixed)}>{v}</span>
      ),
    },
    {
      key: 'discount_value', label: 'Discount', sortable: true,
      render: (v, row) => row.offer_type === 'percentage'
        ? <span className="font-semibold">{v}%</span>
        : <span className="font-semibold">{formatCurrency(v)}</span>,
    },
    {
      key: 'min_order_amount', label: 'Min Order',
      render: (v) => v ? formatCurrency(v) : <span className="text-slate-300">—</span>,
    },
    {
      key: 'used_count', label: 'Used', sortable: true,
      render: (v, row) => (
        <span>
          {v ?? 0}
          {row.usage_limit && <span className="text-slate-400"> / {row.usage_limit}</span>}
        </span>
      ),
    },
    {
      key: 'end_date', label: 'Expires',
      render: (v) => {
        if (!v) return <span className="text-slate-300">—</span>;
        const expired = new Date(v) < new Date();
        return (
          <span className={expired ? 'text-red-500 text-xs' : 'text-xs'}>
            {expired ? '⚠️ ' : ''}{formatDate(v)}
          </span>
        );
      },
    },
    {
      key: 'is_active', label: 'Status',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold',
          v ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
          {v ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setEditing(row); setFormOpen(true); }}
            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600">
            <Edit2 size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDelTarget(row); }}
            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500">
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-slate-800">Coupons & Offers</h2>
            <p className="text-sm text-slate-400">{(data ?? MOCK_OFFERS).length} offers configured</p>
          </div>
          <button onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-blue-600 shadow-sm">
            <Plus size={16} /> New Offer
          </button>
        </div>
        <DataTable columns={columns} data={data ?? MOCK_OFFERS} loading={isLoading} />
      </div>

      {formOpen && (
        <CouponForm
          offer={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { qc.invalidateQueries(['admin', 'offers']); setFormOpen(false); }}
        />
      )}

      <ConfirmModal
        open={!!delTarget}
        title="Delete Offer?"
        message={`"${delTarget?.offer_name}" will be permanently deleted.`}
        onConfirm={() => deleteMut.mutate(delTarget.id)}
        onCancel={() => setDelTarget(null)}
        loading={deleteMut.isPending}
      />
    </>
  );
}

const MOCK_OFFERS = [
  { id:1, offer_name:'₹5 OFF on Milk 1L',   offer_code:null,     offer_type:'fixed',      discount_value:5,   min_order_amount:null,  usage_limit:null, used_count:142, is_active:true,  end_date:'2026-09-30' },
  { id:2, offer_name:'10% OFF Milk 500ml',   offer_code:null,     offer_type:'percentage', discount_value:10,  min_order_amount:null,  usage_limit:null, used_count:89,  is_active:true,  end_date:'2026-08-30' },
  { id:3, offer_name:'₹50 OFF Ghee Order',   offer_code:'GHEE50', offer_type:'fixed',      discount_value:50,  min_order_amount:500,   usage_limit:200,  used_count:67,  is_active:true,  end_date:'2026-07-04' },
  { id:4, offer_name:'First Order 20% OFF',  offer_code:'FRESH20',offer_type:'percentage', discount_value:20,  min_order_amount:null,  usage_limit:1000, used_count:234, is_active:true,  end_date:'2026-12-31' },
  { id:5, offer_name:'5% OFF All Butter',    offer_code:null,     offer_type:'category',   discount_value:5,   min_order_amount:null,  usage_limit:null, used_count:0,   is_active:false, end_date:'2026-08-30' },
];
