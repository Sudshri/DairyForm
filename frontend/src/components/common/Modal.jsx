import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}) {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

        {/* Center Wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            className={`
              w-full
              ${widths[size]}
              bg-white
              rounded-2xl
              shadow-xl
              p-6
              max-h-[90vh]
              overflow-y-auto
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-slate-800">
                {title}
              </Dialog.Title>

              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}