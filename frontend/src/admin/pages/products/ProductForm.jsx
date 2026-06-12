import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import ImageUpload from '@/admin/components/ImageUpload';
import RichTextEditor from '@/admin/components/RichTextEditor';
import { productService, categoryService } from '@/services/adminService';

const variantSchema = z.object({
  variant_name:   z.string().min(1, 'Required'),
  weight:         z.coerce.number().positive(),
  weight_unit:    z.enum(['g', 'kg', 'ml', 'l', 'piece']),
  sku:            z.string().min(1, 'Required'),
  mrp_price:      z.coerce.number().min(0),
  selling_price:  z.coerce.number().min(0),
  purchase_price: z.coerce.number().min(0).optional(),
  status:         z.enum(['active', 'inactive']),
});

const schema = z.object({
  category_id:       z.coerce.number({ required_error: 'Category required' }),
  product_name:      z.string().min(2, 'Min 2 characters'),
  short_description: z.string().max(500).optional(),
  description:       z.string().optional(),
  is_featured:       z.boolean().optional(),
  is_trending:       z.boolean().optional(),
  status:            z.enum(['active', 'inactive', 'draft']),
  variants:          z.array(variantSchema).min(1, 'At least one variant required'),
});

const defaultVariant = () => ({
  variant_name: '', weight: '', weight_unit: 'g',
  sku: '', mrp_price: '', selling_price: '', purchase_price: '',
  status: 'active',
});

export default function ProductForm() {
  const { id }     = useParams();
  const isEdit     = !!id;
  const navigate   = useNavigate();
  const qc         = useQueryClient();
  const dispatch   = useDispatch();
  const [images,   setImages]   = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [description, setDescription] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories', 'all'],
    queryFn: () => categoryService.list({ per_page: 100 }).then((r) => r.data?.data ?? MOCK_CATS),
  });

  const { data: product } = useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => productService.show(id).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, control, setValue, reset, watch,
    formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', variants: [defaultVariant()] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  useEffect(() => {
    if (product) {
      reset({ ...product, variants: product.variants ?? [defaultVariant()] });
      setDescription(product.description ?? '');
      if (product.image) setImages([{ url: product.image }]);
    }
  }, [product, reset]);

  const saveMut = useMutation({
    mutationFn: (data) => isEdit
      ? productService.update(id, data)
      : productService.create(data),
    onSuccess: async (res) => {
      const pid = res.data?.id ?? id;
      // Upload images if any new ones
      if (images.some((i) => i.file)) {
        setUploading(true);
        const fd = new FormData();
        images.filter((i) => i.file).forEach((img) => fd.append('images[]', img.file));
        await productService.uploadImages(pid, fd, setProgress).catch(() => {});
        setUploading(false);
      }
      qc.invalidateQueries(['admin', 'products']);
      dispatch(setNotification({ type: 'success', message: `Product ${isEdit ? 'updated' : 'created'}!` }));
      navigate('/admin/products');
    },
    onError: (e) => dispatch(setNotification({ type: 'error', message: e.response?.data?.message ?? 'Failed to save' })),
  });

  const onSubmit = (data) => saveMut.mutate({ ...data, description });

  const handleNewImages = (files) => {
    const previews = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setImages((prev) => [...prev, ...previews]);
  };

  const W = watch('variants');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-display text-slate-800">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <p className="text-sm text-slate-400">Fill in product details and variants</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || saveMut.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500 text-white
                       text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 shadow-sm">
            <Save size={15} />
            {isSubmitting || saveMut.isPending ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm">Basic Information</h3>

            <div>
              <label className="input-label">Product Name *</label>
              <input className="input-field" placeholder="e.g. Farm Fresh Full Cream Milk"
                {...register('product_name')} />
              {errors.product_name && <p className="input-error">{errors.product_name.message}</p>}
            </div>

            <div>
              <label className="input-label">Short Description</label>
              <textarea rows={2} className="input-field resize-none"
                placeholder="Brief description shown in listings…"
                {...register('short_description')} />
            </div>

            <RichTextEditor
              label="Full Description"
              value={description}
              onChange={setDescription}
              error={errors.description?.message}
            />
          </div>

          {/* Variants */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700 text-sm">Product Variants</h3>
              <button type="button" onClick={() => append(defaultVariant())}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700">
                <Plus size={15} /> Add Variant
              </button>
            </div>
            {errors.variants?.root && (
              <p className="input-error mb-3">{errors.variants.root.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id}
                  className="border border-slate-200 rounded-2xl p-4 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Variant {idx + 1}
                    </span>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(idx)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="input-label">Name *</label>
                      <input className="input-field" placeholder="e.g. 500ml"
                        {...register(`variants.${idx}.variant_name`)} />
                    </div>
                    <div>
                      <label className="input-label">Weight *</label>
                      <input type="number" className="input-field" placeholder="500"
                        {...register(`variants.${idx}.weight`)} />
                    </div>
                    <div>
                      <label className="input-label">Unit *</label>
                      <select className="input-field" {...register(`variants.${idx}.weight_unit`)}>
                        {['g','kg','ml','l','piece'].map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">SKU *</label>
                      <input className="input-field" placeholder="MILK-500ML"
                        {...register(`variants.${idx}.sku`)} />
                    </div>
                    <div>
                      <label className="input-label">MRP (₹) *</label>
                      <input type="number" step="0.01" className="input-field" placeholder="35.00"
                        {...register(`variants.${idx}.mrp_price`)} />
                    </div>
                    <div>
                      <label className="input-label">Selling Price (₹) *</label>
                      <input type="number" step="0.01" className="input-field" placeholder="30.00"
                        {...register(`variants.${idx}.selling_price`)} />
                    </div>
                    <div>
                      <label className="input-label">Purchase Price (₹)</label>
                      <input type="number" step="0.01" className="input-field" placeholder="16.00"
                        {...register(`variants.${idx}.purchase_price`)} />
                    </div>
                    <div>
                      <label className="input-label">Status</label>
                      <select className="input-field" {...register(`variants.${idx}.status`)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    {W[idx]?.selling_price && W[idx]?.mrp_price && (
                      <div className="flex items-end pb-1">
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg">
                          {Math.round((1 - W[idx].selling_price / W[idx].mrp_price) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status & Category */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm">Publishing</h3>

            <div>
              <label className="input-label">Category *</label>
              <select className="input-field" {...register('category_id')}>
                <option value="">— Select —</option>
                {(categories.length ? categories : MOCK_CATS).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="input-error">{errors.category_id.message}</p>}
            </div>

            <div>
              <label className="input-label">Status</label>
              <select className="input-field" {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              {[['is_featured', 'Featured Product'], ['is_trending', 'Trending Product']].map(([k, lbl]) => (
                <label key={k} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-blue-500 rounded"
                    {...register(k)} />
                  <span className="text-sm text-slate-700">{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <ImageUpload
              label="Product Images"
              value={images}
              onChange={handleNewImages}
              onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              onSetPrimary={(i) => setImages((prev) => {
                const next = [...prev];
                const [item] = next.splice(i, 1);
                next.unshift(item);
                return next;
              })}
              uploading={uploading}
              progress={progress}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

const MOCK_CATS = [
  { id:1, name:'Milk' }, { id:2, name:'Ghee' }, { id:3, name:'Butter' },
  { id:4, name:'Paneer' }, { id:5, name:'Curd & Dahi' },
];
