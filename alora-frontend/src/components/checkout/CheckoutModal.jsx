import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { generateOrderMessage, createPendingOrder, openWhatsApp } from '../../utils/checkout';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose, settings = {} }) {
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!name.trim() || !email.trim() || !address.trim() || !postcode.trim() || !phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const customer = { 
        name: name.trim(), 
        email: email.trim(), 
        phone: phone.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
        additionalPhone: additionalPhone.trim()
      };

      const tempMessage = generateOrderMessage(items, totalPrice, 'PENDING', customer);

      const data = await createPendingOrder(
        items,
        customer,
        totalPrice,
        'whatsapp',
        tempMessage
      );

      const finalMessage = generateOrderMessage(items, totalPrice, data.orderId, customer);
      setOrderId(data.orderId);

      // Use dynamic WhatsApp number from settings or fallback
      const waNumber = settings.whatsappNumber || "919188457331";
      openWhatsApp(finalMessage, waNumber);
      
      toast.success('Order placed! Redirecting to WhatsApp...');
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ivory z-50 overflow-y-auto"
      >
        <div className="min-h-screen w-full flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-charcoal">Checkout</h2>
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-body">Complete your order</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-charcoal">
                <X size={24} />
              </button>
            </div>

            {/* Success State */}
            {orderId ? (
              <div className="p-12 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-600" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-charcoal mb-3">Order Placed! 🎉</h2>
                <p className="text-stone-600 mb-6">
                  Order ID: <span className="font-mono text-gold font-bold">{orderId}</span>
                </p>
                <p className="text-stone-500 text-sm mb-10 leading-relaxed">
                  We've received your order. Our team will contact you via WhatsApp for confirmation.
                </p>
                <Button onClick={onClose} variant="solid" className="w-full py-4 text-lg">
                  Back to Shop
                </Button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row">
                {/* Left Side: Form */}
                <div className="flex-[1.2] p-8 lg:p-10 border-r border-stone-100">
                  <h3 className="font-display text-xl font-medium text-charcoal mb-8 border-b border-stone-100 pb-4">Shipping Information</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Full Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Email ID *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Full Delivery Address *</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street name, Area, City, State"
                        className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm min-h-[100px] resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Postcode *</label>
                        <input
                          type="text"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="600001"
                          className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Primary Phone Number *</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 mb-2 block">Additional Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={additionalPhone}
                        onChange={(e) => setAdditionalPhone(e.target.value)}
                        placeholder="Secondary contact number"
                        className="w-full py-3.5 px-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="flex-[0.8] bg-stone-50 p-8 lg:p-10">
                  <h3 className="font-display text-xl font-medium text-charcoal mb-8 border-b border-stone-200 pb-4">Your Selection</h3>
                  
                  <div className="space-y-6 mb-8">
                    {items.length === 0 ? (
                      <p className="text-stone-400 text-center py-10 italic">Your cart is empty</p>
                    ) : (
                      items.map((item) => (
                        <div key={`${item.productId}_${item.variant}`} className="flex gap-4 items-start py-2 border-b border-stone-200 last:border-0 pb-4 last:pb-0 relative group">
                          <div className="w-20 h-20 bg-white rounded-lg border border-stone-200 shrink-0 overflow-hidden shadow-sm">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-charcoal text-sm font-semibold truncate pr-6">{item.name}</p>
                              <button 
                                onClick={() => removeItem(item.productId, item.variant)}
                                className="text-stone-300 hover:text-red-500 transition-colors p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <p className="text-stone-400 text-[11px] mt-1 uppercase tracking-wider">
                              {item.variant && `${item.variant}`}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden h-8">
                                <button 
                                  onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                                  className="px-2 hover:bg-stone-50 text-stone-400 transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-medium min-w-[24px] text-center border-x border-stone-100">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                                  className="px-2 hover:bg-stone-50 text-stone-400 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <p className="font-bold text-sm text-charcoal">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between text-stone-500 text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium text-charcoal">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold tracking-widest text-[10px] uppercase">Free</span>
                    </div>
                    <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
                      <span className="font-display text-lg font-semibold text-charcoal">Total</span>
                      <span className="font-display text-2xl font-bold text-gold">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-charcoal py-4 px-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(197,157,95,0.15)] disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-charcoal via-[#2a2420] to-charcoal transition-transform duration-500 group-hover:scale-105" />
                    
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                      ) : (
                        <MessageCircle size={20} className="text-gold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      )}
                      <span className="font-body text-[13px] font-bold uppercase tracking-[0.25em] text-ivory">
                        {loading ? 'Processing...' : 'Complete with WhatsApp'}
                      </span>
                    </div>

                    {/* Classy hover border effect */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] w-full scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                  </button>
                  
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <div className="h-px w-8 bg-stone-200" />
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">
                      Premium Checkout Experience
                    </p>
                    <div className="h-px w-8 bg-stone-200" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
