import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/Icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-charcoal" />
                <h2 className="font-display text-xl font-semibold text-charcoal">Your Bag</h2>
                <span className="text-sm text-stone-500">({totalItems})</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:text-gold transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-stone-300 mb-4" />
                  <h3 className="font-display text-xl text-charcoal mb-2">Your bag is empty</h3>
                  <p className="text-stone-500 text-sm mb-6">Discover our latest collection</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="solid" size="sm">
                    <Link to="/shop" className="text-inherit no-underline">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}_${item.variant}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-warm rounded-lg p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-medium text-charcoal truncate">{item.name}</h4>
                        {item.variant && (
                          <p className="text-xs text-stone-500 mt-0.5">{item.variant}</p>
                        )}
                        <p className="font-body text-sm font-semibold text-charcoal mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-stone-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                              className="p-1.5 hover:text-gold transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                              className="p-1.5 hover:text-gold transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variant)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with checkout CTAs */}
            {items.length > 0 && (
              <div className="border-t border-stone-200 px-6 py-4 bg-warm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-stone-600 uppercase tracking-wider">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-charcoal">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block"
                >
                  <Button variant="solid" className="w-full mb-2" size="md">
                    <Instagram size={16} className="mr-2" />
                    Buy via Instagram DM
                  </Button>
                </Link>
                <Link
                  to="/checkout?method=whatsapp"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block"
                >
                  <Button variant="outline" className="w-full" size="md">
                    <MessageCircle size={16} className="mr-2" />
                    Order on WhatsApp
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
