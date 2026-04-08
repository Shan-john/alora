import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../common/Icons';

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
    <section className="py-20 sm:py-28 bg-ivory" id="instagram">
      <div className="container-luxury">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <InstagramIcon size={16} className="text-gold" />
            <p className="text-gold text-[10px] tracking-[5px] uppercase font-body">@alorabytrio</p>
          </div>
          <h2 className="font-display text-3xl sm:text-[40px] font-semibold text-charcoal leading-tight">
            As Seen on Instagram
          </h2>
          <div className="section-divider mt-5" />
        </div>

        {/* Grid — clean, tight, curated */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {posts.slice(0, 6).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden cursor-pointer"
            >
              <img
                src={post.imageUrl}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-400 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <InstagramIcon size={20} className="text-white" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/alorabytrio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-body text-gold hover:text-charcoal transition-colors duration-300"
          >
            Follow Us on Instagram
            <span className="text-lg leading-none">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
