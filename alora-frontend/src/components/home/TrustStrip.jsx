import { Truck, RefreshCw, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultItems = [
  { icon: 'Truck', label: 'Free Shipping', subtitle: 'For All Orders Above ₹999' },
  { icon: 'RefreshCw', label: 'Money Guarantee', subtitle: '7 Days Easy Return' },
  { icon: 'ShieldCheck', label: 'Online Payment', subtitle: '100% Secured Payment' },
  { icon: 'Heart', label: 'Handpicked', subtitle: 'Curated With Love' },
];

const iconMap = { Truck, RefreshCw, ShieldCheck, Heart };

export default function TrustStrip({ items = [] }) {
  const trustItems = items.length > 0 ? items : defaultItems;

  return (
    <section
      className="bg-white"
      style={{ padding: '50px 0', borderTop: '1px solid #e5e5e5' }}
      id="trust-strip"
    >
      <div className="container-luxury">
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '30px' }}>
          {trustItems.map((item, index) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <Icon size={36} strokeWidth={1} className="text-charcoal" style={{ marginBottom: '12px' }} />
                <span className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                  {item.label}
                </span>
                <span className="font-body" style={{ fontSize: '14px', color: '#777' }}>
                  {item.subtitle || ''}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
