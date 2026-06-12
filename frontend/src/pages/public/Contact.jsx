import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { FloatingBlob } from '@/components/ui/MilkWave';

const CONTACT_INFO = [
  { icon: <Phone size={20} />,   label:'Call Us',     value:'+91 12345 67890',          color:'sky' },
  { icon: <Mail size={20} />,    label:'Email Us',    value:'hello@dairyform.com',       color:'green' },
  { icon: <MapPin size={20} />,  label:'Visit Us',    value:'Pune, Maharashtra, India',  color:'cream' },
  { icon: <Clock size={20} />,   label:'Hours',       value:'Mon–Sat, 7AM – 8PM',        color:'sky' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20 relative overflow-hidden">
      <FloatingBlob color="#BAE6FD" size={400} opacity={0.25} className="top-20 -right-40" />
      <FloatingBlob color="#FDE8C8" size={300} opacity={0.2}  className="bottom-20 -left-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeader
          tag="📞 Get in Touch"
          title="We'd Love to Hear from You"
          subtitle="Have a question or want to place a bulk order? We're here to help."
          className="mb-14"
        />

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map(({ icon, label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity:0, x:-20 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard variant="white" className="p-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0
                    ${color === 'sky' ? 'bg-blue-100 text-blue-600' : color === 'green' ? 'bg-green-100 text-green-600' : 'bg-cream-200 text-amber-600'}`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-semibold text-slate-800 text-sm">{value}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <GlassCard variant="white" className="overflow-hidden mt-6">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin size={32} className="text-blue-400 mx-auto mb-2 animate-bounce-soft" />
                  <p className="text-sm text-blue-600 font-medium">Pune, Maharashtra</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 text-center">
                  📍 123 Farm Road, Hadapsar, Pune – 411013
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <GlassCard variant="white" className="p-8">
              {sent ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity:0, scale:0.9 }}
                  animate={{ opacity:1, scale:1 }}
                >
                  <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-blue-500 hover:underline text-sm">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h2 className="font-display text-2xl text-slate-800 mb-2">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Your Name"  placeholder="Ramesh Kumar" required {...register('name', { required:true })} />
                    <Input label="Email"      placeholder="you@email.com" type="email" required {...register('email', { required:true })} />
                  </div>
                  <Input label="Phone (optional)" placeholder="+91 98765 43210" {...register('phone')} />
                  <Input label="Subject" placeholder="How can we help you?" required {...register('subject', { required:true })} />
                  <div>
                    <label className="input-label">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here…"
                      className="input-field resize-none"
                      {...register('message', { required:true })}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full justify-center"
                    icon={<Send size={16} />}>
                    Send Message
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
