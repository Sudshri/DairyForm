import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Receipt, Leaf, Users, Award, Milk, Heart, MapPin, Mail, Phone, Star } from 'lucide-react';
import { FloatingBlob } from '@/components/ui/MilkWave';
import section1 from '@/assets/section1.png';
import section2 from '@/assets/section2.png';
import section3 from '@/assets/section3.png';

const STATS = [
  { value: '15+',   label: 'Active Products',    color: '#17C0F2' },
  { value: '100%',  label: 'Natural Ingredients', color: '#8BC63E' },
  { value: '10+',   label: 'Years Experience',    color: '#D97706' },
  { value: '500+',  label: 'Happy Customers',     color: '#7C3AED' },
];

const VALUES = [
  { Icon: Leaf,   title: 'Farm to Table',    desc: 'We source directly from trusted local farms in Rajasthan, ensuring the shortest possible chain from cow to customer.',         color: '#8BC63E', bg: '#EEF7D8' },
  { Icon: ShieldCheck, title: 'Purity Guaranteed', desc: 'Every batch is tested for quality and purity. FSSAI certified and GST compliant — your trust is our highest credential.', color: '#17C0F2', bg: '#E0F8FF' },
  { Icon: Heart,  title: 'Community First',  desc: 'We support local farmers and promote sustainable dairy practices that benefit the entire community and ecosystem.',              color: '#EF4444', bg: '#FEF2F2' },
  { Icon: Award,  title: 'Premium Quality',  desc: 'From traditional ghee made with the bilona method to fresh A2 milk — every product upholds the highest quality standards.',    color: '#D97706', bg: '#FFFBEB' },
];

const TEAM = [
  { name: 'Shyam Dairy Udyog', role: 'Founding Entity', desc: 'Established by passionate dairy farmers of Rajasthan, built on generations of expertise.' },
];

const COMPLIANCE = [
  { Icon: ShieldCheck, label: 'FSSAI License No.',      value: '12225039000413',    desc: 'Food Safety & Standards Authority of India',         color: '#17C0F2', bg: '#E0F8FF' },
  { Icon: Receipt,     label: 'GST Registration No.',   value: '08AIYPH7023E1Z2',   desc: 'Goods & Services Tax – Rajasthan (State Code 08)',    color: '#8BC63E', bg: '#EEF7D8' },
  { Icon: Building2,   label: 'UDYAM Registration',     value: 'UDYAM-RJ-30-0003396', desc: 'Ministry of MSME – Micro Enterprise Certificate',   color: '#D97706', bg: '#FFFBEB' },
];

