import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useToastStore } from '@/store/toastStore';

const icons = {
  success: <CheckCircle size={16} className="text-green-500 shrink-0" />,
  error:   <XCircle    size={16} className="text-red-500 shrink-0" />,
  info:    <Info       size={16} className="text-blue-500 shrink-0" />,
};

function Toast({ toast }) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const t = setTimeout(() => remove(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, remove]);

  return (
    <div className={clsx(
      'flex items-center gap-3 bg-white border border-surface-border',
      'rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-sm',
      'animate-in slide-in-from-right-full'
    )}>
      {icons[toast.type]}
      <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
      <button onClick={() => remove(toast.id)} className="text-slate-400 hover:text-slate-600">
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
      {toasts.map((t) => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
