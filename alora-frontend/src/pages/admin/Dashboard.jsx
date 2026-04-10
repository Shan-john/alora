import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Users,
  Mail,
  Star,
  Eye,
  Layers,
  Target,
  MessageSquare,
  ArrowUpRight,
  Zap,
  Package,
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { normalizeImageUrl } from '../../utils/image';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

/* ────────── colour helpers ────────── */
const statusColors = {
  active: 'green',
  draft: 'gray',
  hidden: 'amber',
  archived: 'red',
};

const SOURCE_COLORS = {
  'card-click': { bg: '#f59e0b', label: 'Card Click' },
  'detail-view': { bg: '#6366f1', label: 'Detail View' },
  unknown: { bg: '#94a3b8', label: 'Other' },
};

const CATEGORY_PALETTE = [
  '#f59e0b', '#6366f1', '#22c55e', '#ef4444', '#06b6d4',
  '#ec4899', '#8b5cf6', '#f97316', '#14b8a6', '#64748b',
];

const rangeOptions = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, sub, color = 'bg-blue-50 text-blue-600', suffix = '' }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-xl font-bold text-charcoal break-words">
        {value}{suffix}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      <p className="text-[11px] text-stone-500 uppercase tracking-wider mt-2 font-semibold">{label}</p>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2 bg-stone-50/50">
        <Icon size={16} className="text-gold" />
        <h2 className="font-body text-sm font-semibold text-charcoal uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Stacked horizontal bar (click sources) ── */
