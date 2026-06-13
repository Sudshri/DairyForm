import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Scale, Info, Check } from 'lucide-react';
import { useState } from 'react';

const BENEFITS  = {
  Milk:   ['Rich in Calcium & Vitamins','No Preservatives','Pasteurized & Safe','Farm Fresh Daily'],
  Ghee:   ['A2 Beta-Casein Protein','Rich in Healthy Fats','Traditional Bilona Method','Improves Digestion'],
  Paneer: ['High Protein Content','Soft & Fresh Texture','No Artificial Colors','Full Cream Milk'],
  Butter: ['Pure Cream Butter','No Trans Fats','Rich Natural Taste','Ideal for Cooking'],
  default:['100% Natural','No Preservatives','Farm to Table','Quality Tested'],
};
const NUTRITION = {
  Milk:   [['Fat','3.5g'],['Protein','3.2g'],['Carbs','4.8g'],['Calcium','120mg']],
  Ghee:   [['Fat','99.7g'],['Cal','900kcal'],['Vit A','270IU'],['Omega-3','0.4g']],
  Paneer: [['Protein','18g'],['Fat','20g'],['Calcium','480mg'],['Carbs','1.2g']],
  default:[['Calories','—'],['Protein','—'],['Fat','—'],['Carbs','—']],
};
const EMOJI = { Milk:'🥛', Ghee:'🍯', Paneer:'🧀', Butter:'🧈', Dahi:'🥣', Khoya:'🍮' };

export default function ProductModal({ product, open, onClose, onBulkOrder }) {
  const [sel, setSel] = useState(0);
  if (!product) return null;

  const variants  = product.variants ?? [];
  const variant   = variants[sel] ?? null;
  const cat       = product.category?.name ?? '';
  const benefits  = BENEFITS[cat]  ?? BENEFITS.default;
  const nutrition = NUTRITION[cat] ?? NUTRITION.default;
  const activeOffer = variant?.active_offers?.[0]?.offer ?? null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <motion.div
    className="w-full max-w-3xl rounded-2xl overflow-hidden"
    style={{
      background:'#FFFFFF',
      border:'1px solid var(--d-border-lt)',
      boxShadow:'0 24px 80px rgba(23,192,242,0.18)',
      maxHeight:'90vh'
    }}
    initial={{ opacity:0, scale:0.88 }}
    animate={{ opacity:1, scale:1 }}
    exit={{ opacity:0, scale:0.93 }}
    transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
  >
            <button onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'var(--d-input)', color:'var(--d-muted)', border:'1px solid var(--d-border-lt)' }}>
              <X size={16} />
            </button>

            <div className="flex flex-col md:flex-row overflow-y-auto" style={{ maxHeight:'90vh' }}>
              {/* Left image */}
              <div className="md:w-2/5 shrink-0 relative min-h-[240px] md:min-h-[420px]"
                style={{ background:'linear-gradient(135deg,#E0F8FF,#EEF7D8)' }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl" style={{ filter:'drop-shadow(0 4px 20px rgba(23,192,242,0.30))' }}>
                      {EMOJI[cat] ?? '🥛'}
                    </span>
                  </div>
                )}
              </div>

              {/* Right details */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:'var(--d-accent)' }}>{cat}</p>
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color:'var(--d-text)' }}>
                  {product.product_name}
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color:'var(--d-text-2)' }}>
                  {product.short_description}
                </p>

                {/* Variants */}
                {variants.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'var(--d-muted)' }}>
                      <Scale size={11} className="inline mr-1" />Available Sizes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v, i) => {
                        const vOffer  = v.active_offers?.[0]?.offer;
                        const isSel   = i === sel;
                        return (
                          <button key={v.id} onClick={() => setSel(i)}
                            className="px-3 py-2 rounded-xl text-sm font-medium transition-all relative"
                            style={{
                              background: isSel ? 'var(--d-accent-lt)' : 'var(--d-input)',
                              border:     `1.5px solid ${isSel ? 'var(--d-accent)' : 'var(--d-border-lt)'}`,
                              color:      isSel ? 'var(--d-accent)' : 'var(--d-text-2)',
                            }}>
                            <span className="font-semibold">{v.variant_name}</span>
                            <span className="ml-2 text-xs">₹{v.selling_price}</span>
                            {v.mrp_price > v.selling_price && (
                              <span className="ml-1 text-xs line-through opacity-50">₹{v.mrp_price}</span>
                            )}
                            {vOffer && (
                              <span className="absolute -top-1.5 -right-1.5 text-2xs px-1.5 py-0.5 rounded-full font-bold"
                                style={{ background:'var(--d-accent)', color:'#fff' }}>
                                {vOffer.offer_type==='percentage' ? `${vOffer.discount_value}%` : `₹${vOffer.discount_value}`} OFF
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {variant && (
                      <div className="flex items-center gap-3 mt-4">
                        <span className="font-display text-3xl font-bold" style={{ color:'var(--d-accent)' }}>
                          ₹{variant.selling_price}
                        </span>
                        {variant.mrp_price > variant.selling_price && (
                          <span className="text-lg line-through" style={{ color:'var(--d-muted)' }}>₹{variant.mrp_price}</span>
                        )}
                        {activeOffer && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background:'var(--d-accent-lt)', color:'var(--d-accent-dk)', border:'1px solid rgba(23,192,242,0.22)' }}>
                            <Tag size={10} />{activeOffer.offer_name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="d-divider my-4" />

                {/* Benefits */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'var(--d-muted)' }}>
                    <Info size={11} className="inline mr-1" />Product Benefits
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {benefits.map(b => (
                      <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color:'var(--d-text-2)' }}>
                        <Check size={12} style={{ color:'var(--d-accent)', flexShrink:0 }} />{b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {nutrition.map(([label, value]) => (
                    <div key={label} className="text-center p-2 rounded-xl"
                      style={{ background:'var(--d-input)', border:'1px solid var(--d-border-lt)' }}>
                      <p className="font-bold text-xs" style={{ color:'var(--d-accent)' }}>{value}</p>
                      <p className="text-2xs mt-0.5" style={{ color:'var(--d-muted)' }}>{label}</p>
                    </div>
                  ))}
                </div>

                <button onClick={onBulkOrder} className="d-btn-accent w-full py-3 text-sm">
                  Enquire for Bulk Order
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
