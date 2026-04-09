import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../utils/api';
import ProductCard from '../shop/ProductCard';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts({ isBestSeller: true, limit: 4 })
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-white" style={{ padding: '80px 0' }} id="bestsellers">
      <div className="container-luxury">
        {/* Asymmetric layout: heading+products left, lifestyle image right */}
        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '30px' }}>
          {/* Left — Heading + 2x2 product grid (7 cols) */}
          <div className="lg:col-span-7">
            <div style={{ marginBottom: '40px' }}>
              <h2 className="font-display text-[33px] font-medium text-charcoal leading-[1.15]">
                Soak up the Savings
              </h2>
              <p className="font-body text-[#777] text-[16px] leading-relaxed" style={{ marginTop: '12px', maxWidth: '380px' }}>
                Our jewellery is manufactured in our state-of-the-art workshop.
              </p>
              <Link
                to="/shop?sort=best-seller"
                className="btn-outline inline-block"
                style={{ marginTop: '20px' }}
              >
                Shop Now
              </Link>
            </div>

            {/* 2×2 product grid */}
            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
              {products.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Lifestyle image (5 cols) */}
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky"
              style={{ top: '120px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85"
                alt="Lifestyle"
                className="w-full object-cover"
                style={{ height: '640px' }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
