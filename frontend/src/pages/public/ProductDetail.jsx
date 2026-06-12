import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Shield, Truck, RefreshCw, Star, ChevronDown, ChevronUp } from 'lucide-react';
import QuantitySelector from '@/components/ui/QuantitySelector';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/formatters';

const MOCK_PRODUCT = {
  id: 1,
  name: 'Farm Fresh Full Cream Milk A2',
  category: 'Milk',
  price: 65,
  originalPrice: 75,
  unit: 'litre',
  rating: 4.8,
  reviews: 124,
  stock: 48,
  isNew: true,
  description: `Our premium A2 full cream milk comes straight from our network of certified organic farms.
    Each cow is pasture-fed and cared for with the highest ethical standards.
    Rich in calcium, protein and natural vitamins — the way milk was meant to be.`,
  details: [
    ['Fat Content', '6.0%'],
    ['SNF', '9.0%'],
    ['Protein', '3.5%'],
    ['Source', 'Gir Cow (A2 Beta-Casein)'],
    ['Pasteurization', 'HTST Pasteurized'],
    ['Shelf Life', '24 hours (refrigerated)'],
  ],
  images: [null, null, null],
  variants: [
    { label: '500 ml', price: 35 },
    { label: '1 Litre', price: 65, default: true },
    { label: '2 Litres', price: 125 },
  ],
};

const REVIEWS = [
  { name:'Priya S.', rating:5, date:'2 days ago',  comment:'Absolutely the freshest milk I have had!' },
  { name:'Arjun M.', rating:5, date:'1 week ago',  comment:'A2 quality is noticeable. Kids love it!' },
  { name:'Meena K.', rating:4, date:'2 weeks ago', comment:'Great product. Delivery could be a bit earlier.' },
];

const FAQ = [
  { q: 'How fresh is the milk?',           a: 'Milk is sourced the same morning and delivered within 4 hours of milking.' },
  { q: 'What is A2 milk?',                  a: 'A2 milk contains only the A2 beta-casein protein, naturally from Gir cows. Easier to digest than regular milk.' },
  { q: 'How should I store it?',            a: 'Refrigerate immediately upon delivery. Best consumed within 24 hours.' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [qty,       setQty]      = useState(1);
  const [liked,     setLiked]    = useState(false);
  const [selImg,    setSelImg]   = useState(0);
  const [selVar,    setSelVar]   = useState(MOCK_PRODUCT.variants.findIndex((v) => v.default));
  const [openFaq,   setOpenFaq]  = useState(null);
  const [tab,       setTab]      = useState('description');
  const addItem = useCartStore((s) => s.addItem);

  const variant = MOCK_PRODUCT.variants[selVar];
  const price   = variant?.price ?? MOCK_PRODUCT.price;

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* ── Image gallery ─────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-4xl overflow-hidden bg-gradient-to-br from-blue-50 to-cream-100 flex items-center justify-center shadow-soft-lg">
              <FloatingBlob color="#BAE6FD" size={200} opacity={0.3} className="top-0 right-0" />
              <motion.span
                key={selImg}
                className="text-9xl relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                🥛
              </motion.span>
              {MOCK_PRODUCT.isNew && (
                <div className="absolute top-4 left-4"><Badge variant="sky">New</Badge></div>
              )}
            </div>
            <div className="flex gap-3">
              {MOCK_PRODUCT.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelImg(i)}
                  className={`flex-1 aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-cream-100
                    flex items-center justify-center text-3xl transition-all ${
                    selImg === i ? 'ring-2 ring-blue-400 shadow-soft' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  🥛
                </button>
              ))}
            </div>
          </div>

          {/* ── Product info ───────────────────────────── */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm text-blue-500 font-semibold uppercase tracking-wider mb-1">
                {MOCK_PRODUCT.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-slate-900 mb-3 leading-tight">
                {MOCK_PRODUCT.name}
              </h1>
              <div className="flex items-center gap-3">
                <StarRating value={MOCK_PRODUCT.rating} size={16} />
                <span className="text-sm text-slate-500 font-medium">{MOCK_PRODUCT.rating}</span>
                <span className="text-sm text-slate-400">({MOCK_PRODUCT.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-slate-900">
                {formatCurrency(price)}
              </span>
              {MOCK_PRODUCT.originalPrice && (
                <span className="text-slate-400 line-through text-lg mb-1">
                  {formatCurrency(MOCK_PRODUCT.originalPrice)}
                </span>
              )}
              <span className="text-slate-400 mb-1">/ {MOCK_PRODUCT.unit}</span>
            </div>

            {/* Variants */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Size</p>
              <div className="flex gap-2">
                {MOCK_PRODUCT.variants.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => setSelVar(i)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-all ${
                      selVar === i
                        ? 'bg-blue-500 text-white border-blue-500 shadow-soft-md'
                        : 'bg-white text-slate-600 border-blue-100 hover:border-blue-300'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              <QuantitySelector value={qty} min={1} max={MOCK_PRODUCT.stock} onChange={setQty} />
              <Button
                size="lg"
                icon={<ShoppingCart size={18} />}
                className="flex-1"
                onClick={() => addItem({ ...MOCK_PRODUCT, price }, qty)}
              >
                Add to Cart
              </Button>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-12 h-12 rounded-2xl glass flex items-center justify-center
                  transition-colors ${liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} />,      text: 'Free delivery above ₹500' },
                { icon: <Shield size={16} />,     text: '100% pure & tested' },
                { icon: <RefreshCw size={16} />,  text: 'Freshness guarantee' },
              ].map(({ icon, text }) => (
                <GlassCard key={text} variant="white" className="p-3 text-center flex flex-col items-center gap-1.5">
                  <span className="text-blue-500">{icon}</span>
                  <p className="text-xs text-slate-500 leading-tight">{text}</p>
                </GlassCard>
              ))}
            </div>

            {/* Quick details */}
            <div className="grid grid-cols-2 gap-2">
              {MOCK_PRODUCT.details.slice(0, 4).map(([k, v]) => (
                <div key={k} className="bg-blue-50/60 rounded-2xl px-3 py-2">
                  <p className="text-2xs text-slate-400 uppercase tracking-wide">{k}</p>
                  <p className="text-sm font-medium text-slate-700">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="mb-8 border-b border-blue-100">
          <div className="flex gap-0">
            {['description', 'reviews', 'faq'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  tab === t
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'description' && (
            <motion.div key="desc" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <div className="grid md:grid-cols-2 gap-8">
                <p className="text-slate-600 leading-relaxed">{MOCK_PRODUCT.description}</p>
                <div className="space-y-2">
                  {MOCK_PRODUCT.details.map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-blue-50 text-sm">
                      <span className="text-slate-400">{k}</span>
                      <span className="font-medium text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div key="rev" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="space-y-4">
              {REVIEWS.map((r, i) => (
                <GlassCard key={i} variant="white" className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                    <StarRating value={r.rating} size={13} />
                  </div>
                  <p className="text-sm text-slate-600">{r.comment}</p>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {tab === 'faq' && (
            <motion.div key="faq" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="space-y-3 max-w-2xl">
              {FAQ.map(({ q, a }, i) => (
                <GlassCard key={i} variant="white" className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-slate-800 text-sm">{q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-blue-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height:0 }}
                        animate={{ height:'auto' }}
                        exit={{ height:0 }}
                        className="overflow-hidden"
                      >
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
    </div>
  );
}
