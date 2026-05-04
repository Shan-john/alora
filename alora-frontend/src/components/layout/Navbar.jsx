import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Collections", path: "/collections" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const params = new URLSearchParams({ search: trimmedQuery });
      navigate(`/shop?${params.toString()}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ═══ HEADER — 95px default, 65px sticky ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
        style={{
          height: isScrolled ? "65px" : "95px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <div className="container-luxury h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left — Search + Nav (desktop) */}
            <div className="flex items-center gap-8">
              {/* Search icon + text — Alukas style */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 text-charcoal hover:text-black transition-colors"
              >
                <Search size={18} strokeWidth={1.5} />
                <span className="text-[14px] font-body text-charcoal">
                  Search
                </span>
              </button>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-7">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `font-body text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 ${
                        isActive
                          ? "text-black"
                          : "text-charcoal hover:text-black"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Center — Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center flex-col"
            >
              <img
                src="/logo.png"
                alt="Alora by Trio"
                className="h-[46px] sm:h-[52px] w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
              <div className="hidden text-center">
                <span className="font-display text-[28px] sm:text-[32px] font-semibold text-charcoal tracking-wide leading-none block">
                  Alora
                </span>
                <span className="text-[8px] tracking-[4px] uppercase text-gold text-center -mt-0.5 font-body block">
                  by Trio
                </span>
              </div>
            </Link>

            {/* Right — Icons */}
            <div className="flex items-center gap-5">
              {/* Mobile search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="lg:hidden text-charcoal"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Cart / Wishlist Bag */}


              {/* Cart Bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-charcoal hover:text-black transition-colors"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-charcoal text-white text-[9px] font-body font-medium rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-charcoal"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer — matches header height */}
      <div style={{ height: "95px" }} />

      {/* ═══ SEARCH OVERLAY ═══ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white flex items-start justify-center pt-[120px]"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 text-charcoal hover:text-black"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
            <form onSubmit={handleSearch} className="w-full max-w-[600px] px-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-full py-4 border-b-2 border-charcoal bg-transparent text-charcoal text-[24px] font-display font-medium placeholder:text-[#ccc] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal"
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE DRAWER ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/30"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-[320px] bg-white overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#e5e5e5]">
                <span className="font-display text-[22px] font-semibold text-charcoal">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-charcoal"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="p-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3.5 border-b border-[#e5e5e5] text-[15px] font-body font-medium text-charcoal"
                  >
                    {link.name}
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#ccc]"
                    />
                  </Link>
                ))}
              </nav>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
