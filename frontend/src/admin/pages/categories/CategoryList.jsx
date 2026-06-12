import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import DataTable from '@/admin/components/DataTable';
import ConfirmModal from '@/admin/components/ConfirmModal';
import CategoryForm from './CategoryForm';
import { categoryService } from '@/services/adminService';
import { clsx } from 'clsx';

export default function CategoryList() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [formOpen, setFormOpen]   = useState(false);
  const [editing,  setEditing]    = useState(null);
  const [delTarget,setDelTarget]  = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => categoryService.list({ per_page: 100 }).then((r) => r.data?.data ?? MOCK_CATS),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'categories']);
      dispatch(setNotification({ type: 'success', message: 'Category deleted' }));
      setDelTarget(null);
    },
    onError: () => dispatch(setNotification({ type: 'error', message: 'Cannot delete — has products' })),
  });

  const columns = [
    {
      key: 'icon', label: '', width: '12',
      render: (v) => <span className="text-2xl">{v ?? '📦'}</span>,
    },
    {
      key: 'name', label: 'Category', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800">{v}</p>
          {row.parent_id && <p className="text-xs text-slate-400 flex items-center gap-0.5">
            Sub-category <ChevronRight size={10} />
          </p>}
        </div>
      ),
    },
    { key: 'slug', label: 'Slug', render: (v) => <code className="text-xs bg-slate-100 px-2 py-0.5 rounded-lg">{v}</code> },
    {
      key: 'is_active', label: 'Status',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold',
          v ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
          {v ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'show_in_menu', label: 'In Menu',
      render: (v) => v ? '✓' : <span className="text-slate-300">—</span> },
    { key: 'sort_order', label: 'Order', sortable: true },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setEditing(row); setFormOpen(true); }}
            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDelTarget(row); }}
            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  const cats = data ?? MOCK_CATS;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-slate-800">Categories</h2>
            <p className="text-sm text-slate-400">{cats.length} categories</p>
          </div>
          <button onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-blue-600 shadow-sm transition-colors">
            <Plus size={16} /> Add Category
          </button>
        </div>

        <DataTable columns={columns} data={cats} loading={isLoading} />
      </div>

      {/* Slide-in form */}
      {formOpen && (
        <CategoryForm
          category={editing}
          categories={cats}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { qc.invalidateQueries(['admin', 'categories']); setFormOpen(false); }}
        />
      )}

      <ConfirmModal
        open={!!delTarget}
        title="Delete Category?"
        message={`"${delTarget?.name}" will be deleted. Products in this category may become uncategorised.`}
        onConfirm={() => deleteMut.mutate(delTarget.id)}
        onCancel={() => setDelTarget(null)}
        loading={deleteMut.isPending}
      />
    </>
  );
}

const MOCK_CATS = [
  { id:1, name:'Milk',        slug:'milk',       icon:'🥛', is_active:true, show_in_menu:true,  sort_order:1, parent_id:null },
  { id:2, name:'Ghee',        slug:'ghee',       icon:'🍯', is_active:true, show_in_menu:true,  sort_order:2, parent_id:null },
  { id:3, name:'Butter',      slug:'butter',     icon:'🧈', is_active:true, show_in_menu:true,  sort_order:3, parent_id:null },
  { id:4, name:'Paneer',      slug:'paneer',     icon:'🧀', is_active:true, show_in_menu:true,  sort_order:4, parent_id:null },
  { id:5, name:'Curd & Dahi', slug:'curd',       icon:'🥣', is_active:true, show_in_menu:true,  sort_order:5, parent_id:null },
  { id:6, name:'A2 Cow Milk', slug:'a2-cow-milk',icon:'🐄', is_active:true, show_in_menu:false, sort_order:1, parent_id:1 },
];
