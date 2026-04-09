import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
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
      const response = await api.login({ email, password });
      if (response && response.token) {
        localStorage.setItem('alora_token', response.token);
      }
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
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

          <p className="text-center text-sm text-stone-500 mt-6">
            Don't have an account? <Link to="/register" className="text-gold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
