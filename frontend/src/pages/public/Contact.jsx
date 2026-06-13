import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Building2, ShieldCheck, Receipt } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { FloatingBlob } from '@/components/ui/MilkWave';
import { apiPost } from '@/services/apiClient';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    bg: '#E0F8FF',
    color: '#17C0F2',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'contact@everfresh.org.in',
    href: 'mailto:contact@everfresh.org.in',
    bg: '#EEF7D8',
    color: '#8BC63E',
  },
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'Palsana, Sikar, Rajasthan – 332001',
    href: 'https://maps.google.com/?q=Palsana,Sikar,Rajasthan',
    bg: '#FFFBEB',
    color: '#D97706',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon – Sat, 7 AM – 8 PM',
    href: '#',
    bg: '#F5F3FF',
    color: '#7C3AED',
  },
];

const COMPLIANCE = [
  { Icon: ShieldCheck, label: 'FSSAI License',    value: '12225039000413',    color: '#17C0F2', bg: '#E0F8FF' },
  { Icon: Receipt,     label: 'GST Number',       value: '08AIYPH7023E1Z2',   color: '#8BC63E', bg: '#EEF7D8' },
  { Icon: Building2,   label: 'UDYAM Registration', value: 'UDYAM-RJ-30-0003396', color: '#D97706', bg: '#FFFBEB' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try { await apiPost('/contact', data); } catch (_) {}
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
      <FloatingBlob color="#BAE6FD" size={400} opacity={0.22} className="top-20 -right-40" />
      <FloatingBlob color="#FDE8C8" size={300} opacity={0.2}  className="bottom-20 -left-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeader
          tag="Contact Us"
          title="Get In Touch"
          subtitle="Have a question or want to place a bulk order? We're here to help."
          className="mb-14"
        />

        <div className="grid lg:grid-cols-5 gap-10 mb-14">
          {/* Left – contact info */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href, bg, color }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white block"
                style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ boxShadow: `0 4px 20px ${color}22`, borderColor: color, transition: { duration: 0.2 } }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="font-semibold text-slate-800 text-sm">{value}</p>
                </div>
              </motion.a>
            ))}

            {/* Map / address card */}
            <motion.div
              className="rounded-2xl overflow-hidden bg-white"
              style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
              <div className="h-40 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#E0F8FF,#EEF7D8)' }}>
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2" style={{ color: '#17C0F2' }} />
                  <p className="font-bold text-sm text-slate-800">SHYAM DAIRY UDYOG</p>
                  <p className="text-xs text-slate-500 mt-1">Palsana, Sikar, Rajasthan</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Village Palsana, Near Main Market, Sikar District,<br />
                  Rajasthan – 332 001, India
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right – form */}
          <motion.div
            className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-white"
            style={{ border: '1.5px solid #E8EFF5', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          >
            {sent ? (
              <motion.div
                className="flex flex-col items-center py-12 gap-4"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={56} style={{ color: '#8BC63E' }} />
                <h3 className="font-display text-2xl text-slate-800">Message Sent!</h3>
                <p className="text-sm text-slate-500 text-center">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-2 text-blue-500 hover:underline text-sm">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="font-display text-2xl text-slate-800 mb-5">Send a Message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Your Name *</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      style={{ borderColor: '#DDEAF5', background: '#F8FAFF' }}
                      placeholder="Ramesh Kumar"
                      {...register('name', { required: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Mobile Number</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      style={{ borderColor: '#DDEAF5', background: '#F8FAFF' }}
                      placeholder="+91 98765 43210"
                      {...register('mobile')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    style={{ borderColor: '#DDEAF5', background: '#F8FAFF' }}
                    placeholder="you@example.com"
                    {...register('email')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject *</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    style={{ borderColor: '#DDEAF5', background: '#F8FAFF' }}
                    placeholder="Bulk order enquiry / Product question…"
                    {...register('subject', { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                    style={{ borderColor: '#DDEAF5', background: '#F8FAFF' }}
                    placeholder="Write your message here…"
                    {...register('message', { required: true })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#17C0F2,#168AC7)' }}
                >
                  <Send size={15} />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Compliance strip */}
        <motion.div
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: 'linear-gradient(135deg,#F8FBFF,#EEF7D8)', border: '1.5px solid #DDEAF5' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Legal &amp; Compliance
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {COMPLIANCE.map(({ Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-3 bg-white rounded-xl p-4"
                style={{ border: '1px solid #E8EFF5' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xs text-slate-400 uppercase tracking-wide font-semibold">{label}</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
