import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageSpinner } from '../../components/common/Spinner';
import {
  LayoutDashboard, Package, Star,
  Home, Settings, LogOut, ChevronRight, Lock
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Product Manager', icon: Package },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/homepage', label: 'Homepage Blocks', icon: Home },
  { path: '/admin/settings', label: 'Content & Settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAdmin, adminRole, loading, logout, adminLogin } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  if (loading) return <PageSpinner />;

  // Show admin login form if not authenticated
  if (!isAdmin) {
    const handleLogin = (e) => {
      e.preventDefault();
      setLoginLoading(true);
      setError('');
      setTimeout(() => {
        const success = adminLogin(username, password);
        if (!success) {
          setError('Invalid username or password');
        }
        setLoginLoading(false);
      }, 500);
    };

    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-white tracking-wide">Alora</h1>
            <p className="text-[10px] tracking-[4px] uppercase text-amber-400 mt-0.5">Admin Panel</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#16213e] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-400/10 rounded-full mx-auto mb-6">
              <Lock size={20} className="text-amber-400" />
            </div>
            <h2 className="text-white text-center text-lg font-medium mb-1">Admin Access</h2>
            <p className="text-[#8892b0] text-center text-sm mb-6">Enter your credentials to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[11px] tracking-wider uppercase text-[#8892b0] mb-1.5 block">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-3 px-4 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-[#4a5568]"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] tracking-wider uppercase text-[#8892b0] mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-[#4a5568]"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-amber-400 text-[#1a1a2e] font-semibold text-sm rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-[#4a5568] text-xs text-center mt-6">Protected area · Authorized personnel only</p>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-white truncate">Admin</p>
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
