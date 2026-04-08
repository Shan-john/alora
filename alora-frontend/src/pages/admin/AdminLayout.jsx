import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageSpinner } from '../../components/common/Spinner';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Star,
  Home, Settings, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/homepage', label: 'Homepage', icon: Home },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin, adminRole, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <PageSpinner />;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal text-white flex-shrink-0 fixed h-full z-30 hidden lg:block">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display text-xl font-semibold text-white">Alora</h2>
          <p className="text-[9px] tracking-[3px] uppercase text-gold -mt-0.5">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gold/20 text-gold'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="mb-3 px-2">
            <p className="text-sm text-white truncate">{user?.displayName || user?.email}</p>
            <p className="text-[10px] text-gold uppercase tracking-wider">{adminRole}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-red-400 text-sm transition-colors w-full rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-60">
        {/* Mobile header */}
        <div className="lg:hidden bg-charcoal text-white p-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="font-display text-lg font-semibold">Alora Admin</h2>
          </div>
          <button onClick={logout} className="text-stone-400 hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden bg-white border-b overflow-x-auto no-scrollbar sticky top-[56px] z-10">
          <div className="flex gap-1 p-2 min-w-max">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                    isActive ? 'bg-gold/10 text-gold' : 'text-stone-500 hover:text-charcoal'
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
