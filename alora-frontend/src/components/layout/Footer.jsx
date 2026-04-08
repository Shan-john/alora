import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/Icons';

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear();
  const igHandle = settings.igHandle || 'alorabytrio';
  const whatsappNumber = settings.whatsappNumber || '919497711275';

  return (
    <footer className="bg-charcoal text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl font-semibold text-white mb-2">Alora</h3>
            <p className="text-[10px] tracking-[3px] uppercase text-gold mb-4">by Trio</p>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {settings.tagline || 'Luxury Jewellery & Lifestyle. Handcrafted pieces for every moment that matters.'}
            </p>
            <div className="flex items-center space-x-4">
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-warm transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-warm transition-all duration-300"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:hello@alorabytrio.com"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-warm transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm tracking-widest uppercase text-white font-body mb-6">Quick Links</h4>
            <div className="space-y-3">
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
                  className="block text-stone-400 hover:text-gold text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-widest uppercase text-white font-body mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-stone-400 hover:text-gold transition-colors text-sm"
              >
                <Instagram size={16} className="text-gold" />
                <span>@{igHandle}</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-stone-400 hover:text-gold transition-colors text-sm"
              >
                <MessageCircle size={16} className="text-gold" />
                <span>+{whatsappNumber.replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3')}</span>
              </a>
              <div className="flex items-center space-x-3 text-stone-400 text-sm">
                <Mail size={16} className="text-gold" />
                <span>hello@alorabytrio.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-stone-500 text-xs">
            © {year} Alora by Trio. All rights reserved.
          </p>
          <p className="text-stone-600 text-xs mt-2 sm:mt-0">
            Made with ♥ in India
          </p>
        </div>
      </div>

      {/* Fixed WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        id="whatsapp-float"
      >
        <MessageCircle size={24} className="text-white" />
      </a>
    </footer>
  );
}
