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
    <section className="py-14 sm:py-16 bg-warm" id="trust-strip">
      <div className="container-luxury">
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-20">
          {trustItems.map((item, index) => {
            const Icon = iconMap[item.icon] || CheckCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <Icon size={24} className="text-gold mb-3" strokeWidth={1.2} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-body text-charcoal/70">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
