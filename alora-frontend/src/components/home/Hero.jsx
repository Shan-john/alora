import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80',
    headline: 'Elegance Redefined',
    subheadline: 'Discover our handcrafted collection of luxury jewellery',
    cta1Text: 'Shop Now',
    cta1Link: '/shop',
    cta2Text: 'New Arrivals',
    cta2Link: '/shop?sort=newest',
  },
  {
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=1600&q=80',
    headline: 'Adorn Your Story',
    subheadline: 'Timeless pieces for every moment that matters',
    cta1Text: 'Explore',
    cta1Link: '/shop',
    cta2Text: 'Gift Sets',
    cta2Link: '/shop?category=gift-sets',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80',
    headline: 'The Gold Edit',
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
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden" id="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[current].image}
            alt={heroSlides[current].headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl md:text-[60px] font-semibold text-white leading-tight mb-4">
                {heroSlides[current].headline}
              </h2>
              <p className="font-body text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                {heroSlides[current].subheadline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={heroSlides[current].cta1Link || '/shop'}>
                  <Button variant="solid" size="lg">
                    {heroSlides[current].cta1Text}
                  </Button>
                </Link>
                <Link to={heroSlides[current].cta2Link || '/shop'}>
                  <Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-charcoal">
                    {heroSlides[current].cta2Text}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-gold w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
