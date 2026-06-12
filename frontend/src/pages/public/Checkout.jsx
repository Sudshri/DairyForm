import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, MapPin, CreditCard, ShoppingBag, ChevronRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/formatters';

const STEPS = [
  { id: 1, label: 'Address',  icon: <MapPin size={16} /> },
  { id: 2, label: 'Payment',  icon: <CreditCard size={16} /> },
  { id: 3, label: 'Review',   icon: <ShoppingBag size={16} /> },
];

const addressSchema = z.object({
  name:    z.string().min(2),
  phone:   z.string().min(10),
  address: z.string().min(10),
  city:    z.string().min(2),
  state:   z.string().min(2),
  pincode: z.string().length(6),
});

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('upi');
  const { items, total, clear } = useCartStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const subtotal   = total();
  const delivery   = subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal + delivery;

  const onPlaceOrder = () => {
    clear();
    navigate('/orders/success');
  };

  return (
    <div className="min-h-screen bg-milk-soft pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 font-semibold text-sm
                  ${step === s.id ? 'bg-blue-500 text-white shadow-soft-md' :
                    step > s.id  ? 'bg-green-500 text-white' :
                    'bg-white border-2 border-blue-100 text-slate-400'}`}>
                  {step > s.id ? <Check size={16} /> : s.icon}
                </div>
                <span className={`text-xs font-medium hidden sm:block
                  ${step === s.id ? 'text-blue-600' : step > s.id ? 'text-green-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 rounded-full transition-colors duration-300
                  ${step > s.id ? 'bg-green-400' : 'bg-blue-100'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div key="s1"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                  <GlassCard variant="white" className="p-6">
                    <h2 className="font-display text-2xl text-slate-800 mb-6">Delivery Address</h2>
                    <form onSubmit={handleSubmit(() => setStep(2))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Full Name"    placeholder="Ramesh Kumar"    error={errors.name?.message}    {...register('name')} />
                      <Input label="Phone Number" placeholder="98765 43210"    error={errors.phone?.message}   {...register('phone')} />
                      <Input label="Address"      placeholder="House no, Street" error={errors.address?.message} {...register('address')} wrapperClassName="sm:col-span-2" />
                      <Input label="City"         placeholder="Pune"            error={errors.city?.message}    {...register('city')} />
                      <Input label="State"        placeholder="Maharashtra"     error={errors.state?.message}   {...register('state')} />
                      <Input label="Pincode"      placeholder="411001"          error={errors.pincode?.message} {...register('pincode')} />
                      <div className="sm:col-span-2 mt-2">
                        <Button type="submit" className="w-full justify-center" size="lg"
                          iconRight={<ChevronRight size={16} />}>
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div key="s2"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                  <GlassCard variant="white" className="p-6">
                    <h2 className="font-display text-2xl text-slate-800 mb-6">Payment Method</h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { id:'upi',    label:'UPI / PhonePe / GPay',  icon:'📱' },
                        { id:'card',   label:'Credit / Debit Card',    icon:'💳' },
                        { id:'cod',    label:'Cash on Delivery',       icon:'💵' },
                        { id:'wallet', label:'Paytm Wallet',           icon:'👛' },
                      ].map((m) => (
                        <label key={m.id}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all
                            ${payMethod === m.id ? 'border-blue-400 bg-blue-50' : 'border-blue-50 bg-white hover:border-blue-200'}`}>
                          <input type="radio" name="pay" value={m.id} checked={payMethod === m.id}
                            onChange={() => setPayMethod(m.id)} className="accent-blue-500" />
                          <span className="text-xl">{m.icon}</span>
                          <span className="font-medium text-slate-700 text-sm">{m.label}</span>
                        </label>
                      ))}
                    </div>
                    {payMethod === 'card' && (
                      <div className="grid gap-4 mb-6 p-4 bg-blue-50 rounded-2xl">
                        <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Expiry" placeholder="MM/YY" />
                          <Input label="CVV" placeholder="•••" type="password" />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button className="flex-1 justify-center" size="lg"
                        iconRight={<ChevronRight size={16} />} onClick={() => setStep(3)}>
                        Review Order
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div key="s3"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                  <GlassCard variant="white" className="p-6">
                    <h2 className="font-display text-2xl text-slate-800 mb-6">Review Your Order</h2>
                    <div className="space-y-3 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 border-b border-blue-50">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">🥛</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                            <p className="text-xs text-slate-400">×{item.qty}</p>
                          </div>
                          <p className="font-semibold text-slate-800 text-sm shrink-0">
                            {formatCurrency(item.price * item.qty)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button className="flex-1 justify-center" size="lg"
                        icon={<Check size={16} />} onClick={onPlaceOrder}>
                        Place Order • {formatCurrency(grandTotal)}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <GlassCard variant="white" className="p-5 h-fit sticky top-28">
            <h3 className="font-semibold text-slate-700 mb-4 text-sm">Order Total</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-500 font-semibold' : ''}>{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span>
              </div>
              <div className="border-t border-blue-50 pt-3 flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span className="font-display text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
