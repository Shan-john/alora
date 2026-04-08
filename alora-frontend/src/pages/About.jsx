import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Gem, Star } from 'lucide-react';

export default function About() {
  const { settings } = useOutletContext();
  const about = settings?.aboutPage || {};

  return (
    <>
      <Helmet>
        <title>About Us | Alora by Trio</title>
        <meta name="description" content="Learn about Alora by Trio — handcrafted luxury jewellery founded by three friends united by design and craftsmanship." />
      </Helmet>

      <div className="pt-20 sm:pt-24 bg-ivory">
        {/* Hero */}
        <div className="bg-charcoal py-16 sm:py-24 text-center">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">About Alora by Trio</h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto font-body px-4">
            Three friends, one dream — making luxury jewellery accessible to everyone.
          </p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={about.founderImage || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80'}
                alt="Founders"
                className="rounded-xl shadow-lg w-full aspect-[4/5] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-semibold text-charcoal mb-6">The Alora Story</h2>
              <p className="text-stone-600 leading-relaxed mb-6 font-body">
                {about.story || 'Alora by Trio was born from a shared passion for elegant, accessible luxury jewellery. Founded by three friends united by their love of design, craftsmanship, and the belief that everyone deserves to shine.'}
              </p>
              <p className="text-stone-600 leading-relaxed font-body">
                Every piece in our collection is carefully curated and crafted with attention to detail, using premium materials that stand the test of time. We believe that luxury should be accessible, personal, and joyful.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-warm py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-semibold text-charcoal text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: 'Made with Love', desc: 'Every piece is handpicked and quality-checked with care.' },
                { icon: Gem, title: 'Premium Quality', desc: 'We use only the finest materials — hypoallergenic and tarnish-resistant.' },
                { icon: Star, title: 'Customer First', desc: 'Your satisfaction is our priority. 7-day returns, no questions asked.' },
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <val.icon size={24} className="text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{val.title}</h3>
                  <p className="text-stone-500 text-sm font-body">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="py-16 sm:py-24 text-center max-w-3xl mx-auto px-4">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Our Mission</p>
          <blockquote className="font-display text-2xl sm:text-3xl text-charcoal leading-relaxed italic">
            "{about.mission || 'To make premium jewellery accessible and sustainable, one beautiful piece at a time.'}"
          </blockquote>
        </div>
      </div>
    </>
  );
}
