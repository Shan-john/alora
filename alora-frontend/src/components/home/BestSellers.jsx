import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import ProductCard from '../shop/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts({ isBestSeller: true, limit: 8 })
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-warm" id="bestsellers">
      <div className="container-luxury">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-14 sm:mb-16 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gold text-[10px] tracking-[5px] uppercase font-body mb-4">Most Loved</p>
            <h2 className="font-display text-3xl sm:text-[40px] font-semibold text-charcoal leading-tight">
              Our Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=best-seller"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-body text-gold hover:text-charcoal transition-colors duration-300"
          >
            View All <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
