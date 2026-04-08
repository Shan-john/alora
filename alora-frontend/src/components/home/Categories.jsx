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
    <section className="py-16 sm:py-20 bg-ivory" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Explore</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">Shop by Category</h2>
        </div>

        {/* Desktop grid / Mobile horizontal scroll */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-lg aspect-[4/5]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">{cat.name}</h3>
                  <p className="text-white/70 text-xs tracking-wider uppercase mt-1 group-hover:text-gold transition-colors">
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
