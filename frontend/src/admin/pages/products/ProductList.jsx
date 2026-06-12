import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import DataTable from '@/admin/components/DataTable';
import ConfirmModal from '@/admin/components/ConfirmModal';
import { productService } from '@/services/adminService';
import { formatCurrency } from '@/utils/formatters';
import { clsx } from 'clsx';

const STATUS_BADGE = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-slate-100 text-slate-500',
  draft:    'bg-yellow-100 text-yellow-700',
};

export default function ProductList() {
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [page,        setPage]       = useState(1);
  const [search,      setSearch]     = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn:  () => productService.list({ page, per_page: 15, search: search || undefined })
                    .then((r) => r.data),
    keepPreviousData: true,
  });

  const deleteMut = useMutation({
    mutationFn: (id) => productService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'products']);
      dispatch(setNotification({ type: 'success', message: 'Product deleted' }));
      setDeleteTarget(null);
    },
    onError: () => dispatch(setNotification({ type: 'error', message: 'Delete failed' })),
  });

  const columns = [
    {
      key: 'image', label: '', width: '16',
      render: (_, row) => (
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
          {row.image ? <img src={row.image} className="w-full h-full object-cover rounded-xl" /> : '🥛'}
        </div>
      ),
    },
    {
      key: 'product_name', label: 'Product', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{v}</p>
          <p className="text-xs text-slate-400">{row.category?.name ?? '—'}</p>
        </div>
      ),
    },
    { key: 'total_sales', label: 'Sales', sortable: true,
      render: (v) => <span className="font-semibold">{v ?? 0}</span> },
    { key: 'total_views', label: 'Views', sortable: true,
      render: (v) => v ?? 0 },
    {
      key: 'is_featured', label: 'Featured',
      render: (v) => v
        ? <span className="badge-sky">Yes</span>
        : <span className="text-slate-300 text-xs">—</span>,
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold capitalize',
          STATUS_BADGE[v] ?? STATUS_BADGE.draft)}>
          {v}
        </span>
      ),
    },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); window.open(`/products/${id}`, '_blank'); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <Eye size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${id}/edit`); }}
            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const products = data?.data ?? MOCK_PRODUCTS;
  const meta     = data?.meta;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-slate-800">Products</h2>
            <p className="text-sm text-slate-400">{meta?.total ?? products.length} products in catalogue</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-blue-600 shadow-sm transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={isLoading}
          meta={meta}
          onPage={setPage}
          onSearch={setSearch}
          onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
          emptyText="No products found. Click Add Product to create one."
        />
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product?"
        message={`"${deleteTarget?.product_name}" and all its variants will be permanently deleted.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </>
  );
}

const MOCK_PRODUCTS = [
  { id:1, product_name:'Farm Fresh Full Cream Milk A2', status:'active', total_sales:420, total_views:2100, is_featured:true,  image:null },
  { id:2, product_name:'Pure Cow Ghee A2',             status:'active', total_sales:280, total_views:1540, is_featured:true,  image:null },
  { id:3, product_name:'Homestyle Butter Unsalted',    status:'active', total_sales:195, total_views:980,  is_featured:false, image:null },
  { id:4, product_name:'Fresh Soft Paneer',            status:'active', total_sales:165, total_views:720,  is_featured:true,  image:null },
  { id:5, product_name:'Probiotic Dahi',               status:'inactive',total_sales:80, total_views:310,  is_featured:false, image:null },
];
