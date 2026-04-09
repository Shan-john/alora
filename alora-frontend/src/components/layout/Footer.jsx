import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/Icons';

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear();
  const igHandle = settings.igHandle || 'alorabytrio';
  const whatsappNumber = settings.whatsappNumber || '919497711275';

  return (
    <footer className="bg-white text-charcoal" style={{ borderTop: '1px solid #e5e5e5' }}>
      {/* Main Footer — 72px padding (Alukas 4.5rem) */}
      <div className="container-luxury" style={{ padding: '72px 15px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '40px' }}>
          {/* Col 1: Company */}
          <div>
            <h4 className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Track Order', path: '/track' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Returns Policy', path: '/returns' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body transition-colors duration-300 hover:text-charcoal"
                  style={{ fontSize: '15px', color: '#777' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Information */}
          <div>
            <h4 className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>
              Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'My Account', path: '/account' },
                { name: 'Wishlist', path: '/wishlist' },
                { name: 'Shopping Cart', path: '/cart' },
                { name: 'FAQs', path: '/faq' },
                { name: 'Compare', path: '/compare' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body transition-colors duration-300 hover:text-charcoal"
                  style={{ fontSize: '15px', color: '#777' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Category */}
          <div>
            <h4 className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Necklaces', path: '/shop?category=necklaces' },
                { name: 'Earrings', path: '/shop?category=earrings' },
                { name: 'Bracelets', path: '/shop?category=bracelets' },
                { name: 'Rings', path: '/shop?category=rings' },
                { name: 'Gift Sets', path: '/shop?category=gift-sets' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body transition-colors duration-300 hover:text-charcoal"
                  style={{ fontSize: '15px', color: '#777' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Phone */}
              <div>
                <p className="font-body" style={{ fontSize: '13px', color: '#aaa', marginBottom: '4px' }}>Need Any Help?</p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center font-body text-charcoal hover:text-gold transition-colors"
                  style={{ gap: '8px', fontSize: '18px', fontWeight: 600 }}
                >
                  <Phone size={18} strokeWidth={1.5} />
                  +91 94977 11275
                </a>
              </div>
              {/* Instagram */}
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-body hover:text-gold transition-colors"
                style={{ gap: '8px', fontSize: '15px', color: '#777' }}
              >
                <Instagram size={16} />
                @{igHandle}
              </a>
              {/* Email */}
              <div className="flex items-center font-body" style={{ gap: '8px', fontSize: '15px', color: '#777' }}>
                <Mail size={16} strokeWidth={1.5} />
                hello@alorabytrio.com
              </div>

              {/* Social icons */}
              <div className="flex items-center" style={{ gap: '10px', marginTop: '8px' }}>
                {[
                  { icon: <Instagram size={16} />, url: `https://instagram.com/${igHandle}` },
                  { icon: <MessageCircle size={16} strokeWidth={1.5} />, url: `https://wa.me/${whatsappNumber}` },
                  { icon: <Mail size={16} strokeWidth={1.5} />, url: 'mailto:hello@alorabytrio.com' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-all duration-300 hover:border-charcoal hover:text-charcoal"
                    style={{ width: '36px', height: '36px', border: '1px solid #e5e5e5', color: '#777' }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright — Alukas 1.4rem = 22px */}
      <div
        className="container-luxury"
        style={{ borderTop: '1px solid #e5e5e5', padding: '22px 15px' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between" style={{ gap: '10px' }}>
          <p className="font-body" style={{ fontSize: '14px', color: '#777' }}>
            © {year} Alora by Trio. All rights reserved.
          </p>
          <div className="flex items-center" style={{ gap: '24px' }}>
            {['Privacy Policy', 'Returns'].map(item => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className="font-body transition-colors hover:text-charcoal"
                style={{ fontSize: '14px', color: '#777' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed WhatsApp FAB */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-40 flex items-center justify-center bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 hover:scale-105 rounded-full"
        style={{ bottom: '24px', right: '24px', width: '48px', height: '48px' }}
        id="whatsapp-float"
      >
        <MessageCircle size={22} className="text-white" strokeWidth={1.5} />
      </a>
    </footer>
  );
}
