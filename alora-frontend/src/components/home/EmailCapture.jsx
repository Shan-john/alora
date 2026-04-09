import { useState } from 'react';
import { Check } from 'lucide-react';
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
      setMessage(data.message || "You're in! 🎉");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again!');
    }
  };

  return (
    <section style={{ padding: '72px 0', backgroundColor: '#222222' }} id="email-capture">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row items-center justify-between" style={{ gap: '30px' }}>
          {/* Left — text */}
          <div className="text-center md:text-left flex-1">
            <h3
              className="font-display font-medium text-white"
              style={{ fontSize: '33px', lineHeight: 1.3, marginBottom: '8px' }}
            >
              Join the Alora Family
            </h3>
            <p className="font-body" style={{ fontSize: '16px', color: '#777' }}>
              Sign up for our mailing list to receive latest updates and offers.
            </p>
          </div>

          {/* Right — form */}
          <div className="w-full md:w-auto">
            {status === 'success' ? (
              <div className="flex items-center gap-3" style={{ color: '#B8973A' }}>
                <Check size={18} strokeWidth={1.5} />
                <span className="font-body" style={{ fontSize: '15px' }}>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  id="email-capture-input"
                  className="font-body focus:outline-none"
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    padding: '14px 20px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '14px',
                    letterSpacing: '0.02em',
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="font-body font-medium cursor-pointer transition-colors duration-300 hover:bg-[#B8973A] hover:text-white disabled:opacity-40"
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#fff',
                    color: '#222',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p style={{ marginTop: '12px', color: '#ff6b6b', fontSize: '13px' }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
