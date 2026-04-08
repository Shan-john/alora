import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Mail, Send } from 'lucide-react';
import { api } from '../utils/api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitEnquiry(form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Alora by Trio</title>
      </Helmet>

      <div className="pt-20 sm:pt-24 bg-ivory">
        <div className="bg-charcoal py-16 sm:py-20 text-center">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">Contact Us</h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">We'd love to hear from you</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-8 font-body">
                Have a question about an order, want to collaborate, or just want to say hi? Reach out to us through any of the channels below or use the form.
              </p>

              <div className="space-y-6">
                <a href="https://instagram.com/alora.trio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-warm transition-all">
                    <Instagram size={20} className="text-gold group-hover:text-warm" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">Instagram</p>
                    <p className="text-xs text-stone-500">@alora.trio</p>
                  </div>
                </a>

                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-all">
                    <MessageCircle size={20} className="text-gold group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">WhatsApp</p>
                    <p className="text-xs text-stone-500">+91 98765 43210</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">Email</p>
                    <p className="text-xs text-stone-500">hello@alorabytrio.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {sent ? (
                <div className="bg-warm rounded-xl p-8 text-center border border-stone-100">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">Message Sent!</h3>
                  <p className="text-stone-500 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-warm rounded-xl p-6 sm:p-8 border border-stone-100 space-y-4">
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full py-2.5 px-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" variant="solid" className="w-full" loading={loading}>
                    <Send size={14} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
