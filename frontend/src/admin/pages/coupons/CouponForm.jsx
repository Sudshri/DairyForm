import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { X, Zap } from 'lucide-react';
import { offerService } from '@/services/adminService';

const randomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export default function CouponForm({ offer, onClose, onSaved }) {
  const dispatch = useDispatch();
  const isEdit   = !!offer;

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      offer_type: 'percentage', is_active: true, is_public: false,
      per_user_limit: 1,
    },
  });

  useEffect(() => { if (offer) reset(offer); }, [offer, reset]);

  const offerType = watch('offer_type');

  const mut = useMutation({
    mutationFn: (data) => isEdit ? offerService.update(offer.id, data) : offerService.create(data),
    onSuccess: () => {
      dispatch(setNotification({ type: 'success', message: `Offer ${isEdit ? 'updated' : 'created'}!` }));
      onSaved?.();
    },
    onError: (e) => dispatch(setNotification({ type: 'error', message: e.response?.data?.message ?? 'Failed' })),
  });

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} />
      <motion.div
        className="fixed right-0 top-0 bottom-0 z-50 bg-white w-full max-w-md shadow-xl flex flex-col overflow-y-auto"
        initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
        transition={{ type:'spring', damping:28, stiffness:280 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-display text-lg">{isEdit ? 'Edit Offer' : 'New Coupon / Offer'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="flex-1 p-5 space-y-4">
          <div>
            <label className="input-label">Offer Name *</label>
            <input className="input-field" placeholder="e.g. ₹50 OFF on Ghee" {...register('offer_name', { required: true })} />
          </div>

          <div>
            <label className="input-label">Coupon Code</label>
            <div className="flex gap-2">
              <input className="input-field font-mono flex-1" placeholder="Leave blank for auto-apply"
                {...register('offer_code')} />
              <button type="button" onClick={() => setValue('offer_code', randomCode())}
                className="px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm">
                <Zap size={13} /> Gen
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Empty = auto-applied (no code needed at checkout)</p>
          </div>

          <div>
            <label className="input-label">Offer Type *</label>
            <select className="input-field" {...register('offer_type')}>
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off</option>
              <option value="bogo">Buy 1 Get 1</option>
              <option value="category">Category Offer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">
                {offerType === 'percentage' ? 'Discount %' : 'Discount (₹)'} *
              </label>
              <input type="number" step="0.01" min="0" className="input-field"
                {...register('discount_value', { required: true })} />
            </div>
            {offerType === 'percentage' && (
              <div>
                <label className="input-label">Max Discount (₹)</label>
                <input type="number" step="0.01" className="input-field"
                  {...register('max_discount_amount')} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Min Order (₹)</label>
              <input type="number" step="0.01" className="input-field"
                {...register('min_order_amount')} />
            </div>
            <div>
              <label className="input-label">Usage Limit</label>
              <input type="number" className="input-field" placeholder="Unlimited"
                {...register('usage_limit')} />
            </div>
          </div>

          <div>
            <label className="input-label">Per User Limit</label>
            <input type="number" min="1" className="input-field" {...register('per_user_limit')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Start Date *</label>
              <input type="datetime-local" className="input-field text-sm"
                {...register('start_date', { required: true })} />
            </div>
            <div>
              <label className="input-label">End Date *</label>
              <input type="datetime-local" className="input-field text-sm"
                {...register('end_date', { required: true })} />
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {[['is_active', 'Active'], ['is_public', 'Show on storefront (no code needed)']].map(([k, lbl]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-blue-500" {...register(k)} />
                <span className="text-sm text-slate-700">{lbl}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={mut.isPending}
              className="flex-1 py-2.5 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60">
              {mut.isPending ? 'Saving…' : isEdit ? 'Update' : 'Create Offer'}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
