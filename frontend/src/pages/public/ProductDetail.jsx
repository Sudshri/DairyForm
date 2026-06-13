import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Shield, Star, ChevronDown, ChevronUp, Phone, Mail, ArrowLeft, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useProduct } from '@/hooks/useProducts';
import BulkOrderModal from '@/components/modals/BulkOrderModal';

const BENEFITS = {
  Milk:   ['Rich in Calcium & Vitamins', 'No Preservatives', 'Pasteurized & Safe', 'Farm Fresh Daily'],
  Ghee:   ['A2 Beta-Casein Protein', 'Rich in Healthy Fats', 'Traditional Bilona Method', 'Improves Digestion'],
  Paneer: ['High Protein Content', 'Soft & Fresh Texture', 'No Artificial Colors', 'Full Cream Milk'],
  Butter: ['Pure Cream Butter', 'No Trans Fats', 'Rich Natural Taste', 'Ideal for Cooking'],
  default:['100% Natural', 'No Preservatives', 'Farm to Table', 'Quality Tested'],
};

const FAQ = [
  { q: 'How fresh are the products?',  a: 'Products are sourced fresh and dispatched within 24 hours of processing.' },
  { q: 'What certifications do you hold?', a: 'We are FSSAI certified (12225039000413) and GST registered (08AIYPH7023E1Z2).' },
  { q: 'How do I place a bulk order?', a: 'Contact us at contact@everfresh.org.in or call us directly for wholesale pricing and bulk delivery options.' },
];

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [liked,    setLiked]    = useState(false);
  const [selImg,   setSelImg]   = useState(0);
  const [selVar,   setSelVar]   = useState(0);
  const [openFaq,  setOpenFaq]  = useState(null);
  const [tab,      setTab]      = useState('description');

  const [bulkOpen, setBulkOpen] = useState(false);
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-milk-soft pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="skeleton aspect-square rounded-4xl" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-32 rounded-xl" />
              <div className="skeleton h-10 w-3/4 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-xl" />
              <div className="skeleton h-20 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-milk-soft pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">??</p>
          <p className="font-display text-2xl text-slate-700 mb-2">Product not found</p>
          <button onClick={() => navigate('/products')} className="mt-4 text-blue-500 hover:underline text-sm">
            Back to all products
          </button>
        </div>
      </div>
    );
  }

  const cat      = product.category ?? '';
  const benefits = BENEFITS[cat] ?? BENEFITS.default;
  const variants = product.variants ?? [];
  const variant  = variants[selVar] ?? null;
  const selling  = variant?.selling_price ?? 0;
  const mrp      = variant?.mrp_price ?? 0;
  const discount = mrp > selling && selling > 0 ? Math.round((1 - selling / mrp) * 100) : 0;

  const images = product.images?.length
    ? product.images.map((img) => img.image_path ?? img.full_url)
    : [product.image];

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50"
              style={{ height: '420px' }}>
              <FloatingBlob color="#BAE6FD" size={200} opacity={0.3} className="top-0 right-0" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={selImg}
                  className="absolute inset-0 flex items-center justify-center p-6"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {images[selImg] ? (
                    <img
                      src={images[selImg]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-9xl">🥛</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelImg(i)}
                    className={`flex-1 aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50
                      flex items-center justify-center overflow-hidden transition-all ${
                      selImg === i ? 'ring-2 ring-blue-400 shadow-soft' : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    {src ? <img src={src} alt="" className="w-full h-full object-contain p-2" /> : <span className="text-3xl">??</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--d-accent)' }}>
                {cat}
              </p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl md:text-4xl text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setLiked((l) => !l)}
                    className="w-10 h-10 rounded-2xl border border-blue-100 bg-white flex items-center justify-center transition-colors"
                  >
                    <Heart size={18} style={{ color: liked ? '#EF4444' : '#94A3B8', fill: liked ? '#EF4444' : 'none' }} />
                  </button>
                  <button className="w-10 h-10 rounded-2xl border border-blue-100 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-slate-500 mt-2 leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => {
                    const isSel = i === selVar;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelVar(i)}
                        className="px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all"
                        style={{
                          background: isSel ? 'var(--d-accent-lt)' : '#fff',
                          borderColor: isSel ? 'var(--d-accent)' : '#E2EAF0',
                          color: isSel ? 'var(--d-accent)' : '#475569',
                        }}
                      >
                        {v.variant_name}
                        <span className="ml-2 font-bold">Rs.{v.selling_price}</span>
                        {v.mrp_price > v.selling_price && (
                          <span className="ml-1 line-through text-xs opacity-50">Rs.{v.mrp_price}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {variant && (
                  <div className="flex items-end gap-3 mt-4">
                    <span className="font-display text-4xl font-bold text-slate-900">Rs.{selling}</span>
                    {mrp > selling && (
                      <span className="text-slate-400 line-through text-xl mb-0.5">Rs.{mrp}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-sm font-bold px-3 py-1 rounded-full bg-red-50 text-red-500 mb-0.5">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield size={16} />, text: 'FSSAI Certified' },
                { icon: <Star size={16} />, text: 'Premium Quality' },
                { icon: <Check size={16} />, text: 'Farm to Table' },
              ].map(({ icon, text }) => (
                <GlassCard key={text} variant="white" className="p-3 text-center flex flex-col items-center gap-1.5">
                  <span className="text-blue-500">{icon}</span>
                  <p className="text-xs text-slate-500 leading-tight">{text}</p>
                </GlassCard>
              ))}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={14} style={{ color: 'var(--d-accent)', flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>

            {/* Enquire CTA */}
            <div className="space-y-3 mt-2">
              <button
                onClick={() => setBulkOpen(true)}
                className="d-btn-accent w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 rounded-2xl"
              >
                <Mail size={16} /> Enquire for Bulk Order
              </button>
              <a
                href="tel:+91"
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-2xl border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Phone size={16} /> Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-blue-100">
          <div className="flex gap-0">
            {['description', 'faq'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'description' && (
            <motion.div key="desc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-8">
                <p className="text-slate-600 leading-relaxed">
                  {product.description || product.shortDescription || 'Premium quality dairy product sourced from trusted farms.'}
                </p>
                {product.details && (
                  <div className="space-y-2">
                    {Object.entries(product.details ?? {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-blue-50 text-sm">
                        <span className="text-slate-400">{k}</span>
                        <span className="font-medium text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3 max-w-2xl">
              {FAQ.map(({ q, a }, i) => (
                <GlassCard key={i} variant="white" className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-slate-800 text-sm">{q}</span>
                    {openFaq === i
                      ? <ChevronUp size={16} className="text-blue-500 shrink-0" />
                      : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BulkOrderModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  );
}
