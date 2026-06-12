import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Handshake, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { apiPost } from '@/services/apiClient';

const schema = z.object({
  full_name:     z.string().min(2,'Name required'),
  mobile:        z.string().regex(/^[6-9]\d{9}$/,'Enter valid 10-digit mobile'),
  email:         z.string().email('Enter valid email'),
  business_name: z.string().min(2,'Business name required'),
  address:       z.string().min(10,'Enter complete address'),
  message:       z.string().min(20,'Tell us more (min 20 chars)'),
});

export default function PartnerModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState:{ errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await apiPost('/partner-inquiries', data).catch(() => {});
    setSubmitted(true); reset();
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };

  const Label = ({ children }) => (
    <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>{children}</label>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} />
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <motion.div
    className="w-full max-w-lg"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.25 }}
  >
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'0 24px 60px rgba(37,99,235,0.16)' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b" style={{ borderColor:'var(--d-border-lt)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'var(--d-accent-lt)' }}>
                    <Handshake size={20} style={{ color:'var(--d-accent)' }} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold" style={{ color:'var(--d-text)' }}>Become A Partner</h2>
                    <p className="text-xs" style={{ color:'var(--d-muted)' }}>Join our growing dairy network</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background:'var(--d-input)', color:'var(--d-muted)' }}><X size={16} /></button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto">
                {submitted ? (
                  <motion.div className="flex flex-col items-center py-10 gap-4"
                    initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}>
                    <CheckCircle size={52} style={{ color:'var(--d-accent)' }} />
                    <h3 className="font-display text-xl" style={{ color:'var(--d-text)' }}>Application Received!</h3>
                    <p className="text-sm text-center" style={{ color:'var(--d-muted)' }}>Our partnership team will reach out to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name *</Label>
                        <input className="d-input" placeholder="Your name" {...register('full_name')} />
                        {errors.full_name && <p className="text-xs mt-1 text-red-500">{errors.full_name.message}</p>}
                      </div>
                      <div>
                        <Label>Mobile Number *</Label>
                        <input className="d-input" placeholder="10-digit number" {...register('mobile')} />
                        {errors.mobile && <p className="text-xs mt-1 text-red-500">{errors.mobile.message}</p>}
                      </div>
                      <div>
                        <Label>Email Address *</Label>
                        <input type="email" className="d-input" placeholder="you@business.com" {...register('email')} />
                        {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
                      </div>
                      <div>
                        <Label>Business Name *</Label>
                        <input className="d-input" placeholder="Your business" {...register('business_name')} />
                        {errors.business_name && <p className="text-xs mt-1 text-red-500">{errors.business_name.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Business Address *</Label>
                      <textarea rows={2} className="d-input resize-none" placeholder="Full business address" {...register('address')} />
                      {errors.address && <p className="text-xs mt-1 text-red-500">{errors.address.message}</p>}
                    </div>
                    <div>
                      <Label>Message *</Label>
                      <textarea rows={3} className="d-input resize-none"
                        placeholder="Tell us about your business, how you'd like to partner, expected volumes..."
                        {...register('message')} />
                      {errors.message && <p className="text-xs mt-1 text-red-500">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="d-btn-accent w-full py-3 text-sm">
                      {isSubmitting ? 'Sending…' : 'Submit Partnership Application'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
