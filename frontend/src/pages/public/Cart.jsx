import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import QuantitySelector from '@/components/ui/QuantitySelector';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();

  const subtotal  = total();
  const delivery  = subtotal >= 500 ? 0 : 50;
  const discount  = 0;
  const grandTotal = subtotal + delivery - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-milk-soft pt-28 flex items-center justify-center">
        <div className="text-center space-y-5">
          <span className="text-8xl block animate-bounce-soft">🛒</span>
          <h2 className="font-display text-2xl text-slate-700">Your cart is empty</h2>
          <p className="text-slate-400 text-sm">Add some fresh dairy to get started!</p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-slate-900 mb-10">
          Your Cart <span className="text-blue-400 font-normal text-2xl">({items.length} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard variant="white" className="p-4 flex gap-4 items-center">
                    {/* Product image */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cream-100
                                    flex items-center justify-center text-3xl shrink-0">
                      🥛
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-500 font-semibold uppercase">{item.category}</p>
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight truncate">{item.name}</h3>
                      <p className="text-blue-600 font-bold mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    {/* Qty + delete */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <QuantitySelector
                        value={item.qty}
                        onChange={(q) => updateQty(item.id, q)}
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link to="/products" className="inline-flex items-center gap-2 text-blue-500
              text-sm font-medium hover:gap-3 transition-all mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div>
            <GlassCard variant="white" className="p-6 sticky top-28">
              <h3 className="font-display text-xl text-slate-800 mb-6">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-green-500 font-semibold' : ''}>
                    {delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                {delivery > 0 && (
                  <p className="text-xs text-blue-500 bg-blue-50 rounded-xl px-3 py-2">
                    Add {formatCurrency(500 - subtotal)} more for FREE delivery
                  </p>
                )}
              </div>

              <div className="border-t border-blue-100 my-5 pt-5 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span className="font-display text-xl">{formatCurrency(grandTotal)}</span>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="input-field pl-9 text-sm" placeholder="Coupon code" />
                </div>
                <button className="btn-outline btn-sm shrink-0">Apply</button>
              </div>

              <Link to="/checkout">
                <Button className="w-full justify-center" size="lg"
                  iconRight={<ArrowRight size={16} />}>
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                🔒 Secure & encrypted checkout
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
