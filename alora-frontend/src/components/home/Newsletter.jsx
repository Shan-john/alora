import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await api.subscribe(email.trim());
      setSubscribed(true);
      setEmail('');
      toast.success('Subscribed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#1a1a1a', padding: '80px 0' }}
    >
      {/* Decorative background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display font-medium whitespace-nowrap"
          style={{ fontSize: '180px', color: 'rgba(255,255,255,0.03)', letterSpacing: '0.02em' }}
        >
          Newsletter
        </span>
      </div>

      <div className="relative container-luxury px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Icon */}
          <div
            className="mx-auto flex items-center justify-center mb-6"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Mail size={22} strokeWidth={1.5} style={{ color: '#c9a96e' }} />
          </div>

          {/* Heading */}
          <p
            className="font-body uppercase"
            style={{ fontSize: '12px', letterSpacing: '4px', color: '#c9a96e', marginBottom: '12px' }}
          >
            Stay in Touch
          </p>
          <h2
            className="font-display font-medium"
            style={{ fontSize: '30px', color: '#fff', lineHeight: 1.2, marginBottom: '12px' }}
          >
            Subscribe to Our Newsletter
          </h2>
          <p
            className="font-body"
            style={{ fontSize: '15px', color: '#999', lineHeight: 1.7, marginBottom: '32px' }}
          >
            Be the first to know about new arrivals, exclusive offers, and styling tips delivered straight to your inbox.
          </p>

          {/* Form or Success */}
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3"
              style={{ padding: '16px 24px', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '4px' }}
            >
              <CheckCircle size={20} style={{ color: '#22c55e' }} />
              <span className="font-body" style={{ fontSize: '15px', color: '#22c55e' }}>
                Thank you for subscribing!
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full font-body outline-none transition-colors"
                  style={{
                    padding: '14px 16px',
                    fontSize: '14px',
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '2px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c9a96e';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="font-body uppercase flex items-center justify-center gap-2 transition-colors hover:opacity-90 disabled:opacity-60"
                style={{
                  padding: '14px 28px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#1a1a1a',
                  backgroundColor: '#c9a96e',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Subscribing...' : (
                  <>
                    Subscribe
                    <ArrowRight size={14} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          )}

          <p
            className="font-body"
            style={{ fontSize: '12px', color: '#555', marginTop: '16px' }}
          >
            No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
