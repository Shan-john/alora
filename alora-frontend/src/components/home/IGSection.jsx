import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function IGSection({ igPosts = [] }) {
  const defaultPosts = [
    { imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=400&q=80', isVisible: true },
    { imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', isVisible: true },
    { imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80', isVisible: true },
    { imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', isVisible: true },
    { imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', isVisible: true },
    { imageUrl: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80', isVisible: true },
  ];

  const posts = (igPosts.length > 0 ? igPosts : defaultPosts).filter(p => p.isVisible !== false);

  return (
    <section className="py-16 sm:py-20 bg-ivory" id="instagram">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">@alora.trio</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">As Seen on Instagram</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {posts.slice(0, 6).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={post.imageUrl}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-300 flex items-center justify-center">
                <Link
                  to={post.productId ? `/product/${post.productId}` : '/shop'}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs tracking-wider uppercase font-body bg-gold/80 px-3 py-2 rounded"
                >
                  Shop the Look →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
