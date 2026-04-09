import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GiftingBanner({ banner = {} }) {
  const heading = banner.heading || 'Great design\nAccessible for all';
  const subheading = banner.subheading || 'Find beautifully curated gifts for every occasion and budget.';
  const image = banner.image || 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&q=85';

  return (
    <section className="relative overflow-hidden" style={{ padding: '100px 0', backgroundColor: '#f5f5f5' }} id="gifting">
      {/* Giant background text — Alukas "Collection" watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display font-medium whitespace-nowrap"
          style={{ fontSize: '220px', color: '#e8e8e8', letterSpacing: '0.02em' }}
        >
          Collection
        </span>
      </div>

      <div className="relative container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '60px' }}>
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={image}
              alt="Collection"
              className="w-full object-cover"
              style={{ height: '560px' }}
            />
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center lg:text-left"
          >
            <h2
              className="font-display font-medium text-charcoal whitespace-pre-line"
              style={{ fontSize: '33px', lineHeight: 1.2, marginBottom: '16px' }}
            >
              {heading}
            </h2>
            <p className="font-body text-[#777] leading-relaxed" style={{ fontSize: '16px', marginBottom: '28px', maxWidth: '420px' }}>
              {subheading}
            </p>
            <Link
              to="/shop"
              className="underline-link inline-block font-body"
              style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}
            >
              Shop the Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
