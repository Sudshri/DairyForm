import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { selectNotification, clearNotification } from '@/store/redux/uiSlice';

const icons = {
  success: <CheckCircle size={16} className="text-green-500 shrink-0" />,
  error:   <XCircle    size={16} className="text-red-500 shrink-0" />,
  info:    <Info       size={16} className="text-blue-500 shrink-0" />,
};

export default function Notification() {
  const dispatch     = useDispatch();
  const notification = useSelector(selectNotification);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => dispatch(clearNotification()), 3500);
    return () => clearTimeout(t);
  }, [notification, dispatch]);

  return (
    <div className="fixed bottom-5 right-5 z-toast pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.message}
            className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl
                       shadow-glass px-4 py-3.5 min-w-64 max-w-sm pointer-events-auto"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 8,   scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {icons[notification.type] ?? icons.info}
            <p className="text-sm text-slate-700 flex-1 leading-snug">{notification.message}</p>
            <button
              onClick={() => dispatch(clearNotification())}
              className="text-slate-300 hover:text-slate-500 shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
