/**
 * Home — Dairy Product Showcase + Inquiry Platform
 * All e-commerce features (cart, wishlist, checkout) are removed.
 * Focus: product discovery, bulk orders, partner inquiries, brand trust.
 */
import { useState, lazy, Suspense } from 'react';
import BulkOrderModal  from '@/components/modals/BulkOrderModal';
import PartnerModal    from '@/components/modals/PartnerModal';

// Section components (lazy for performance)
const HeroSlider         = lazy(() => import('@/components/sections/HeroSlider'));
const TrustBadges        = lazy(() => import('@/components/sections/TrustBadges'));
const OfferSection       = lazy(() => import('@/components/sections/OfferSection'));
const ProductsSection    = lazy(() => import('@/components/sections/ProductsSection'));
const WhyChooseUs        = lazy(() => import('@/components/sections/WhyChooseUs'));
const AboutSection       = lazy(() => import('@/components/sections/AboutSection'));
const EventsSection      = lazy(() => import('@/components/sections/EventsSection'));
const QualitySection     = lazy(() => import('@/components/sections/QualitySection'));
const TestimonialsSection= lazy(() => import('@/components/sections/TestimonialsSection'));
const ContactSection     = lazy(() => import('@/components/sections/ContactSection'));

// Section skeleton placeholder
const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center" style={{ background: 'var(--d-bg)' }}>
    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: 'var(--d-accent)', borderTopColor: 'transparent' }} />
  </div>
);

export default function Home() {
  const [bulkOpen,    setBulkOpen]    = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  const openBulk    = () => setBulkOpen(true);
  const openPartner = () => setPartnerOpen(true);

  return (
    <div className="showcase-page">

      {/* ── 1. HERO SLIDER ─────────────────────────────────────────── */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--d-bg)' }}>
          <div className="text-7xl animate-float">🥛</div>
        </div>
      }>
        <HeroSlider onBulkOrder={openBulk} onPartner={openPartner} />
      </Suspense>

      {/* ── 2. TRUST BADGES ───────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <TrustBadges />
      </Suspense>

      {/* ── 3. WHY CHOOSE US ───────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUs />
      </Suspense>

      {/* ── 3. OFFER SECTION ───────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <OfferSection onBulkOrder={openBulk} />
      </Suspense>

      {/* ── 4. PRODUCTS SECTION ────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <ProductsSection onBulkOrder={openBulk} />
      </Suspense>

      {/* ── 5. ABOUT US ────────────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
      </Suspense>

      {/* ── 6. EVENTS / BULK ORDER CTA ─────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <EventsSection onBulkOrder={openBulk} />
      </Suspense>

      {/* ── 7. QUALITY STORY ───────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <QualitySection />
      </Suspense>

      {/* ── 8. TESTIMONIALS ────────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      {/* ── 9. CONTACT ─────────────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>

      {/* ── Global Modals ─────────────────────────────────────────── */}
      <BulkOrderModal open={bulkOpen}    onClose={() => setBulkOpen(false)} />
      <PartnerModal   open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </div>
  );
}
