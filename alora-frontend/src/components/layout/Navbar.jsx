import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?sort=newest' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const [wishlistCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('alora_wishlist') || '[]').length;
    } catch { return 0; }
  });

  const textColor = isScrolled || !isHome ? 'text-charcoal' : 'text-white';
  const hoverColor = isScrolled || !isHome ? 'hover:text-gold' : 'hover:text-gold-light';
  const subtextColor = isScrolled || !isHome ? 'text-gold' : 'text-gold-light';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled || !isHome
            ? 'bg-ivory/95 backdrop-blur-xl border-b border-stone-200/40'
            : 'bg-transparent'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-[72px] sm:h-[84px]">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2"
              id="mobile-menu-toggle"
            >
              <Menu size={20} strokeWidth={1.5} className={textColor} />
            </button>

            {/* Left nav links */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.slice(0, 2).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] tracking-[0.2em] uppercase font-body gold-underline transition-colors duration-300 ${textColor} ${hoverColor}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Logo — center */}
            <Link to="/" className="text-center group">
              <h1
                className={`font-display text-[26px] sm:text-[30px] font-semibold tracking-[0.04em] transition-colors duration-500 ${textColor}`}
              >
                Alora
              </h1>
              <p
                className={`text-[8px] tracking-[4px] uppercase -mt-1.5 transition-colors duration-500 font-body font-medium ${subtextColor}`}
              >
                by Trio
              </p>
            </Link>

            {/* Right nav links */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.slice(2).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] tracking-[0.2em] uppercase font-body gold-underline transition-colors duration-300 ${textColor} ${hoverColor}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 transition-colors duration-300 ${textColor} ${hoverColor}`}
                id="search-toggle"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                to="/wishlist"
                className={`relative p-2.5 transition-colors duration-300 hidden sm:block ${textColor} ${hoverColor}`}
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0.5 w-3.5 h-3.5 bg-gold text-warm text-[8px] flex items-center justify-center rounded-full font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2.5 transition-colors duration-300 ${textColor} ${hoverColor}`}
                id="cart-toggle"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-0.5 w-3.5 h-3.5 bg-gold text-warm text-[8px] flex items-center justify-center rounded-full font-medium">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className={`p-2.5 transition-colors duration-300 hidden sm:block ${textColor} ${hoverColor}`}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed top-0 left-0 h-full w-[320px] bg-ivory z-50 shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-stone-200/40">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-charcoal">Alora</h2>
                    <p className="text-[8px] tracking-[4px] uppercase text-gold -mt-1 font-body">by Trio</p>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
                    <X size={20} strokeWidth={1.5} className="text-charcoal" />
                  </button>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center justify-between py-3.5 px-3 text-charcoal hover:text-gold text-[11px] tracking-[0.2em] uppercase font-body transition-colors duration-300"
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={14} strokeWidth={1.5} className="text-stone-300" />
                    </Link>
                  ))}

                  <div className="my-4 h-px bg-stone-200/60" />

                  <Link
                    to={user ? '/account' : '/login'}
                    className="flex items-center justify-between py-3.5 px-3 text-charcoal hover:text-gold text-[11px] tracking-[0.2em] uppercase font-body transition-colors duration-300"
                  >
                    <span>{user ? 'My Account' : 'Sign In'}</span>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-stone-300" />
                  </Link>
                  <Link
                    to="/track"
                    className="flex items-center justify-between py-3.5 px-3 text-charcoal hover:text-gold text-[11px] tracking-[0.2em] uppercase font-body transition-colors duration-300"
                  >
                    <span>Track Order</span>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-stone-300" />
                  </Link>

                  {isAdmin && (
                    <>
                      <div className="my-4 h-px bg-stone-200/60" />
                      <Link
                        to="/admin"
                        className="flex items-center justify-between py-3.5 px-3 text-gold text-[11px] tracking-[0.2em] uppercase font-body font-medium transition-colors duration-300"
                      >
                        <span>Admin Panel</span>
                        <ChevronRight size={14} strokeWidth={1.5} className="text-gold/40" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl mx-6"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  className="w-full py-5 pl-14 pr-14 bg-ivory text-charcoal text-base font-body focus:outline-none focus:ring-1 focus:ring-gold/30 placeholder:text-stone-400 tracking-wide"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setIsSearchOpen(false);
                      window.location.href = `/shop?search=${encodeURIComponent(e.target.value)}`;
                    }
                    if (e.key === 'Escape') setIsSearchOpen(false);
                  }}
                  id="search-input"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-stone-500 text-[11px] tracking-wider text-center mt-5 uppercase">
                Press Enter to search · Esc to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
