import { Link } from 'react-router-dom';
import { MessageCircle, Mail } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/Icons';

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear();
  const igHandle = settings.igHandle || 'alorabytrio';
  const whatsappNumber = settings.whatsappNumber || '919497711275';

  return (
    <footer className="bg-charcoal text-stone-400">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container-luxury py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand — spans 4 columns */}
          <div className="md:col-span-4">
            <h3 className="font-display text-3xl font-semibold text-white tracking-wide mb-1">Alora</h3>
            <p className="text-[8px] tracking-[4px] uppercase text-gold mb-5 font-body">by Trio</p>
            <p className="text-stone-500 text-[13px] leading-[1.8] mb-8 font-body max-w-xs">
              {settings.tagline || 'Luxury Jewellery & Lifestyle. Handcrafted pieces for every moment that matters.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-stone-700 flex items-center justify-center text-stone-500 hover:border-gold hover:text-gold transition-all duration-300"
              >
                <Instagram size={15} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-stone-700 flex items-center justify-center text-stone-500 hover:border-gold hover:text-gold transition-all duration-300"
              >
                <MessageCircle size={15} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:hello@alorabytrio.com"
                className="w-9 h-9 border border-stone-700 flex items-center justify-center text-stone-500 hover:border-gold hover:text-gold transition-all duration-300"
              >
                <Mail size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links — spans 3 columns */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-body mb-7">Quick Links</h4>
            <div className="space-y-3.5">
              {[
                { name: 'Shop All', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Track Order', path: '/track' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Returns & Exchanges', path: '/returns' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-stone-500 hover:text-gold text-[13px] transition-colors duration-300 font-body"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — spans 5 columns */}
          <div className="md:col-span-5">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-body mb-7">Get in Touch</h4>
            <div className="space-y-4">
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-500 hover:text-gold transition-colors duration-300 text-[13px] font-body"
              >
                <Instagram size={14} className="text-gold/60" />
                <span>@{igHandle}</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-500 hover:text-gold transition-colors duration-300 text-[13px] font-body"
              >
                <MessageCircle size={14} strokeWidth={1.5} className="text-gold/60" />
                <span>+{whatsappNumber.replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3')}</span>
              </a>
              <div className="flex items-center gap-3 text-stone-500 text-[13px] font-body">
                <Mail size={14} strokeWidth={1.5} className="text-gold/60" />
                <span>hello@alorabytrio.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-600 text-[11px] tracking-wider font-body">
            © {year} Alora by Trio. All rights reserved.
          </p>
          <p className="text-stone-700 text-[11px] tracking-wider font-body">
            Made with ♥ in India
          </p>
        </div>
      </div>

      {/* Fixed WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 flex items-center justify-center transition-all duration-300 hover:scale-105 rounded-full"
        id="whatsapp-float"
      >
        <MessageCircle size={22} className="text-white" strokeWidth={1.5} />
      </a>
    </footer>
  );
}
