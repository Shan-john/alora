import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Send } from 'lucide-react';
import { InstagramIcon as Instagram } from '../components/common/Icons';
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

      <div className="pt-24 sm:pt-32 pb-16 bg-ivory min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Info - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="pt-2"
            >
              <h2 className="font-display text-[42px] text-charcoal mb-4 font-medium leading-none">
                We'd love to hear from you
              </h2>
              <p className="font-body text-[#777] text-[15px] leading-relaxed mb-10 max-w-sm">
                Have a question about an order, want to collaborate, or just want to say hi? Reach out to us through any of the channels below or use the form.
              </p>

              <div className="space-y-7">
                {/* Instagram */}
                <a href="https://instagram.com/alorabytrio" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-[50px] h-[50px] rounded-full bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                    <Instagram size={20} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-semibold text-charcoal mb-0.5">Instagram</h4>
                    <p className="font-body text-[14px] text-[#777]">@alorabytrio</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/919497711275" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-[50px] h-[50px] rounded-full bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                    <MessageCircle size={20} strokeWidth={1.5} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-semibold text-charcoal mb-0.5">WhatsApp</h4>
                    <p className="font-body text-[14px] text-[#777]">+91 94977 11275</p>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:hello@alorabytrio.com" className="flex items-start gap-4 group">
                  <div className="w-[50px] h-[50px] rounded-full bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                    <Mail size={20} strokeWidth={1.5} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-semibold text-charcoal mb-0.5">Email</h4>
                    <p className="font-body text-[14px] text-[#777]">hello@alorabytrio.com</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Contact Form - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6 sm:p-10 border border-black/5 shadow-sm"
            >
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-charcoal mb-2">Message Sent!</h3>
                  <p className="font-body text-[#777]">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-body text-[12px] font-bold text-[#999] tracking-wider uppercase mb-2 block">Name</label>
                    <input
                      type="text"
                      className="w-full h-[45px] px-4 font-body text-[14px] bg-transparent border border-[#eaeaea] rounded-[4px] focus:outline-none focus:border-gold transition-colors"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-[12px] font-bold text-[#999] tracking-wider uppercase mb-2 block">Email</label>
                    <input
                      type="email"
                      className="w-full h-[45px] px-4 font-body text-[14px] bg-transparent border border-[#eaeaea] rounded-[4px] focus:outline-none focus:border-gold transition-colors"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="font-body text-[12px] font-bold text-[#999] tracking-wider uppercase mb-2 block">Subject</label>
                    <input
                      type="text"
                      className="w-full h-[45px] px-4 font-body text-[14px] bg-transparent border border-[#eaeaea] rounded-[4px] focus:outline-none focus:border-gold transition-colors"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="font-body text-[12px] font-bold text-[#999] tracking-wider uppercase mb-2 block">Message</label>
                    <textarea
                      rows={4}
                      className="w-full p-4 font-body text-[14px] bg-transparent border border-[#eaeaea] rounded-[4px] focus:outline-none focus:border-gold transition-colors resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-[48px] bg-gold text-white font-body text-[13px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors disabled:opacity-70 mt-4 rounded-[3px]"
                  >
                    <Send size={16} strokeWidth={2} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
