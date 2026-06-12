import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import StarRating from './StarRating';
import GlassCard from './GlassCard';

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard variant="white" tilt className="p-6 h-full flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Quote size={28} className="text-blue-200" />
          <StarRating value={testimonial.rating} size={14} />
        </div>

        <p className="text-slate-600 leading-relaxed flex-1 text-sm italic">
          "{testimonial.comment}"
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-blue-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200
                          flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
            {testimonial.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{testimonial.name}</p>
            <p className="text-xs text-slate-400">{testimonial.location}</p>
          </div>
          {testimonial.verified && (
            <span className="ml-auto badge-sky text-2xs">✓ Verified</span>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
