import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../utils/api';
import ProductCard from '../shop/ProductCard';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts({ isBestSeller: true, limit: 8 })
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-warm" id="bestsellers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Most Loved</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">Our Best Sellers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
