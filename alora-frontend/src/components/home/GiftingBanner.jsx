import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function GiftingBanner({ banner = {} }) {
  const image = banner.image || 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1600&q=85';
  const heading = banner.heading || 'The Perfect Gift Awaits';
  const subheading = banner.subheading || 'Find beautifully curated gifts for every budget';

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden" id="gifting">
      <div className="absolute inset-0">
        <img src={image} alt="Gifting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
      </div>

      <div className="relative container-luxury text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-gold text-[10px] tracking-[5px] uppercase font-body mb-5">Gifting</p>
          <h2 className="font-display text-3xl sm:text-[44px] md:text-[52px] font-semibold text-white leading-[1.1] mb-5">
            {heading}
          </h2>
          <p className="text-white/60 text-sm sm:text-base mb-10 font-body tracking-wide leading-relaxed">
            {subheading}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/shop?maxPrice=499">
              <Button variant="solid" size="md">Under ₹499</Button>
            </Link>
            <Link to="/shop?minPrice=499&maxPrice=999">
              <Button variant="white" size="md">₹499 — ₹999</Button>
            </Link>
            <Link to="/shop?minPrice=999">
              <Button variant="gold-outline" size="md">₹999+</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
