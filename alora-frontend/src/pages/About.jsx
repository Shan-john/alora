import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Gem, Star } from 'lucide-react';

const defaultValues = [
  { icon: 'Heart', title: 'Made with Love', desc: 'Every piece is handpicked and undergoes rigorous quality checks to ensure perfection.' },
  { icon: 'Gem', title: 'Premium Quality', desc: 'Crafted utilizing only the finest materials - always hypoallergenic and tarnish-resistant.' },
  { icon: 'Star', title: 'Customer First', desc: 'Your satisfaction is our ultimate priority. Enjoy hassle-free 7-day returns, no questions asked.' },
];

const iconMap = { Heart, Gem, Star };

export default function About() {
  const { settings } = useOutletContext();
  const about = settings?.aboutPage || {};
  const values = Array.isArray(about.values) && about.values.length ? about.values : defaultValues;

  return (
    <>
      <Helmet>
        <title>About Us | Alora by Trio</title>
        <meta name="description" content="Learn about Alora by Trio - handcrafted luxury jewellery founded by three friends united by design and craftsmanship." />
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f8f8f8]">
        <div className="w-full mb-10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#666] font-body bg-transparent">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <span className="text-[#aaa]">&gt;</span>
              <span className="text-black font-medium">About Us</span>
            </div>
          </div>
        </div>

        <div className="bg-charcoal py-16 sm:py-24 text-center">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">{about.heroEyebrow || 'Our Story'}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stone-50 mb-12">{about.heroTitle || 'About Alora by Trio'}</h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto font-body px-4">
            {about.heroSubtitle || 'Three friends, one dream - making luxury jewellery accessible to everyone.'}
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src={about.founderImage || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80'}
                alt="Founders"
                className="w-full aspect-[4/5] object-cover mix-blend-multiply"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-[32px] md:text-[38px] text-[#222] font-normal mb-8">{about.storyTitle || 'The Alora Story'}</h2>
              <div className="text-[#666] text-[15px] font-body leading-[1.8] space-y-6">
                <p>
                  {about.story || 'Alora by Trio was born from a shared passion for elegant, accessible luxury jewellery. Founded by three friends united by their love of design, craftsmanship, and the belief that everyone deserves to shine.'}
                </p>
                <p>
                  {about.storySecondary || 'Every piece in our collection is carefully curated and crafted with strict attention to detail. We utilize premium materials that stand the test of time, ensuring each piece is as enduring as the moments they commemorate. We believe that true luxury should be personal, joyful, and above all, accessible.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="bg-white py-24 border-y border-[#e5e5e5]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12">
            <h2 className="font-display text-[32px] md:text-[38px] text-[#222] font-normal text-center mb-16">{about.dedicationTitle || 'Our Dedication'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {values.map((value, index) => {
                const Icon = iconMap[value.icon] || Heart;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-[70px] h-[70px] rounded-full border border-[#e5e5e5] flex items-center justify-center mb-6">
                      <Icon size={26} strokeWidth={1} className="text-[#222]" />
                    </div>
                    <h3 className="font-display text-[20px] font-medium text-[#222] mb-3">{value.title}</h3>
                    <p className="text-[#666] text-[14px] font-body leading-[1.7] max-w-xs">{value.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-24 text-center max-w-[800px] mx-auto px-6">
          <p className="text-[#B8973A] text-[12px] tracking-[0.2em] uppercase font-body font-semibold mb-6">{about.missionLabel || 'Our Mission'}</p>
          <blockquote className="font-display text-[24px] md:text-[30px] text-[#222] leading-[1.6] italic">
            "{about.mission || 'To make premium jewellery accessible, elegant, and sustainable - one beautiful piece at a time.'}"
          </blockquote>
        </div>
      </div>
    </>
  );
}
