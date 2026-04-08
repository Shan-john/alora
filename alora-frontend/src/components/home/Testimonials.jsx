import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import { api } from '../../utils/api';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.getReviews('homepage')
      .then(data => setReviews(data.reviews || []))
      .catch(() => {
        setReviews([
          { customerName: 'Priya S.', igHandle: '@priya.s', rating: 5, text: 'Absolutely love my necklace from Alora! The quality is incredible for the price.' },
          { customerName: 'Ananya M.', igHandle: '@ananya.m', rating: 5, text: 'The gift set was packaged so beautifully — my sister was thrilled!' },
          { customerName: 'Riya P.', igHandle: '@riyaapatel', rating: 4, text: 'Super fast delivery and the earrings are gorgeous. They go with literally everything.' },
          { customerName: 'Kavya N.', igHandle: '@kavya.n', rating: 5, text: "I'm obsessed with the twisted cuff bracelet! Best jewellery purchase ever!" },
        ]);
      });
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-ivory" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Reviews</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">What Our Customers Say</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 bg-warm rounded-xl p-6 border border-stone-100"
            >
              <StarRating rating={review.rating} size={14} />
              <p className="mt-4 text-sm text-charcoal/80 leading-relaxed line-clamp-3">
                "{review.text}"
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="font-body text-sm font-medium text-charcoal">{review.customerName}</p>
                <p className="text-xs text-gold">{review.igHandle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
