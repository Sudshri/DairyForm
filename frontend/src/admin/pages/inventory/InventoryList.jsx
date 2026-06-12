import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { AlertTriangle, PackagePlus, X, RefreshCw } from 'lucide-react';
import DataTable from '@/admin/components/DataTable';
import { inventoryService } from '@/services/adminService';
import { clsx } from 'clsx';

const STOCK_BADGE = {
  in_stock:    'bg-green-100 text-green-700',
  low_stock:   'bg-amber-100 text-amber-700',
  out_of_stock:'bg-red-100 text-red-600',
};

export default function InventoryList() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [restockTarget, setRestock] = useState(null);
  const [qty,  setQty]  = useState('');
  const [note, setNote] = useState('');

  // In a real app this would be a paginated list; here we use the low-stock endpoint + mock
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: () => inventoryService.lowStock().then((r) => r.data?.data ?? MOCK_INVENTORY),
  });

  const restockMut = useMutation({
    mutationFn: ({ id, qty, notes }) =>
      inventoryService.restock(id, { quantity_kg: Number(qty), notes }),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'inventory']);
      dispatch(setNotification({ type: 'success', message: 'Inventory restocked!' }));
      setRestock(null); setQty(''); setNote('');
    },
    onError: () => dispatch(setNotification({ type: 'error', message: 'Restock failed' })),
  });

  const columns = [
    {
      key: 'product_name', label: 'Product / Variant', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{v ?? row.variant?.product?.product_name}</p>
          <p className="text-xs text-slate-400">
            {row.variant_name ?? row.variant?.variant_name} · SKU: {row.sku ?? row.variant?.sku}
          </p>
        </div>
      ),
    },
    {
      key: 'stock_kg', label: 'Total Stock', sortable: true,
      render: (v) => <span className="font-semibold">{Number(v ?? 0).toFixed(1)} KG</span>,
    },
    {
      key: 'reserved_stock_kg', label: 'Reserved',
      render: (v) => <span className="text-amber-600">{Number(v ?? 0).toFixed(1)} KG</span>,
    },
    {
      key: 'available', label: 'Available',
      render: (_, row) => {
        const avail = (row.stock_kg ?? 0) - (row.reserved_stock_kg ?? 0);
        return <span className={avail <= 5 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
          {avail.toFixed(1)} KG
        </span>;
      },
    },
    {
      key: 'low_stock_alert_kg', label: 'Alert At',
      render: (v) => `${Number(v ?? 5).toFixed(1)} KG`,
    },
    {
      key: 'stock_status', label: 'Status',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap',
          STOCK_BADGE[v] ?? STOCK_BADGE.out_of_stock)}>
          {(v ?? 'out_of_stock').replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <button onClick={() => setRestock(row)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600
                     text-xs font-semibold hover:bg-blue-100 transition-colors">
          <PackagePlus size={13} /> Restock
        </button>
      ),
    },
  ];

  const inventory = data ?? MOCK_INVENTORY;
  const lowCount  = inventory.filter((i) => ['low_stock','out_of_stock'].includes(i.stock_status)).length;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-slate-800">Inventory</h2>
            <p className="text-sm text-slate-400">{inventory.length} variants tracked</p>
          </div>
          <button onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200
                       text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {lowCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700">
              <strong>{lowCount}</strong> variant{lowCount > 1 ? 's' : ''} need{lowCount === 1 ? 's' : ''} restocking
            </p>
          </div>
        )}

        <DataTable
          columns={columns}
          data={inventory}
          loading={isLoading}
          emptyText="All stock levels are healthy 🎉"
        />
      </div>

      {/* Restock modal */}
      <AnimatePresence>
        {restockTarget && (
          <>
            <motion.div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setRestock(null)} />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                         bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm"
              initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-slate-800">Restock Inventory</h3>
                <button onClick={() => setRestock(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                <strong>{restockTarget.product_name ?? restockTarget.variant?.product?.product_name}</strong>
                {' · '}{restockTarget.variant_name ?? restockTarget.variant?.variant_name}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="input-label">Quantity to Add (KG) *</label>
                  <input type="number" step="0.1" min="0.1" className="input-field"
                    placeholder="e.g. 50" value={qty} onChange={(e) => setQty(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Notes</label>
                  <input className="input-field" placeholder="Batch no, supplier…"
                    value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setRestock(null)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  disabled={!qty || restockMut.isPending}
                  onClick={() => restockMut.mutate({ id: restockTarget.product_variant_id ?? restockTarget.id, qty, notes: note })}
                  className="flex-1 py-2.5 rounded-2xl bg-blue-500 text-white text-sm font-semibold
                             hover:bg-blue-600 disabled:opacity-60 shadow-sm">
                  {restockMut.isPending ? 'Saving…' : 'Confirm Restock'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const MOCK_INVENTORY = [
  { id:1, product_variant_id:2, product_name:'A2 Full Cream Milk', variant_name:'500ml', sku:'FFFCMA-500ML', stock_kg:8.5,   reserved_stock_kg:2, low_stock_alert_kg:10, stock_status:'low_stock' },
  { id:2, product_variant_id:5, product_name:'Probiotic Dahi',     variant_name:'1kg',   sku:'PD-1KG',      stock_kg:0,     reserved_stock_kg:0, low_stock_alert_kg:5,  stock_status:'out_of_stock' },
  { id:3, product_variant_id:8, product_name:'Fresh Paneer',        variant_name:'500g',  sku:'FP-500G',     stock_kg:6.2,   reserved_stock_kg:1, low_stock_alert_kg:8,  stock_status:'low_stock' },
  { id:4, product_variant_id:3, product_name:'Pure Cow Ghee A2',   variant_name:'1kg',   sku:'PCGA-1KG',    stock_kg:45,    reserved_stock_kg:5, low_stock_alert_kg:10, stock_status:'in_stock' },
  { id:5, product_variant_id:7, product_name:'Homestyle Butter',   variant_name:'250g',  sku:'HBU-250G',    stock_kg:22,    reserved_stock_kg:2, low_stock_alert_kg:8,  stock_status:'in_stock' },
];
