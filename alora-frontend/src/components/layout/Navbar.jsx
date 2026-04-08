import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
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
      const wl = JSON.parse(localStorage.getItem('alora_wishlist') || '[]');
      return wl.length;
    } catch { return 0; }
  });

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHome
          ? 'bg-ivory/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              id="mobile-menu-toggle"
            >
              <Menu size={22} className={isScrolled || !isHome ? 'text-charcoal' : 'text-white'} />
            </button>

            {/* Left nav links (desktop) */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 2).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm tracking-wider uppercase font-body gold-underline transition-colors ${
                    isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link to="/" className="text-center">
              <h1 className={`font-display text-2xl sm:text-[26px] font-semibold tracking-wide transition-colors ${
                isScrolled || !isHome ? 'text-charcoal' : 'text-white'
              }`}>
                Alora
              </h1>
              <p className={`text-[9px] tracking-[3px] uppercase -mt-1 transition-colors ${
                isScrolled || !isHome ? 'text-gold' : 'text-gold-light'
              }`}>
                by Trio
              </p>
            </Link>

            {/* Right nav links (desktop) */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(2).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm tracking-wider uppercase font-body gold-underline transition-colors ${
                    isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors ${isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white hover:text-gold-light'}`}
                id="search-toggle"
              >
                <Search size={20} />
              </button>

              <Link
                to="/wishlist"
                className={`relative p-2 transition-colors hidden sm:block ${isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white hover:text-gold-light'}`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-warm text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-colors ${isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white hover:text-gold-light'}`}
                id="cart-toggle"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-warm text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className={`p-2 transition-colors hidden sm:block ${isScrolled || !isHome ? 'text-charcoal hover:text-gold' : 'text-white hover:text-gold-light'}`}
              >
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-ivory z-50 shadow-2xl lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-charcoal">Alora</h2>
                    <p className="text-[9px] tracking-[3px] uppercase text-gold -mt-1">by Trio</p>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                    <X size={22} className="text-charcoal" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block py-3 px-4 text-charcoal hover:text-gold hover:bg-gold/5 rounded-lg text-sm tracking-wider uppercase font-body transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="my-4 border-stone-200" />
                  <Link
                    to={user ? '/account' : '/login'}
                    className="block py-3 px-4 text-charcoal hover:text-gold hover:bg-gold/5 rounded-lg text-sm tracking-wider uppercase font-body transition-colors"
                  >
                    {user ? 'My Account' : 'Sign In'}
                  </Link>
                  <Link
                    to="/track"
                    className="block py-3 px-4 text-charcoal hover:text-gold hover:bg-gold/5 rounded-lg text-sm tracking-wider uppercase font-body transition-colors"
                  >
                    Track Order
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-3 px-4 text-gold font-medium hover:bg-gold/5 rounded-lg text-sm tracking-wider uppercase font-body transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/90 z-50 flex items-start justify-center pt-32"
            onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  className="w-full py-4 pl-12 pr-12 bg-white rounded-lg text-lg font-body focus:outline-none focus:ring-2 focus:ring-gold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setIsSearchOpen(false);
                      window.location.href = `/shop?search=${encodeURIComponent(e.target.value)}`;
                    }
                  }}
                  id="search-input"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-stone-400 text-sm text-center mt-4">Press Enter to search or Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
