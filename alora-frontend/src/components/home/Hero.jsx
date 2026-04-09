import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultSlides = [
  {
    lifestyleImage: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=960&q=85',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85',
    bgColor: '#C4A27D',
    headline: 'Elegance\nRedefined',
    subheadline: 'Discover our handcrafted collection of luxury jewellery',
    ctaText: 'Shop Collection',
    ctaLink: '/shop',
  },
  {
    lifestyleImage: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=960&q=85',
    productImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=85',
    bgColor: '#B8973A',
    headline: 'Adorn\nYour Story',
    subheadline: 'Timeless pieces for every moment that matters',
    ctaText: 'Shop Collection',
    ctaLink: '/shop',
  },
  {
    lifestyleImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=960&q=85',
    productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85',
    bgColor: '#9A8B7A',
    headline: 'The Gold\nEdit',
    subheadline: 'Premium gold-plated pieces starting at ₹599',
    ctaText: 'Shop Collection',
    ctaLink: '/shop?category=necklaces',
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

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden bg-white" style={{ height: '730px' }} id="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex"
        >
          {/* Left — Lifestyle Image (42%) */}
          <div className="hidden md:block relative w-[42%] overflow-hidden">
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              src={slide.lifestyleImage}
              alt={slide.headline}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Product Card — centered between halves */}
          <div className="hidden md:flex absolute left-[28%] top-1/2 -translate-y-1/2 z-10 w-[300px] h-[390px] bg-[#f5f5f5] items-center justify-center shadow-lg">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src={slide.productImage}
              alt="Product"
              className="w-[80%] h-[80%] object-contain"
            />
          </div>

          {/* Right — Colored bg + Text (58%) */}
          <div
            className="w-full md:w-[58%] flex items-center justify-center md:justify-start"
            style={{ backgroundColor: slide.bgColor }}
          >
            {/* Mobile fallback — full bg image */}
            <div className="absolute inset-0 md:hidden">
              <img src={slide.lifestyleImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 px-8 md:pl-[240px] lg:pl-[280px] max-w-[620px]"
            >
              <h2 className="font-display text-[40px] sm:text-[48px] lg:text-[56px] font-medium text-white leading-[1.1] whitespace-pre-line mb-4">
                {slide.headline}
              </h2>
              <p className="font-body text-white/70 text-[15px] leading-relaxed mb-8 max-w-sm">
                {slide.subheadline}
              </p>
              <Link to={slide.ctaLink || '/shop'}>
                <button className="py-[14px] px-[32px] bg-white text-charcoal text-[13px] tracking-[0.05em] uppercase font-body font-medium hover:bg-charcoal hover:text-white transition-all duration-300 cursor-pointer border border-white hover:border-charcoal">
                  {slide.ctaText}
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows — left/right edges */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft size={28} strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Next"
      >
        <ChevronRight size={28} strokeWidth={1} />
      </button>

      {/* Dots — bottom center */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[8px] rounded-full transition-all duration-400 ${
              i === current ? 'bg-white w-[28px]' : 'bg-white/40 w-[8px]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
