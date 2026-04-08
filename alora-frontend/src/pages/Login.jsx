import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { loginWithEmail, loginWithGoogle } from '../firebase/auth';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <>
      <Helmet><title>Sign In | Alora by Trio</title></Helmet>
      <div className="pt-24 pb-16 min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-warm rounded-2xl p-8 border border-stone-100 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-charcoal">Welcome Back</h1>
            <p className="text-stone-500 text-sm mt-2 font-body">Sign in to your Alora account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <Button type="submit" variant="solid" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-stone-200" />
            <span className="text-xs text-stone-400 uppercase">or</span>
            <div className="flex-1 border-t border-stone-200" />
          </div>

          <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25a11.18 11.18 0 0 0-.16-1.84H12v3.48h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-7.73z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.87 6.87 0 0 1 0-4.17V7.08H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-stone-500 mt-6">
            Don't have an account? <Link to="/register" className="text-gold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
