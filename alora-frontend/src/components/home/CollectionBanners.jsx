import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const defaultBanners = [
  {
    title: 'New Necklace\nCollection',
    subtitle: 'Catch the highlight in the room',
    cta: 'Shop More',
    link: '/shop?category=necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85',
  },
  {
    title: 'Culture of\nRing Design',
    subtitle: 'Handcrafted with precision & love',
    cta: 'Shop More',
    link: '/shop?category=rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=85',
  },
];

export default function CollectionBanners({ banners = [] }) {
  const items = banners.length > 0 ? banners : defaultBanners;

  return (
    <section className="bg-white" style={{ padding: '50px 0 30px' }} id="collection-banners">
      <div className="container-luxury">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '30px' }}>
          {items.map((banner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
            >
              <Link
                to={banner.link}
                className="group relative block overflow-hidden"
                style={{ height: '420px' }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                />
                {/* Light gradient from left */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />

                {/* Text — top left, 30px inset */}
                <div className="absolute" style={{ top: '30px', left: '30px' }}>
                  <h3 className="font-display text-[28px] font-medium text-charcoal leading-[1.2] whitespace-pre-line" style={{ marginBottom: '8px' }}>
                    {banner.title}
                  </h3>
                  <p className="font-body text-[#777] text-[16px]" style={{ marginBottom: '20px' }}>
                    {banner.subtitle}
                  </p>
                  <span className="btn-outline inline-block">
                    {banner.cta}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
