import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye } from 'lucide-react';
import { adminApi } from '../../utils/api';
import { formatPrice, formatDate, timeAgo } from '../../utils/format';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'amber', confirmed: 'blue', processing: 'blue',
  packed: 'purple', shipped: 'green', delivered: 'green', cancelled: 'red',
};

const channelBadge = { instagram: '📸 IG', whatsapp: '💬 WA' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');

  useEffect(() => {
    adminApi.getOrders({ status: statusFilter === 'all' ? '' : statusFilter })
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId) => {
    if (!newStatus) return;
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus, tracking });
      toast.success('Order status updated & email sent');
      setSelectedOrder(null);
      // Refresh
      const data = await adminApi.getOrders({ status: statusFilter === 'all' ? '' : statusFilter });
      setOrders(data.orders || []);
    } catch { toast.error('Failed to update'); }
  };

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportOrders({ status: statusFilter });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'alora-orders.csv'; a.click();
      toast.success('CSV exported');
    } catch { toast.error('Export failed'); }
  };

  const filtered = search
    ? orders.filter(o => o.id.includes(search) || o.customer?.name?.toLowerCase().includes(search.toLowerCase()))
    : orders;

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Orders</h1>
        <Button onClick={handleExport} variant="outline" size="sm"><Download size={14} className="mr-1" /> Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or customer..."
            className="w-full py-2.5 pl-10 pr-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
        >
          <option value="all">All Status</option>
          {['pending','confirmed','processing','packed','shipped','delivered','cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Order</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Total</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden md:table-cell">Channel</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Status</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden md:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-charcoal">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{order.customer?.name}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 hidden md:table-cell">{channelBadge[order.orderMethod]}</td>
                <td className="px-4 py-3"><Badge color={statusColors[order.status]}>{order.status}</Badge></td>
                <td className="px-4 py-3 text-stone-500 text-xs hidden md:table-cell">{timeAgo(order.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setTracking(order.tracking || ''); }}
                    className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-semibold mb-4">Order Detail</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-stone-500">Order ID:</span> <span className="font-mono">{selectedOrder.id}</span></p>
              <p><span className="text-stone-500">Customer:</span> {selectedOrder.customer?.name} ({selectedOrder.customer?.email})</p>
              <p><span className="text-stone-500">Total:</span> <span className="font-bold">{formatPrice(selectedOrder.total)}</span></p>
              <p><span className="text-stone-500">Channel:</span> {channelBadge[selectedOrder.orderMethod]}</p>

              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500 mb-2">Items:</p>
                {selectedOrder.items?.map((item, i) => (
                  <p key={i} className="text-sm">{item.name} {item.variant && `(${item.variant})`} × {item.quantity} — {formatPrice(item.price * item.quantity)}</p>
                ))}
              </div>

              {selectedOrder.igMessageText && (
                <div>
                  <p className="text-xs text-stone-500 mb-1">DM Message:</p>
                  <textarea readOnly value={selectedOrder.igMessageText} className="w-full p-3 bg-stone-50 rounded-lg text-xs resize-none h-24" />
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Update Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                    className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm">
                    {['pending','confirmed','processing','packed','shipped','delivered','cancelled'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Tracking Number</label>
                  <input value={tracking} onChange={e => setTracking(e.target.value)}
                    className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" placeholder="Enter tracking number" />
                </div>
                <Button onClick={() => handleStatusUpdate(selectedOrder.id)} variant="solid" className="w-full" size="sm">
                  Update Status & Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
