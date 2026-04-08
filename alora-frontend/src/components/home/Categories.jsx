import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../utils/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {
        setCategories([
          { name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80' },
          { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80' },
          { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80' },
          { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
          { name: 'Party Wear', slug: 'party-wear', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=600&q=80' },
          { name: 'Gift Sets', slug: 'gift-sets', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80' },
        ]);
      });
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-ivory" id="categories">
      <div className="container-luxury">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-gold text-[10px] tracking-[5px] uppercase font-body mb-4">Explore</p>
          <h2 className="font-display text-3xl sm:text-[40px] font-semibold text-charcoal leading-tight">
            Shop by Category
          </h2>
          <div className="section-divider mt-5" />
        </div>

        {/* Grid — 3 columns with generous gap */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden aspect-4/5"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                />
                {/* Subtle gradient only at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-white tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1 group-hover:text-gold transition-colors duration-300 font-body">
                    Explore →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
