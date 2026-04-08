import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import { api } from '../../utils/api';
import { Quote } from 'lucide-react';

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
    <section className="py-20 sm:py-28 bg-ivory" id="testimonials">
      <div className="container-luxury">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-gold text-[10px] tracking-[5px] uppercase font-body mb-4">Testimonials</p>
          <h2 className="font-display text-3xl sm:text-[40px] font-semibold text-charcoal leading-tight">
            What Our Customers Say
          </h2>
          <div className="section-divider mt-5" />
        </div>

        {/* Cards — horizontal scroll with snap */}
        <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className="shrink-0 w-[300px] sm:w-[340px] bg-warm p-7 sm:p-8 border border-stone-100/80 snap-start"
            >
              <Quote size={20} className="text-gold/30 mb-4" strokeWidth={1} />
              <StarRating rating={review.rating} size={12} />
              <p className="mt-5 text-[13px] text-charcoal/70 leading-[1.8] font-body">
                "{review.text}"
              </p>
              <div className="mt-6 pt-5 border-t border-stone-100/60">
                <p className="font-body text-[13px] font-medium text-charcoal">{review.customerName}</p>
                <p className="text-[11px] text-gold/70 mt-0.5 font-body">{review.igHandle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
