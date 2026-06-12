import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' };

export default function Modal({ open, onClose, title, children, size = 'md', showClose = true }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    z-50 w-full ${sizeMap[size]}
                    glass-heavy rounded-4xl shadow-glass-xl p-8`}
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{   opacity: 0, scale: 0.96,  y: 8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {(title || showClose) && (
                    <div className="flex items-center justify-between mb-6">
                      {title && (
                        <Dialog.Title className="font-display text-xl text-slate-800">
                          {title}
                        </Dialog.Title>
                      )}
                      {showClose && (
                        <button
                          onClick={onClose}
                          className="ml-auto w-9 h-9 rounded-2xl flex items-center justify-center
                                     text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  )}
                  {children}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
