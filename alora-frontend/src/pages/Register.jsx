import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      toast.success('Account created! Welcome to Alora.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign Up | Alora by Trio</title></Helmet>
      <div className="pt-24 pb-16 min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-warm rounded-2xl p-8 border border-stone-100 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-charcoal">Create Account</h1>
            <p className="text-stone-500 text-sm mt-2 font-body">Join the Alora family</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Phone (Optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full py-3 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <Button type="submit" variant="solid" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account? <Link to="/login" className="text-gold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
