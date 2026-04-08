import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { api } from '../../utils/api';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
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
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Try again!');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-charcoal" id="email-capture">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Mail size={32} className="text-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
            Join the Alora Family
          </h2>
          <p className="text-stone-400 text-sm font-body mb-8">
            Subscribe for exclusive offers, new arrivals, and 10% off your first order
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 text-gold"
            >
              <Check size={20} />
              <span className="font-body text-sm">{message}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 py-3 px-4 bg-white/10 border border-white/20 rounded text-white placeholder:text-stone-500 font-body text-sm focus:outline-none focus:border-gold transition-colors"
                required
                id="email-capture-input"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="py-3 px-6 bg-gold text-warm text-sm tracking-widest uppercase font-body hover:bg-gold-light transition-colors rounded flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {status === 'loading' ? 'Joining...' : 'Get 10% Off'}
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-red-400 text-xs">{message}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
