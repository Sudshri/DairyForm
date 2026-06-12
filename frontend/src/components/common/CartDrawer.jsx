import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectCartOpen, closeCart } from '@/store/redux/uiSlice';
import { useCart } from '@/hooks/useCart';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';

export default function CartDrawer() {
  const dispatch  = useDispatch();
  const isOpen    = useSelector(selectCartOpen);
  const { items, count, subtotal, delivery, grandTotal, remove, update } = useCart();

  const close = () => dispatch(closeCart());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md glass-heavy z-drawer
                       flex flex-col shadow-glass-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-500" />
                <h2 className="font-display text-lg text-slate-800">Cart</h2>
                {count > 0 && (
                  <span className="badge-sky">{count} items</span>
                )}
              </div>
              <button onClick={close}
                className="w-9 h-9 rounded-2xl hover:bg-blue-50 flex items-center justify-center text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div className="flex flex-col items-center justify-center h-full py-20 text-center"
                    initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <span className="text-6xl mb-4">🛒</span>
                    <p className="font-display text-lg text-slate-600">Your cart is empty</p>
                    <p className="text-sm text-slate-400 mt-1">Add some fresh dairy!</p>
                    <Button variant="outline" size="sm" className="mt-5" onClick={close}>
                      Browse Products
                    </Button>
                  </motion.div>
                ) : items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex gap-3 bg-white rounded-2xl p-3 border border-blue-50 shadow-soft"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-cream-100
                                    flex items-center justify-center text-2xl shrink-0">🥛</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-500 font-semibold">{item.category}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{item.name}</p>
                      <p className="text-blue-600 font-bold text-sm">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => remove(item.id)}
                        className="text-slate-200 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <QuantitySelector
                        value={item.qty}
                        onChange={(q) => update(item.id, q)}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="p-4 border-t border-blue-100 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-green-500 font-semibold' : ''}>
                    {delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-blue-50">
                  <span>Total</span>
                  <span className="font-display text-lg">{formatCurrency(grandTotal)}</span>
                </div>
                <Link to="/checkout" onClick={close}>
                  <Button className="w-full justify-center" iconRight={<ArrowRight size={16} />}>
                    Checkout • {formatCurrency(grandTotal)}
                  </Button>
                </Link>
                <Link to="/cart" onClick={close}
                  className="block text-center text-sm text-blue-500 hover:underline">
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
