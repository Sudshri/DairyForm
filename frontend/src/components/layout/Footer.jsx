import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

const QUICK_LINKS  = [
  { to:'/',            label:'Home' },
  { to:'/products',    label:'Products' },
  { to:'/categories',  label:'Categories' },
  { to:'/#about',      label:'About Us' },
  { to:'/#contact',    label:'Contact Us' },
];
const CATEGORIES = [
  { to:'/categories/milk',   label:'Fresh Milk' },
  { to:'/categories/ghee',   label:'Pure Ghee' },
  { to:'/categories/paneer', label:'Fresh Paneer' },
  { to:'/categories/butter', label:'Butter' },
  { to:'/categories/curd',   label:'Curd & Dahi' },
  { to:'/categories/khoya',  label:'Khoya & Mawa' },
];
const SOCIALS = [
  { icon: Facebook,  href:'#', label:'Facebook'  },
  { icon: Instagram, href:'#', label:'Instagram' },
  { icon: Twitter,   href:'#', label:'Twitter'   },
  { icon: Youtube,   href:'#', label:'YouTube'   },
];

export default function Footer() {
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true); setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const linkStyle = { color:'var(--d-text-2)', fontSize:'0.875rem', transition:'color 0.2s' };

  return (
    <footer style={{ background:'var(--d-bg)', borderTop:'1px solid var(--d-border-lt)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="mb-5">
              <img
                src={logo}
                alt="EverFresh"
                className="h-20 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' }}
              />
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color:'var(--d-text-2)' }}>
              Delivering purest farm-fresh dairy directly to your home since 2010.
              Trusted by thousands of families and businesses.
            </p>
            <div className="space-y-2 mb-5">
              {[
                {Icon:Phone,  text:'+91 12345 67890'},
                {Icon:Mail,   text:'contact@everfresh.org.in'},
                {Icon:MapPin, text:'SHYAM DAIRY UDYOG, Prop – Harveer'},
              ].map(({Icon,text})=>(
                <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color:'var(--d-text-2)' }}>
                  <Icon size={13} style={{ color:'var(--d-accent)', flexShrink:0 }} />{text}
                </div>
              ))}
              <div className="flex items-start gap-2.5 text-sm" style={{ color:'var(--d-text-2)' }}>
                <MapPin size={13} className="mt-0.5 shrink-0" style={{ color:'transparent' }} />
                <span className="text-xs leading-relaxed" style={{ color:'var(--d-text-2)' }}>
                  Plot No. D-109, Shyam Industries,<br />
                  NH-52, RIICO Industrial Area, Palsana,<br />
                  Sikar, Rajasthan – 332402
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white transition-all"
                  style={{ border:'1.5px solid var(--d-border-lt)', color:'var(--d-text-2)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--d-accent)'; e.currentTarget.style.color='var(--d-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--d-border-lt)'; e.currentTarget.style.color='var(--d-text-2)'; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color:'var(--d-accent)' }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={linkStyle}
                    onMouseEnter={e => e.currentTarget.style.color='var(--d-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--d-text-2)'}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color:'var(--d-accent)' }}>Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={linkStyle}
                    onMouseEnter={e => e.currentTarget.style.color='var(--d-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--d-text-2)'}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color:'var(--d-accent)' }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color:'var(--d-text-2)' }}>
              Get updates on new products, offers and farm news.
            </p>
            {subscribed ? (
              <p className="text-sm font-semibold" style={{ color:'var(--d-accent)' }}>✓ Subscribed! Thank you.</p>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="d-input flex-1 text-xs" style={{ padding:'0.5rem 0.75rem' }} />
                <button type="submit"
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'var(--d-gradient-accent)', color:'#fff' }}>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Compliance strip */}
        <div className="mt-10 sm:mt-12 pt-6 flex flex-wrap gap-x-6 gap-y-2 items-center"
          style={{ borderTop:'1px solid var(--d-border-lt)' }}>
          <p className="text-xs font-bold uppercase tracking-widest w-full sm:w-auto" style={{ color:'var(--d-muted)' }}>Legal &amp; Compliance</p>
          {[
            { label:'UDYAM Registered MSME', value:'UDYAM-RJ-30-0003396' },
            { label:'GST Registered',        value:'08AIYPH7023E1Z2' },
            { label:'FSSAI Licensed',        value:'12225039000413' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color:'var(--d-muted)' }}>
              <span style={{ color:'var(--d-accent)' }}>✓</span>
              <span>{label}:</span>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop:'1px solid var(--d-border-lt)' }}>
          <p className="text-xs" style={{ color:'var(--d-muted)' }}>© {new Date().getFullYear()} DairyForm. All rights reserved.</p>
          <p className="text-xs" style={{ color:'var(--d-muted)' }}>Made with ❤️ for fresh dairy lovers</p>
        </div>
      </div>
    </footer>
  );
}
