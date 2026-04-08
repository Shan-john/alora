import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Calendar, DollarSign, AlertTriangle, Star } from 'lucide-react';
import { adminApi } from '../../utils/api';
import { formatPrice, timeAgo } from '../../utils/format';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const statusColors = {
  pending: 'amber',
  confirmed: 'blue',
  processing: 'blue',
  packed: 'purple',
  shipped: 'green',
  delivered: 'green',
  cancelled: 'red',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" className="py-20" />;

  const kpis = data?.kpis || {};
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStockProducts || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: kpis.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending Orders', value: kpis.pendingOrders || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Orders Today', value: kpis.ordersToday || 0, icon: Calendar, color: 'bg-green-50 text-green-600' },
          { label: 'Revenue', value: formatPrice(kpis.revenue || 0), icon: DollarSign, color: 'bg-gold/10 text-gold' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-5 border border-stone-100"
          >
            <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
            <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h2 className="font-body text-sm font-semibold text-charcoal">Recent Orders</h2>
          </div>
          <div className="divide-y divide-stone-50">
            {recentOrders.length === 0 ? (
              <p className="text-center py-8 text-stone-400 text-sm">No orders yet</p>
            ) : (
              recentOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{order.customer?.name}</p>
                    <p className="text-xs text-stone-500">{formatPrice(order.total)} · {order.items?.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <Badge color={statusColors[order.status] || 'gray'}>{order.status}</Badge>
                    <p className="text-[10px] text-stone-400 mt-1">{timeAgo(order.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="font-body text-sm font-semibold text-charcoal">Low Stock Alert</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {lowStock.length === 0 ? (
                <p className="text-center py-6 text-stone-400 text-sm">All products well stocked ✓</p>
              ) : (
                lowStock.slice(0, 5).map((p) => (
                  <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-charcoal truncate">{p.name}</span>
                    <Badge color="red">{p.stock} left</Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">{data?.pendingReviewsCount || 0} Pending Reviews</p>
              <p className="text-xs text-stone-500">Reviews waiting for approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
