import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function GiftingBanner({ banner = {} }) {
  const image = banner.image || 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1600&q=80';
  const heading = banner.heading || 'The Perfect Gift Awaits';
  const subheading = banner.subheading || 'Find beautifully curated gifts for every budget';

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="gifting">
      <div className="absolute inset-0">
        <img src={image} alt="Gifting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4">
            {heading}
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 font-body">
            {subheading}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/shop?maxPrice=499">
              <Button variant="solid" size="md">Under ₹499</Button>
            </Link>
            <Link to="/shop?minPrice=499&maxPrice=999">
              <Button variant="outline" size="md" className="!border-white !text-white hover:!bg-white hover:!text-charcoal">
                ₹499 — ₹999
              </Button>
            </Link>
            <Link to="/shop?minPrice=999">
              <Button variant="outline" size="md" className="!border-gold !text-gold hover:!bg-gold hover:!text-warm">
                ₹999+
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
