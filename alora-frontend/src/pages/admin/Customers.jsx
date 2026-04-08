import { useEffect, useState } from 'react';
import { adminApi } from '../../utils/api';
import { formatDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getCustomers()
      .then(data => setCustomers(data.customers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal mb-6">Customers</h1>

      <div className="bg-white rounded-xl border border-stone-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Email</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden md:table-cell">Phone</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden sm:table-cell">Orders</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-charcoal">{c.name}</td>
                <td className="px-4 py-3 text-stone-600">{c.email}</td>
                <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{c.phone || '—'}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{c.orderIds?.length || 0}</td>
                <td className="px-4 py-3 text-stone-500 text-xs hidden md:table-cell">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="text-center py-8 text-stone-400 text-sm">No customers yet</p>}
      </div>
    </div>
  );
}
