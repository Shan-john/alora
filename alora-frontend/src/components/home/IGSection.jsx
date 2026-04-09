import { motion } from 'framer-motion';
import { InstagramIcon } from '../common/Icons';

export default function IGSection({ igPosts = [] }) {
  if (!igPosts || igPosts.length === 0) return null;

  const posts = igPosts;

  return (
    <section className="bg-white" id="instagram">
      {/* Handle — centered above grid */}
      <div className="text-center" style={{ padding: '50px 0 30px' }}>
        <a
          href="https://www.instagram.com/alorabytrio/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-body transition-colors duration-300 hover:text-gold"
          style={{ gap: '8px', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777' }}
        >
          <InstagramIcon size={16} />
          @alorabytrio
        </a>
      </div>

      {/* Full-bleed edge-to-edge — NO gaps, NO padding — Alukas exact */}
      <div className="grid grid-cols-3 sm:grid-cols-6">
        {posts.slice(0, 6).map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative aspect-square overflow-hidden cursor-pointer"
          >
            <img
              src={post.imageUrl}
              alt={`Instagram ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 text-white">
                <InstagramIcon size={24} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
