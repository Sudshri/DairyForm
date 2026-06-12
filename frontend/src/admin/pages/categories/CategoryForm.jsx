import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { X } from 'lucide-react';
import { categoryService } from '@/services/adminService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name:         z.string().min(1, 'Name required'),
  slug:         z.string().optional(),
  description:  z.string().optional(),
  icon:         z.string().optional(),
  parent_id:    z.coerce.number().optional().nullable(),
  sort_order:   z.coerce.number().optional(),
  is_active:    z.boolean().optional(),
  show_in_menu: z.boolean().optional(),
});

export default function CategoryForm({ category, categories = [], onClose, onSaved }) {
  const dispatch = useDispatch();
  const isEdit   = !!category;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, show_in_menu: true, sort_order: 0 },
  });

  useEffect(() => { if (category) reset(category); }, [category, reset]);

  const mut = useMutation({
    mutationFn: (data) => isEdit ? categoryService.update(category.id, data) : categoryService.create(data),
    onSuccess: () => {
      dispatch(setNotification({ type: 'success', message: `Category ${isEdit ? 'updated' : 'created'}!` }));
      onSaved?.();
    },
    onError: (e) => dispatch(setNotification({ type: 'error', message: e.response?.data?.message ?? 'Failed' })),
  });

  const nameVal = watch('name');

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div
        className="fixed right-0 top-0 bottom-0 z-50 bg-white w-full max-w-md shadow-xl
                   flex flex-col overflow-y-auto"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-display text-lg text-slate-800">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="flex-1 p-5 space-y-4">
          <div>
            <label className="input-label">Category Name *</label>
            <input className="input-field" placeholder="e.g. Fresh Milk" {...register('name')} />
            {errors.name && <p className="input-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="input-label">Slug</label>
            <input className="input-field font-mono" placeholder="auto-generated"
              {...register('slug')}
              onFocus={(e) => { if (!e.target.value && nameVal) e.target.value = nameVal.toLowerCase().replace(/\s+/g, '-'); }}
            />
          </div>

          <div>
            <label className="input-label">Icon / Emoji</label>
            <input className="input-field text-2xl" placeholder="🥛" {...register('icon')} />
          </div>

          <div>
            <label className="input-label">Parent Category</label>
            <select className="input-field" {...register('parent_id')}>
              <option value="">— None (top level) —</option>
              {categories.filter((c) => !c.parent_id && c.id !== category?.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea rows={3} className="input-field resize-none" {...register('description')} />
          </div>

          <div>
            <label className="input-label">Sort Order</label>
            <input type="number" className="input-field" {...register('sort_order')} />
          </div>

          <div className="space-y-2.5 pt-1">
            {[['is_active', 'Active'], ['show_in_menu', 'Show in Navigation Menu']].map(([k, lbl]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-blue-500 rounded"
                  {...register(k)} />
                <span className="text-sm text-slate-700">{lbl}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={mut.isPending}
              className="flex-1 py-2.5 rounded-2xl bg-blue-500 text-white text-sm font-semibold
                         hover:bg-blue-600 disabled:opacity-60 shadow-sm">
              {mut.isPending ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