function StackedBar({ items = [] }) {
  if (!items.length) return <p className="text-sm text-stone-400">No data</p>;

  return (
    <div>
      {/* Bar */}
      <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-inner bg-stone-100">
        {items.map((item, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center text-white text-[11px] font-bold transition-all duration-700"
            style={{
              width: `${Math.max(item.percentage, 2)}%`,
              backgroundColor: SOURCE_COLORS[item.source]?.bg || '#94a3b8',
            }}
            title={`${item.source}: ${item.percentage}%`}
          >
            {item.percentage >= 8 ? `${item.percentage}%` : ''}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {items.map((item, i) => {
          const info = SOURCE_COLORS[item.source] || SOURCE_COLORS.unknown;
          return (
            <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: info.bg }} />
              <span className="font-medium">{info.label}</span>
              <span className="text-stone-400">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Category bar chart ── */
function CategoryBars({ categories = [] }) {
  if (!categories.length) return <p className="text-sm text-stone-400">No category click data</p>;
  const max = Math.max(...categories.map(c => c.percentage), 1);

  return (
    <div className="space-y-3">
      {categories.map((cat, i) => (
        <div key={cat.category} className="flex items-center gap-3">
          <span className="text-xs font-medium text-charcoal capitalize w-28 truncate">
            {cat.category.replace(/-/g, ' ')}
          </span>
          <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 flex items-center pl-2"
              style={{
                width: `${(cat.percentage / max) * 100}%`,
                backgroundColor: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
                minWidth: '20px',
              }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">{cat.percentage}%</span>
            </div>
          </div>
          <span className="text-xs text-stone-400 w-14 text-right">{cat.clicks} clicks</span>
        </div>
      ))}
    </div>
  );
}

/* ── CSS Donut / Ring chart ── */
function EngagementRing({ engaged, dead, engagementRate }) {
  const circumference = 2 * Math.PI * 54; // r=54
  const filledLength = (engagementRate / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Ring */}
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="#22c55e"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filledLength}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-charcoal">{engagementRate}%</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">Engaged</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-stone-600"><b className="text-charcoal">{engaged}</b> products clicked ({engagementRate}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-stone-200" />
          <span className="text-stone-600"><b className="text-charcoal">{dead}</b> products zero clicks ({(100 - engagementRate).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}

/* ── Product table with % bars and source split ── */
function ProductTable({ title, icon: Icon, rows = [], emptyText, totalClicks = 0, isMost = true }) {
  return (
    <Section title={title} icon={Icon} className="flex flex-col h-[400px]">
      {rows.length === 0 ? (
        <p className="text-center py-6 text-stone-400 text-sm">{emptyText}</p>
      ) : (
        <div className="space-y-0 -mx-5 -mb-5 flex-1 overflow-y-auto flex flex-col">
          {rows.map((product, index) => {
            const percentage = totalClicks > 0 ? ((product.clicks / totalClicks) * 100).toFixed(1) : 0;
            return (
              <div
                key={product.id}
                className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors border-b border-stone-50 last:border-0 shrink-0"
              >
                {/* Left: rank + image + info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    className={`text-[11px] font-bold w-5 text-center shrink-0 ${
                      isMost && index === 0 ? 'text-yellow-500' : isMost && index === 1 ? 'text-stone-400' : isMost && index === 2 ? 'text-orange-700/70' : 'text-stone-300'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <img
                    src={normalizeImageUrl(product.image)}
                    alt=""
                    className="w-8 h-8 rounded-md object-cover bg-stone-100 shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-charcoal truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 capitalize truncate">
                        {product.category?.replace(/-/g, ' ') || 'uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: stats */}
                <div className="flex flex-col items-end gap-1 w-28 shrink-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] font-bold text-charcoal">
                      {product.clicks} <span className="text-[9px] font-normal text-stone-400">clicks</span>
                    </span>
                    <span className="text-[9px] font-bold text-stone-500">
                      {percentage}%
                    </span>
                  </div>

                  {/* Overall % bar */}
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMost && index === 0 ? 'bg-yellow-400' : isMost && index === 1 ? 'bg-stone-400' : isMost && index === 2 ? 'bg-orange-400' : isMost ? 'bg-gold' : 'bg-stone-300'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  {/* Source split mini-bar */}
                  {product.clicks > 0 && (
                    <div className="w-full flex items-center gap-1 mt-0.5">
                      <div className="flex-1 flex rounded-sm overflow-hidden h-[3px]">
                        <div
                          className="h-full"
                          style={{
                            width: `${product.cardClickPct || 0}%`,
                            backgroundColor: SOURCE_COLORS['card-click'].bg,
                          }}
                        />
                        <div
                          className="h-full"
                          style={{
                            width: `${product.detailClickPct || 0}%`,
                            backgroundColor: SOURCE_COLORS['detail-view'].bg,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

/* ── Growth stat mini-card ── */
function GrowthItem({ icon: Icon, label, total, recent, color }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50/60 hover:bg-stone-50 transition-colors">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-charcoal">{total}</p>
        <p className="text-[11px] text-stone-500 truncate">{label}</p>
      </div>
      {recent > 0 && (
        <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <ArrowUpRight size={10} />+{recent}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
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
  const clickSources = data?.clickSources || [];
  const categoryDistribution = data?.categoryDistribution || [];
  const engagement = data?.engagement || {};
  const growth = data?.growth || {};
  const reviewAnalytics = data?.reviewAnalytics || {};
  const topClickedProducts = data?.topClickedProducts || [];
  const lowClickedProducts = data?.lowClickedProducts || [];

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Analytics Dashboard</h1>
          <p className="text-sm text-stone-500">
            Engagement patterns & percentage breakdown · {data?.periodDays || days}-day window
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="py-2 px-3 border border-stone-200 rounded-lg text-sm bg-white cursor-pointer hover:border-stone-300 transition-colors"
        >
          {rangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          icon={Target}
          label="Engagement Rate"
          value={kpis.engagementRate || 0}
          suffix="%"
          sub={`${engagement.clickedProducts || 0} of ${engagement.totalProducts || 0} products`}
          color="bg-green-50 text-green-600"
        />
        <KpiCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={kpis.totalClicks || 0}
          sub={`${kpis.uniqueProductsClicked || 0} unique products`}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          icon={Zap}
          label="Avg Clicks / Product"
          value={kpis.avgClicksPerProduct || 0}
          sub="active products"
          color="bg-violet-50 text-violet-600"
        />
        <KpiCard
          icon={Eye}
          label="Card → Detail %"
          value={kpis.cardToDetailRate || 0}
          suffix="%"
          sub="browsing to deep-view"
          color="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          icon={Users}
          label="Customers"
          value={growth.totalCustomers || 0}
          sub={growth.newCustomers ? `+${growth.newCustomers} new` : 'no new'}
          color="bg-amber-50 text-amber-700"
        />
        <KpiCard
          icon={Mail}
          label="Subscribers"
          value={growth.totalSubscribers || 0}
          sub={growth.newSubscribers ? `+${growth.newSubscribers} new` : 'no new'}
          color="bg-pink-50 text-pink-600"
        />
      </div>

      {/* ── Row: Click Sources + Category Distribution ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Click Source Distribution" icon={Layers}>
          <StackedBar items={clickSources} />
        </Section>

        <Section title="Category Performance" icon={BarChart3}>
          <CategoryBars categories={categoryDistribution} />
        </Section>
      </div>

      {/* ── Row: Engagement Funnel + Growth + Reviews ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Section title="Product Engagement Funnel" icon={Target}>
          <EngagementRing
            engaged={engagement.clickedProducts || 0}
            dead={engagement.deadProducts || 0}
            engagementRate={engagement.engagementRate || 0}
          />
        </Section>

        <Section title="Growth Snapshot" icon={TrendingUp}>
          <div className="space-y-2">
            <GrowthItem
              icon={Users}
              label="Registered Customers"
              total={growth.totalCustomers || 0}
              recent={growth.newCustomers || 0}
              color="bg-amber-100 text-amber-700"
            />
            <GrowthItem
              icon={Mail}
              label="Newsletter Subscribers"
              total={growth.totalSubscribers || 0}
              recent={growth.newSubscribers || 0}
              color="bg-pink-100 text-pink-600"
            />
            <GrowthItem
              icon={MessageSquare}
              label="Enquiries This Period"
              total={growth.enquiriesInPeriod || 0}
              recent={0}
              color="bg-blue-100 text-blue-600"
            />
            <GrowthItem
              icon={Package}
              label="Active Products"
              total={engagement.totalProducts || 0}
              recent={0}
              color="bg-green-100 text-green-600"
            />
          </div>
        </Section>

        <Section title="Review Analytics" icon={Star}>
          <div className="space-y-4">
            {/* Avg rating display */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-charcoal">{reviewAnalytics.avgRating || 0}</div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= Math.round(reviewAnalytics.avgRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">{reviewAnalytics.totalReviews || 0} total reviews</p>
              </div>
            </div>

            {/* Approved vs pending bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1.5">
                <span>Approved ({reviewAnalytics.approvedRate || 0}%)</span>
                <span>Pending ({reviewAnalytics.pendingRate || 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-100 shadow-inner">
                <div
                  className="h-full bg-green-500 transition-all duration-700"
                  style={{ width: `${reviewAnalytics.approvedRate || 0}%` }}
                />
                <div
                  className="h-full bg-amber-400 transition-all duration-700"
                  style={{ width: `${reviewAnalytics.pendingRate || 0}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />{reviewAnalytics.approvedReviews || 0} approved
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />{reviewAnalytics.pendingReviews || 0} pending
                </span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Row: Top Clicked Products ── */}
      <div className="w-full">
        <ProductTable
          title="Most Clicked Products"
          icon={TrendingUp}
          rows={topClickedProducts}
          totalClicks={kpis.totalClicks || 0}
          emptyText="No click data yet for this range"
          isMost={true}
        />
      </div>
    </div>
  );
}
