import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/apiClient';
import API from '@/constants/api';
import { Tag, Zap, Gift } from 'lucide-react';

const MOCK_OFFERS = [
  { id:1, offer_name:'Flat ₹50 OFF', offer_type:'fixed',      discount_value:50,  offer_code:'DAIRY50', description:'On orders above ₹500',     icon:'💰', featured:true },
  { id:2, offer_name:'10% Discount', offer_type:'percentage', discount_value:10,  offer_code:'FRESH10', description:'On all Ghee products',      icon:'🍯', featured:false },
  { id:3, offer_name:'Buy 2 Get 1',  offer_type:'bogo',       discount_value:0,   offer_code:'BOGO',    description:'On selected Paneer packs',  icon:'🧀', featured:false },
  { id:4, offer_name:'₹30 OFF Milk', offer_type:'fixed',      discount_value:30,  offer_code:'MILK30',  description:'Monthly subscription',      icon:'🥛', featured:false },
];

const TYPE_CONFIG = {
  percentage: { icon: Tag,  labelFn: v => `${v}% OFF`, bg:'#E0F8FF', border:'#A5EDFD', text:'#168AC7' },
  fixed:      { icon: Zap,  labelFn: v => `₹${v} OFF`, bg:'#EEF7D8', border:'#C5E89F', text:'#6A9A2A' },
  bogo:       { icon: Gift, labelFn: ()=> 'BUY 2 GET 1',bg:'#FFF7ED', border:'#FED7AA', text:'#C2410C' },
  category:   { icon: Tag,  labelFn: v => `${v}% OFF`, bg:'#E0F8FF', border:'#A5EDFD', text:'#168AC7' },
};

function OfferCard({ offer, index }) {
  const cfg = TYPE_CONFIG[offer.offer_type] ?? TYPE_CONFIG.fixed;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        background: '#FFFFFF',
        border:     `1.5px solid ${offer.featured ? '#A5EDFD' : 'var(--d-border-lt)'}`,
        boxShadow:  offer.featured ? '0 0 0 3px rgba(23,192,242,0.10), var(--d-shadow)' : 'var(--d-shadow-sm)',
      }}
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ delay: index*0.09, duration:0.4 }}
      whileHover={{ y:-4, boxShadow:'var(--d-shadow-lg)', transition:{ duration:0.2 } }}
    >
      {offer.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background:'var(--d-gradient-accent)' }} />
      )}

      <div className="p-5 sm:p-6">
        <div className="text-3xl sm:text-4xl mb-4">{offer.icon ?? '🎁'}</div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
          style={{ background: cfg.bg, color: cfg.text, border:`1px solid ${cfg.border}` }}>
          <cfg.icon size={12} />
          {cfg.labelFn(offer.discount_value)}
        </div>

        <h3 className="font-display text-lg font-semibold mb-1" style={{ color:'var(--d-text)' }}>
          {offer.offer_name}
        </h3>
        <p className="text-sm mb-4" style={{ color:'var(--d-text-2)' }}>
          {offer.description ?? offer.offer_name}
        </p>

        {offer.offer_code && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color:'var(--d-muted)' }}>Code:</span>
            <code className="text-xs font-bold px-2.5 py-1 rounded-lg tracking-widest"
              style={{ background:'var(--d-input)', color:'var(--d-accent)', border:'1px dashed var(--d-border)' }}>
              {offer.offer_code}
            </code>
          </div>
        )}

        {/* Shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ background:'var(--d-gradient-shine)' }} />
      </div>
    </motion.div>
  );
}

export default function OfferSection({ onBulkOrder }) {
  const { data, isLoading } = useQuery({
    queryKey: ['public-offers'],
    queryFn:  () => apiGet(API.ADMIN.OFFERS.LIST, { is_active:true, is_public:true })
                    .then(r => r.data?.data ?? MOCK_OFFERS),
    staleTime: 300_000,
  });

  const offers = data ?? (isLoading ? [] : MOCK_OFFERS);

  return (
    <section className="py-16 sm:py-20" style={{ background:'var(--d-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10 sm:mb-12"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="d-section-tag">🏷️ Exclusive Offers</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ color:'var(--d-text)' }}>
            Premium Dairy <span style={{ color:'var(--d-accent)' }}>Deals</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color:'var(--d-text-2)' }}>
            Special pricing for valued customers and bulk buyers
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({length:4}).map((_,i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background:'var(--d-input)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {offers.slice(0,8).map((offer,i) => <OfferCard key={offer.id} offer={offer} index={i} />)}
          </div>
        )}

        <motion.div className="mt-10 text-center"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <button onClick={onBulkOrder} className="d-btn-accent text-base px-10 py-3.5">
            Get Bulk Order Pricing
          </button>
        </motion.div>
      </div>
    </section>
  );
}
