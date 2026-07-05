import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { X } from 'lucide-react';
import ImageUpload from '@/admin/components/ImageUpload';
import { bannerService } from '@/services/adminService';
import { apiPost, apiUpload } from '@/services/apiClient';
import API from '@/constants/api';

export default function BannerForm({ banner, onClose, onSaved }) {
  const dispatch = useDispatch();
  const isEdit   = !!banner;
  const [images, setImages] = useState([]);

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { banner_type:'slider', link_type:'none', sort_order:0, is_active:true },
  });

  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    if (!banner) return;
    resetRef.current(banner);
    setImages(banner.image ? [{ url: banner.image }] : []);
  }, [banner]);

  const linkType = watch('link_type');

  const mut = useMutation({
    mutationFn: (data) => {
      const hasNewImage = !!images[0]?.file;

      if (hasNewImage) {
        // Must use multipart/form-data when uploading a file
        const fd = new FormData();
        // Strip image/mobile_image — they come from reset(banner) as URL strings.
        // We append the actual file below, so including the URL would send both
        // causing PHP to receive image as an array → saved as ["url",[]] in DB.
        const { image, mobile_image, ...formFields } = data;
        Object.entries(formFields).forEach(([k, v]) => {
          if (v == null || v === '') return;
          fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v);
        });
        fd.append('image', images[0].file);

        if (isEdit) {
          // PHP ignores files on PUT; use POST + _method spoofing
          fd.append('_method', 'PUT');
          return apiPost(API.ADMIN.BANNERS.UPDATE(banner.id), fd);
        }
        return apiUpload(API.ADMIN.BANNERS.CREATE, fd);
      }

      // No new image — send plain JSON, strip file/URL fields that aren't changing
      const { image, mobile_image, ...rest } = data;
      // Convert empty strings to null so backend nullable rules pass
      const clean = Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v])
      );
      return isEdit
        ? bannerService.update(banner.id, clean)
        : bannerService.create(clean);
    },
    onSuccess: () => {
      dispatch(setNotification({ type: 'success', message: `Banner ${isEdit ? 'updated' : 'created'}!` }));
      onSaved?.();
    },
    onError: () => dispatch(setNotification({ type: 'error', message: 'Failed to save banner' })),
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
          <h3 className="font-display text-lg">{isEdit ? 'Edit Banner' : 'New Banner'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="flex-1 p-5 space-y-4">
          <div>
            <label className="input-label">Title *</label>
            <input className="input-field" {...register('title', { required: true })} />
          </div>
          <div>
            <label className="input-label">Subtitle</label>
            <input className="input-field" {...register('subtitle')} />
          </div>
          <div>
            <label className="input-label">CTA Text</label>
            <input className="input-field" placeholder="Shop Now" {...register('cta_text')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Banner Type</label>
              <select className="input-field" {...register('banner_type')}>
                {['slider','offer','popup','category_strip','full_width'].map((t) =>
                  <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Sort Order</label>
              <input type="number" className="input-field" {...register('sort_order')} />
            </div>
          </div>
          <div>
            <label className="input-label">Link Type</label>
            <select className="input-field" {...register('link_type')}>
              {['none','product','category','offer','external'].map((t) =>
                <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {linkType !== 'none' && linkType !== 'external' && (
            <div>
              <label className="input-label">Link ID</label>
              <input type="number" className="input-field" {...register('link_id')} />
            </div>
          )}
          {linkType === 'external' && (
            <div>
              <label className="input-label">URL</label>
              <input type="url" className="input-field" {...register('link_url')} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Start Date</label>
              <input type="datetime-local" className="input-field text-sm" {...register('start_date')} />
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input type="datetime-local" className="input-field text-sm" {...register('end_date')} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-blue-500" {...register('is_active')} />
            <span className="text-sm text-slate-700">Active</span>
          </label>
          <ImageUpload
            label="Banner Image"
            value={images}
            onChange={(files) => setImages([{ url: URL.createObjectURL(files[0]), file: files[0] }])}
            onRemove={() => setImages([])}
            maxFiles={1}
          />
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={mut.isPending}
              className="flex-1 py-2.5 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60">
              {mut.isPending ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