const MILESTONES = [
  { year: '2010', event: 'Founded', detail: 'SHYAM DAIRY UDYOG established in Palsana, Sikar with a vision to deliver pure dairy to Rajasthan.' },
  { year: '2015', event: 'FSSAI Certified', detail: 'Received FSSAI license, formalising our commitment to food safety and quality standards.' },
  { year: '2018', event: 'UDYAM Registered', detail: 'Registered as a Micro Enterprise under the Ministry of MSME, supporting local employment.' },
  { year: '2022', event: 'EverFresh Brand', detail: 'Launched the EverFresh brand to reach customers across Rajasthan with premium dairy products.' },
  { year: '2024', event: 'Digital Expansion', detail: 'Launched online catalogue and bulk order system to serve businesses and institutions.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
      <FloatingBlob color="#BAE6FD" size={500} opacity={0.15} className="top-10 -right-40" />
      <FloatingBlob color="#EEF7D8" size={400} opacity={0.2}  className="bottom-40 -left-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: '#E0F8FF', color: '#17C0F2' }}>
            About EverFresh
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-5 leading-tight">
            Purity Is Our <span style={{ color: '#17C0F2' }}>Priority</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            EverFresh is the retail brand of <strong className="text-slate-700">SHYAM DAIRY UDYOG</strong>, a Rajasthan-based
            dairy enterprise delivering farm-fresh, chemical-free dairy products since 2010.
          </p>
        </motion.div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STATS.map(({ value, label, color }, i) => (
            <motion.div
              key={label}
              className="text-center p-6 rounded-2xl bg-white"
              style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            >
              <p className="font-display text-4xl font-bold mb-1" style={{ color }}>{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Our Story ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{ background: '#EEF7D8', color: '#8BC63E' }}>Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              Born in the Heart of Rajasthan
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                SHYAM DAIRY UDYOG was founded in Palsana, Sikar by a family of dairy farmers who believed that
                every Indian deserves access to <strong>pure, unadulterated dairy</strong> — the kind that comes
                straight from well-cared-for cows grazing on open, clean pastures.
              </p>
              <p>
                Over more than a decade, we have built a trusted network of local farmers and a quality-tested
                supply chain that keeps products fresh from farm to your doorstep. Every batch of milk, ghee,
                paneer, and butter carries our personal guarantee of purity.
              </p>
              <p>
                Today, under the <strong>EverFresh</strong> brand, we serve hundreds of households and businesses
                across Rajasthan — and we're just getting started.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="rounded-3xl overflow-hidden aspect-[4/3]"
            style={{ boxShadow: '0 12px 48px rgba(23,192,242,0.15)' }}
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <img src={section1} alt="EverFresh farm" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* ── Values ───────────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{ background: '#E0F8FF', color: '#17C0F2' }}>What We Stand For</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                className="p-6 rounded-2xl bg-white"
                style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Products visual ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            className="rounded-3xl overflow-hidden aspect-[4/3] order-2 lg:order-1"
            style={{ boxShadow: '0 12px 48px rgba(139,198,62,0.15)' }}
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <img src={section2} alt="EverFresh products" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{ background: '#EEF7D8', color: '#8BC63E' }}>Our Range</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              Fresh Dairy, Every Single Day
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              From A2 full cream milk and traditional bilona ghee to soft fresh paneer, creamy butter, and
              probiotic dahi — our product range covers the full spectrum of dairy needs for homes, restaurants,
              and institutions.
            </p>
            <ul className="space-y-2">
              {['A2 Full Cream Milk & Toned Milk','Pure Cow Ghee (Bilona Method)','Fresh Paneer & Butter','Probiotic Dahi & Khoya','Ice Cream & Frozen Desserts'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <ShieldCheck size={15} style={{ color: '#17C0F2', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Milestones ───────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{ background: '#FFFBEB', color: '#D97706' }}>Our Journey</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-100 hidden sm:block" />
            <div className="space-y-6">
              {MILESTONES.map(({ year, event, detail }, i) => (
                <motion.div
                  key={year}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center text-xs font-bold z-10 hidden sm:flex"
                    style={{ borderColor: '#17C0F2', color: '#17C0F2' }}>
                    {year}
                  </div>
                  <div className="flex-1 p-5 rounded-2xl bg-white"
                    style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 sm:hidden" style={{ color: '#17C0F2' }}>{year}</p>
                    <p className="font-bold text-slate-800 mb-1">{event}</p>
                    <p className="text-sm text-slate-500">{detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quality visual ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{ background: '#E0F8FF', color: '#17C0F2' }}>Quality Assurance</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              Quality You Can See, Taste, and Trust
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our quality assurance process begins at the farm and ends at your doorstep. We follow strict hygiene
              protocols, HTST pasteurisation for milk, and traditional processing methods for ghee and paneer.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Every batch is checked for fat content, SNF, and microbiological safety before dispatch. We are
              FSSAI licensed and operate under the regulations of the Food Safety and Standards Authority of India.
            </p>
          </motion.div>
          <motion.div
            className="rounded-3xl overflow-hidden aspect-[4/3]"
            style={{ boxShadow: '0 12px 48px rgba(23,192,242,0.12)' }}
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <img src={section3} alt="EverFresh quality" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* ── Compliance / Licenses ────────────────────────────────── */}
        <motion.div
          className="rounded-3xl p-8 sm:p-10 mb-14"
          style={{ background: 'linear-gradient(135deg,#F0F9FF,#EEF7D8)', border: '1.5px solid #DDEAF5' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{ background: '#FFFFFF', color: '#17C0F2', border: '1px solid #DDEAF5' }}>
              Verified &amp; Compliant
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Certifications &amp; Registrations</h2>
            <p className="text-slate-500 text-sm">All credentials are active and up to date.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {COMPLIANCE.map(({ Icon, label, value, desc, color, bg }) => (
              <div key={label}
                className="bg-white rounded-2xl p-6 flex flex-col items-center text-center"
                style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: bg }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className="font-display text-lg font-bold mb-1" style={{ color }}>{value}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Contact CTA ──────────────────────────────────────────── */}
        <motion.div
          className="rounded-3xl p-8 sm:p-12 text-center"
          style={{ background: 'linear-gradient(135deg,#17C0F2,#168AC7)', boxShadow: '0 12px 48px rgba(23,192,242,0.3)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready to Order?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Contact us for bulk orders, wholesale pricing, or any questions about our products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:contact@everfresh.org.in"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm bg-white transition-all hover:-translate-y-0.5"
              style={{ color: '#17C0F2', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
            >
              <Mail size={16} /> contact@everfresh.org.in
            </a>
            <a
              href="/contact"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm border-2 border-white text-white transition-all hover:bg-white hover:text-blue-500"
            >
              Get In Touch
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-blue-100 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> SHYAM DAIRY UDYOG, Palsana, Sikar, Rajasthan</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
