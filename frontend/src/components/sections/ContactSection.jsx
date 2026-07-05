import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Send, CheckCircle, Building2, Receipt, ShieldCheck } from 'lucide-react';
import { apiPost } from '@/services/apiClient';

const INFO = [
  { icon: Phone,  label:'Call Us',  value:'+91 8741930226',             href:'tel:+918741930226', bg:'#E0F8FF', color:'#17C0F2' },
  { icon: Mail,   label:'Email Us', value:'contact@everfresh.org.in',    href:'mailto:contact@everfresh.org.in', bg:'#EEF7D8', color:'#8BC63E' },
  { icon: MapPin, label:'Visit Us', value:'Palsana, Sikar, Rajasthan',   href:'#', bg:'#FFFBEB', color:'#D97706' },
];

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState:{ isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await apiPost('/contact', data).catch(() => {});
    setSent(true); reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20" style={{ background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12 sm:mb-14"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="d-section-tag">📞 Contact Us</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ color:'var(--d-text)' }}>
            Get In <span style={{ color:'var(--d-accent)' }}>Touch</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color:'var(--d-text-2)' }}>
            Have a question or want to discuss a bulk order? We're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-4">
            {INFO.map(({ icon: Icon, label, value, href, bg, color }, i) => (
              <motion.a key={label} href={href}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl group block bg-white"
                style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow-sm)' }}
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                whileHover={{ boxShadow:`0 4px 20px ${color}22`, borderColor: color, transition:{ duration:0.2 } }}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: bg }}>
                  <Icon size={19} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color:'var(--d-muted)' }}>{label}</p>
                  <p className="font-medium text-sm" style={{ color:'var(--d-text)' }}>{value}</p>
                </div>
              </motion.a>
            ))}

           
            {/* Map placeholder */}
           <iframe
    title="EverFresh Location"
    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3539.4228437110314!2d75.36173067565237!3d27.487222176309395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDI5JzE0LjAiTiA3NcKwMjEnNTEuNSJF!5e0!3m2!1sen!2sin!4v1782419945553!5m2!1sen!2sin"
    className="w-full h-[300px] md:h-[450px] lg:h-[250px]"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
  />
          </div>

          {/* Right form */}
          <motion.div className="lg:col-span-3 p-5 sm:p-7 rounded-2xl bg-white"
            style={{ border:'1.5px solid var(--d-border-lt)', boxShadow:'var(--d-shadow)' }}
            initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            {sent ? (
              <div className="flex flex-col items-center py-12 gap-4">
                <CheckCircle size={52} style={{ color:'var(--d-accent)' }} />
                <h3 className="font-display text-xl" style={{ color:'var(--d-text)' }}>Message Sent!</h3>
                <p className="text-sm text-center" style={{ color:'var(--d-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="font-display text-xl font-semibold mb-5" style={{ color:'var(--d-text)' }}>
                  Send a Message
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>Name</label>
                    <input className="d-input" placeholder="Your name" {...register('name', { required:true })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>Mobile</label>
                    <input className="d-input" placeholder="+91 8741930226" {...register('mobile')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>Email</label>
                  <input type="email" className="d-input" placeholder="you@example.com" {...register('email')} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>Subject</label>
                  <input className="d-input" placeholder="How can we help?" {...register('subject', { required:true })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--d-text-2)' }}>Message</label>
                  <textarea rows={4} className="d-input resize-none" placeholder="Write your message…" {...register('message', { required:true })} />
                </div>
                <button type="submit" disabled={isSubmitting} className="d-btn-accent w-full py-3.5 text-sm gap-2">
                  <Send size={15} />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
