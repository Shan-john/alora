import { useEffect, useMemo, useState } from 'react';
import { BarChart3, MousePointerClick, TrendingDown, TrendingUp } from 'lucide-react';
import { adminApi } from '../../utils/api';
import { normalizeImageUrl } from '../../utils/image';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const statusColors = {
  active: 'green',
  draft: 'gray',
  hidden: 'amber',
  archived: 'red',
};

const rangeOptions = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
];

function ProductTable({ title, icon: Icon, rows = [], emptyText }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
        <Icon size={16} className="text-gold" />
        <h2 className="font-body text-sm font-semibold text-charcoal">{title}</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-center py-8 text-stone-400 text-sm">{emptyText}</p>
      ) : (
        <div className="divide-y divide-stone-50">
          {rows.map((product, index) => (
            <div key={product.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-stone-400 w-5 text-right">{index + 1}</span>
                <img
                  src={normalizeImageUrl(product.image)}
                  alt=""
                  className="w-10 h-10 rounded object-cover bg-stone-100"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                  <p className="text-xs text-stone-500 truncate">{product.category || 'uncategorized'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={statusColors[product.status] || 'gray'}>{product.status}</Badge>
                <span className="text-sm font-semibold text-charcoal min-w-[44px] text-right">{product.clicks}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  const fetchAnalytics = async (periodDays = days) => {
    setLoading(true);
    try {
      const result = await adminApi.getDashboard({ days: periodDays, limit: 10 });
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  const kpis = useMemo(() => data?.kpis || {}, [data]);
  const topClickedProducts = data?.topClickedProducts || [];
  const lowClickedProducts = data?.lowClickedProducts || [];

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Analytics Dashboard</h1>
          <p className="text-sm text-stone-500">See which products customers click the most and least.</p>
        </div>

        <select
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="py-2 px-3 border border-stone-200 rounded-lg text-sm bg-white"
        >
          {rangeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Clicks',
            value: kpis.totalClicks || 0,
            icon: MousePointerClick,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Products Clicked',
            value: kpis.uniqueProductsClicked || 0,
            icon: BarChart3,
            color: 'bg-green-50 text-green-600',
          },
          {
            label: 'Top Product',
            value: kpis.topProductName || 'No data',
            sub: `${kpis.topProductClicks || 0} clicks`,
            icon: TrendingUp,
            color: 'bg-gold/10 text-gold',
          },
          {
            label: 'Lowest Product',
            value: kpis.lowProductName || 'No data',
            sub: `${kpis.lowProductClicks ?? 0} clicks`,
            icon: TrendingDown,
            color: 'bg-amber-50 text-amber-700',
          },
        ].map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-stone-100">
            <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon size={20} />
            </div>
            <p className="text-lg font-bold text-charcoal break-words">{kpi.value}</p>
            {kpi.sub && <p className="text-xs text-stone-400 mt-0.5">{kpi.sub}</p>}
            <p className="text-xs text-stone-500 uppercase tracking-wider mt-2">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProductTable
          title="Most Clicked Products"
          icon={TrendingUp}
          rows={topClickedProducts}
          emptyText="No click data yet for this range"
        />

        <ProductTable
          title="Least Clicked Products"
          icon={TrendingDown}
          rows={lowClickedProducts}
          emptyText="No active products available"
        />
      </div>
    </div>
  );
}
