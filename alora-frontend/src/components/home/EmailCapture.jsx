import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { api } from '../../utils/api';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const data = await api.subscribe(email);
      setStatus('success');
      setMessage(data.message || "You're in! 🎉 Check your inbox.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again!');
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-charcoal" id="email-capture">
      <div className="container-luxury">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-[10px] tracking-[5px] uppercase font-body mb-5">Stay Connected</p>
            <h2 className="font-display text-2xl sm:text-[34px] font-semibold text-white leading-tight mb-3">
              Join the Alora Family
            </h2>
            <p className="text-stone-500 text-[13px] font-body mb-10 tracking-wide leading-relaxed">
              Subscribe for exclusive offers, new arrivals, and 10% off your first order
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 text-gold"
              >
                <Check size={18} strokeWidth={1.5} />
                <span className="font-body text-sm tracking-wide">{message}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 py-3.5 px-5 bg-transparent border border-white/15 text-white placeholder:text-stone-600 font-body text-sm focus:outline-none focus:border-gold/50 transition-colors duration-300 tracking-wide"
                  required
                  id="email-capture-input"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="py-3.5 px-7 bg-gold text-charcoal text-[10px] tracking-[0.2em] uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                  <ArrowRight size={13} strokeWidth={1.5} />
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-4 text-red-400/80 text-xs tracking-wide">{message}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
