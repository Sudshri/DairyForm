import { useState } from 'react';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import DataTable from '@/admin/components/DataTable';
import ConfirmModal from '@/admin/components/ConfirmModal';
import BannerForm from './BannerForm';
import { bannerService } from '@/services/adminService';
import { clsx } from 'clsx';

export default function BannerList() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [delTarget,setDelTarget]= useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: () => bannerService.list().then((r) => r.data?.data ?? MOCK_BANNERS),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => bannerService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'banners']);
      dispatch(setNotification({ type: 'success', message: 'Banner deleted' }));
      setDelTarget(null);
    },
  });

  const columns = [
    {
      key: 'image', label: 'Preview',
      render: (v, row) => (
        <div className="w-20 h-12 rounded-xl bg-blue-50 overflow-hidden flex items-center justify-center">
          {v ? <img src={v} alt={row.title} className="w-full h-full object-cover" />
              : <Image size={18} className="text-slate-300" />}
        </div>
      ),
    },
    {
      key: 'title', label: 'Banner', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{v}</p>
          {row.subtitle && <p className="text-xs text-slate-400">{row.subtitle}</p>}
        </div>
      ),
    },
    {
      key: 'banner_type', label: 'Type',
      render: (v) => (
        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold capitalize bg-violet-50 text-violet-700">
          {v}
        </span>
      ),
    },
    {
      key: 'link_type', label: 'Link',
      render: (v) => <span className="text-xs text-slate-500 capitalize">{v ?? 'none'}</span>,
    },
    { key: 'sort_order', label: 'Order', sortable: true },
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
            <h2 className="text-xl font-display text-slate-800">Banners</h2>
            <p className="text-sm text-slate-400">Manage homepage & offer banners</p>
          </div>
          <button onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-blue-600 shadow-sm">
            <Plus size={16} /> Add Banner
          </button>
        </div>
        <DataTable columns={columns} data={data ?? MOCK_BANNERS} loading={isLoading} />
      </div>

      {formOpen && (
        <BannerForm
          banner={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { qc.invalidateQueries(['admin', 'banners']); setFormOpen(false); }}
        />
      )}

      <ConfirmModal
        open={!!delTarget}
        title="Delete Banner?"
        message={`"${delTarget?.title}" will be removed from the storefront.`}
        onConfirm={() => deleteMut.mutate(delTarget.id)}
        onCancel={() => setDelTarget(null)}
        loading={deleteMut.isPending}
      />
    </>
  );
}

const MOCK_BANNERS = [
  { id:1, title:'Farm Fresh A2 Milk',  subtitle:'Pure, natural, no preservatives', banner_type:'slider', link_type:'category', sort_order:1, is_active:true,  image:null },
  { id:2, title:'Pure Bilona Ghee',    subtitle:'Handcrafted in small batches',     banner_type:'slider', link_type:'category', sort_order:2, is_active:true,  image:null },
  { id:3, title:'First Order 20% OFF', subtitle:'Use code FRESH20',                 banner_type:'slider', link_type:'none',     sort_order:3, is_active:true,  image:null },
  { id:4, title:'₹5 OFF on 1L Milk',  subtitle:'Limited time offer',               banner_type:'offer',  link_type:'product',  sort_order:1, is_active:false, image:null },
];
