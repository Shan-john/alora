import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/format';

const statusColors = {
  pending: 'amber',
  confirmed: 'blue',
  processing: 'blue',
  packed: 'purple',
  shipped: 'green',
  delivered: 'green',
  cancelled: 'red',
};

export default function Track() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.trackOrder(orderId.trim());
      setOrder(data);
    } catch {
      setError('Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Track Order | Alora by Trio</title></Helmet>
      <div className="pt-24 pb-16 min-h-screen bg-ivory">
        <div className="max-w-xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 pt-8">
            <Package size={40} className="text-gold mx-auto mb-4" />
            <h1 className="font-display text-3xl font-semibold text-charcoal mb-2">Track Your Order</h1>
            <p className="text-stone-500 text-sm font-body">Enter your Order ID to see the latest status</p>
          </motion.div>

          <form onSubmit={handleTrack} className="flex gap-3 mb-8">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="flex-1 py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <Button type="submit" variant="solid" loading={loading}>
              <Search size={16} />
            </Button>
          </form>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {order && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-warm rounded-xl p-6 border border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-stone-500 font-body">Order ID</p>
                  <p className="font-mono text-sm font-medium text-charcoal">{order.orderId}</p>
                </div>
                <Badge color={statusColors[order.status] || 'gray'}>
                  {order.status?.toUpperCase()}
                </Badge>
              </div>
              {order.tracking && (
                <div className="mt-3">
                  <p className="text-xs text-stone-500">Tracking Number</p>
                  <p className="text-sm font-medium text-gold">{order.tracking}</p>
                </div>
              )}
              <div className="mt-4 text-xs text-stone-500">
                <p>Ordered via: {order.orderMethod === 'instagram' ? '📸 Instagram' : '💬 WhatsApp'}</p>
                {order.createdAt && <p>Placed: {formatDate(order.createdAt)}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
