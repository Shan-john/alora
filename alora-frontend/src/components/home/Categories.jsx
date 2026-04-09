import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../utils/api';

/* Alukas-style thin line SVG icons — 60px */
const categoryIcons = {
  necklaces: (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M17 14C17 14 17 34 30 44C43 34 43 14 43 14" />
      <circle cx="30" cy="44" r="5" />
      <path d="M12 9h36" />
    </svg>
  ),
  earrings: (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M22 10v7a7 7 0 0 1-7 7v0a7 7 0 0 1 7 7v7" />
      <path d="M38 10v7a7 7 0 0 0 7 7v0a7 7 0 0 0-7 7v7" />
      <circle cx="22" cy="44" r="4" />
      <circle cx="38" cy="44" r="4" />
    </svg>
  ),
  bracelets: (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <ellipse cx="30" cy="30" rx="20" ry="15" />
      <ellipse cx="30" cy="30" rx="15" ry="10" />
    </svg>
  ),
  rings: (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <ellipse cx="30" cy="38" rx="13" ry="10" />
      <path d="M24 14l6-5 6 5" />
      <path d="M22 28l8-14 8 14" />
    </svg>
  ),
  'party-wear': (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M20 8l10 40 10-40" />
      <path d="M14 20h32" />
      <circle cx="30" cy="30" r="4" />
    </svg>
  ),
  'gift-sets': (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="10" y="25" width="40" height="25" rx="1" />
      <rect x="15" y="15" width="30" height="10" rx="1" />
      <path d="M30 15v35" />
      <path d="M10 30h40" />
      <path d="M20 15c0-5 5-8 10-5" />
      <path d="M40 15c0-5-5-8-10-5" />
    </svg>
  ),
};

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {
        setCategories([
          { name: 'Necklaces', slug: 'necklaces' },
          { name: 'Earrings', slug: 'earrings' },
          { name: 'Bracelets', slug: 'bracelets' },
          { name: 'Rings', slug: 'rings' },
          { name: 'Party Wear', slug: 'party-wear' },
        ]);
      });
  }, []);

  const visibleCategories = categories.filter((cat) => cat.slug !== 'gift-sets');

  return (
    <section
      className="bg-white"
      style={{ padding: '40px 0', borderBottom: '1px solid #e5e5e5' }}
      id="categories"
    >
      <div className="container-luxury">
        <div className="flex items-center justify-center gap-[40px] sm:gap-[60px] md:gap-[80px] overflow-x-auto no-scrollbar">
          {visibleCategories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 text-center min-w-[70px]"
              >
                <div className="text-charcoal group-hover:text-gold transition-colors duration-300">
                  {categoryIcons[cat.slug] || categoryIcons.necklaces}
                </div>
                <span className="text-[13px] tracking-[0.15em] uppercase font-body font-medium text-charcoal group-hover:text-gold transition-colors duration-300 whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
