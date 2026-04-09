import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import { api } from '../../utils/api';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api.getReviews('homepage')
      .then(data => setReviews(data.reviews || []))
      .catch(() => {
        setReviews([
          { customerName: 'Priya S.', igHandle: '@priya.s', rating: 5, text: 'Absolutely love my necklace from Alora! The quality is incredible for the price. Every detail is perfect.' },
          { customerName: 'Ananya M.', igHandle: '@ananya.m', rating: 5, text: 'The gift set was packaged so beautifully — my sister was thrilled! Will definitely order again.' },
          { customerName: 'Riya P.', igHandle: '@riyaapatel', rating: 4, text: 'Super fast delivery and the earrings are gorgeous. They go with literally everything I own.' },
          { customerName: 'Kavya N.', igHandle: '@kavya.n', rating: 5, text: "I'm obsessed with the twisted cuff bracelet! Best jewellery purchase I've ever made, hands down." },
        ]);
      });
  }, []);

  if (reviews.length === 0) return null;

  const review = reviews[active];

  return (
    <section className="bg-white" style={{ padding: '90px 0' }} id="testimonials">
      <div className="container-luxury">
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          {/* Section label */}
          <p className="font-body uppercase" style={{ fontSize: '13px', letterSpacing: '0.15em', color: '#777', marginBottom: '16px' }}>
            Testimonials
          </p>

          {/* Quote icon */}
          <Quote size={32} strokeWidth={1} style={{ color: '#ddd', margin: '0 auto 24px', display: 'block' }} />

          {/* Review — animated */}
          <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <StarRating rating={review.rating} size={14} />
            <p
              className="font-display italic text-charcoal"
              style={{ fontSize: '24px', lineHeight: 1.6, marginTop: '20px', marginBottom: '24px' }}
            >
              "{review.text}"
            </p>
            <p className="font-body text-charcoal" style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.03em' }}>
              {review.customerName}
            </p>
            <p className="font-body" style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>
              {review.igHandle}
            </p>
          </motion.div>

          {/* Nav arrows */}
          <div className="flex items-center justify-center" style={{ gap: '16px', marginTop: '36px' }}>
            <button
              onClick={() => setActive((active - 1 + reviews.length) % reviews.length)}
              className="flex items-center justify-center text-[#999] hover:text-charcoal hover:border-charcoal transition-all duration-300"
              style={{ width: '40px', height: '40px', border: '1px solid #e5e5e5' }}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <span className="font-body" style={{ fontSize: '13px', color: '#aaa', minWidth: '40px', textAlign: 'center' }}>
              {String(active + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => setActive((active + 1) % reviews.length)}
              className="flex items-center justify-center text-[#999] hover:text-charcoal hover:border-charcoal transition-all duration-300"
              style={{ width: '40px', height: '40px', border: '1px solid #e5e5e5' }}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
