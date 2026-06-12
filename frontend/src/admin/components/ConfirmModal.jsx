import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, variant = 'danger' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel} />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       bg-white rounded-3xl shadow-xl p-7 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4
              ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle size={22} className={variant === 'danger' ? 'text-red-500' : 'text-amber-500'} />
            </div>
            <h3 className="font-display text-lg text-slate-800 text-center mb-1">{title}</h3>
            <p className="text-sm text-slate-500 text-center mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl border border-slate-200
                text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-colors
                  disabled:opacity-60 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                {loading ? 'Processing…' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
