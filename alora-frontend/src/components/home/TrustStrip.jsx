import { Truck, RefreshCw, ShieldCheck, CheckCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Truck: Truck,
  RefreshCw: RefreshCw,
  ShieldCheck: ShieldCheck,
  CheckCircle: CheckCircle,
  Heart: Heart,
};

const defaultItems = [
  { icon: 'Truck', label: 'Free Shipping' },
  { icon: 'RefreshCw', label: 'Easy Returns' },
  { icon: 'ShieldCheck', label: 'Secure Checkout' },
  { icon: 'CheckCircle', label: '100% Authentic' },
  { icon: 'Heart', label: 'Handpicked Designs' },
];

export default function TrustStrip({ items = [] }) {
  const trustItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="py-12 sm:py-16 bg-warm border-y border-stone-100" id="trust-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {trustItems.map((item, index) => {
            const Icon = iconMap[item.icon] || CheckCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <Icon size={28} className="text-gold mb-2" strokeWidth={1.5} />
                <span className="text-xs tracking-wider uppercase font-body text-charcoal">{item.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
