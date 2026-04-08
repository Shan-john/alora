import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&q=85',
    headline: 'Elegance\nRedefined',
    subheadline: 'Discover our handcrafted collection of luxury jewellery',
    cta1Text: 'Shop Now',
    cta1Link: '/shop',
    cta2Text: 'New Arrivals',
    cta2Link: '/shop?sort=newest',
  },
  {
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=1920&q=85',
    headline: 'Adorn\nYour Story',
    subheadline: 'Timeless pieces for every moment that matters',
    cta1Text: 'Explore',
    cta1Link: '/shop',
    cta2Text: 'Gift Sets',
    cta2Link: '/shop?category=gift-sets',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=85',
    headline: 'The Gold\nEdit',
    subheadline: 'Premium gold-plated pieces starting at ₹599',
    cta1Text: 'Shop Gold',
    cta1Link: '/shop?category=necklaces',
    cta2Text: 'Best Sellers',
    cta2Link: '/shop',
  },
];

export default function Hero({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const heroSlides = slides.length > 0 ? slides : defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden" id="hero">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[current].image}
            alt={heroSlides[current].headline}
            className="w-full h-full object-cover"
          />
          {/* Layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content — bottom-left on desktop, center on mobile */}
      <div className="absolute inset-0 flex items-end sm:items-end justify-start">
        <div className="w-full sm:max-w-2xl px-6 sm:px-12 lg:px-16 pb-24 sm:pb-28 lg:pb-32 text-center sm:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-display text-[42px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-semibold text-white leading-[1.05] tracking-[0.01em] whitespace-pre-line mb-5">
                {heroSlides[current].headline}
              </h2>
              <p className="font-body text-white/70 text-sm sm:text-base tracking-wide mb-8 max-w-md mx-auto sm:mx-0 leading-relaxed">
                {heroSlides[current].subheadline}
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Link to={heroSlides[current].cta1Link || '/shop'}>
                  <Button variant="solid" size="lg">
                    {heroSlides[current].cta1Text}
                  </Button>
                </Link>
                <Link to={heroSlides[current].cta2Link || '/shop'}>
                  <Button variant="white" size="lg">
                    {heroSlides[current].cta2Text}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Minimal nav arrows — right side, vertically stacked */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <button
          onClick={prevSlide}
          className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide indicator — bottom right, thin line style */}
      <div className="absolute bottom-10 right-6 sm:right-10 flex items-center gap-2">
        <span className="text-white/40 text-[11px] font-body tracking-wider">
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="w-12 h-px bg-white/20 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gold"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            key={current}
          />
        </div>
        <span className="text-white/40 text-[11px] font-body tracking-wider">
          {String(heroSlides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
