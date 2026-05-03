import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Copy, Check, ShoppingBag } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/Icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { generateOrderMessage, createPendingOrder, openInstagramDM, openWhatsApp } from '../../utils/checkout';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose, defaultMethod = 'instagram' }) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCheckout = async (method) => {
    if (!name.trim() || !email.trim() || !address.trim() || !postcode.trim()) {
      toast.error('Please fill in all required fields (Name, Email, Address, Postcode)');
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
        method,
        tempMessage
      );

      const finalMessage = generateOrderMessage(items, totalPrice, data.orderId, customer);
      setOrderId(data.orderId);

      if (method === 'instagram') {
        await openInstagramDM(finalMessage);
        setCopied(true);
        toast.success('Order details copied! Paste them in the Instagram DM.');
      } else {
        openWhatsApp(finalMessage);
        toast.success('WhatsApp opened with your order!');
      }

      clearCart();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
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
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && !orderId && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-ivory rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Success State */}
          {orderId ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">Order Placed! 🎉</h2>
              <p className="text-stone-600 text-sm mb-4">
                Order ID: <span className="font-mono text-gold font-medium">{orderId}</span>
              </p>
              <p className="text-stone-500 text-sm mb-6">
                We've saved your order. Our team will confirm it via DM within 2 hours.
              </p>
              <Button onClick={onClose} variant="solid" className="w-full">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-gold" />
                  <h2 className="font-display text-xl font-semibold text-charcoal">Place Your Order</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:text-gold transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* Order Summary */}
                <div className="bg-warm rounded-lg p-4 mb-6">
                  <h3 className="text-xs tracking-widest uppercase font-body text-stone-500 mb-3">Order Summary</h3>
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1.5">
                      <span className="text-charcoal">
                        {item.name} {item.variant && `(${item.variant})`} × {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-stone-200 mt-3 pt-3 flex justify-between">
                    <span className="font-medium text-charcoal">Subtotal</span>
                    <span className="font-display text-lg font-semibold text-charcoal">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Email ID *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Full Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No, Street, City, State"
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white min-h-[80px]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Postcode *</label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="600001"
                        className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Additional Phone Number</label>
                    <input
                      type="tel"
                      value={additionalPhone}
                      onChange={(e) => setAdditionalPhone(e.target.value)}
                      placeholder="Secondary contact number"
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleCheckout('instagram')}
                    variant="solid"
                    className="w-full"
                    loading={loading}
                  >
                    <Instagram size={16} className="mr-2" />
                    Copy & Open Instagram
                  </Button>
                  <Button
                    onClick={() => handleCheckout('whatsapp')}
                    variant="outline"
                    className="w-full"
                    loading={loading}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Send on WhatsApp
                  </Button>
                </div>

                {copied && (
                  <p className="text-center text-sm text-gold mt-4 flex items-center justify-center gap-1">
                    <Copy size={14} />
                    Order details copied! Paste them in the Instagram DM.
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
