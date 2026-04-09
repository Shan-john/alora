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

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f8f8f8]">
        {/* Breadcrumb Bar */}
        <div className="w-full mb-10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#666] font-body bg-transparent">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <span className="text-[#aaa]">&gt;</span>
              <span className="text-black font-medium">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12">
          
          <div className="text-center mb-16">
             <h1 className="font-display text-[40px] md:text-[50px] text-[#222] font-normal leading-tight mb-4">
                Keep In Touch with Us
             </h1>
             <p className="font-body text-[#666] text-[15px] max-w-2xl mx-auto">
               We’ve been building our business with a core focus on providing exactly what you expect. Contact us for any query.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            
            {/* Contact Info - Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-10 pt-2"
            >
              
              <div className="flex items-start gap-4 group">
                  <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center shrink-0 border border-[#e5e5e5] bg-white group-hover:bg-black transition-colors duration-300">
                    <Mail size={22} strokeWidth={1} className="text-[#222] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-medium text-[#222] mb-1">Email Address</h4>
                    <p className="font-body text-[14px] text-[#666]">hello@alorabytrio.com</p>
                  </div>
              </div>

              <div className="flex items-start gap-4 group">
                  <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center shrink-0 border border-[#e5e5e5] bg-white group-hover:bg-black transition-colors duration-300">
                    <MessageCircle size={22} strokeWidth={1} className="text-[#222] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-medium text-[#222] mb-1">WhatsApp Chat</h4>
                    <p className="font-body text-[14px] text-[#666]">+91 94977 11275</p>
                    <p className="font-body text-[13px] text-[#999] mt-1">Available 9 AM - 6 PM</p>
                  </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer" onClick={() => window.open('https://instagram.com/alorabytrio', '_blank')}>
                  <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center shrink-0 border border-[#e5e5e5] bg-white group-hover:bg-black transition-colors duration-300">
                    <Instagram size={24} className="text-[#222] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-body text-[16px] font-medium text-[#222] mb-1">Instagram</h4>
                    <p className="font-body text-[14px] text-[#666]">@alorabytrio</p>
                  </div>
              </div>

            </motion.div>

            {/* Contact Form - Right Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white rounded-none p-8 sm:p-12 border border-[#e5e5e5] shadow-sm"
            >
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#f0f9f0] rounded-full flex items-center justify-center mx-auto mb-5">
                    <Send size={24} strokeWidth={1.5} className="text-[#4caf50]" />
                  </div>
                  <h3 className="font-display text-[28px] font-normal text-[#222] mb-3">Message Sent Successfully!</h3>
                  <p className="font-body text-[15px] text-[#666]">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-display text-[26px] text-[#222] mb-6 font-normal">Send A Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name *"
                        className="w-full h-[54px] px-5 font-body text-[14px] bg-transparent border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email *"
                        className="w-full h-[54px] px-5 font-body text-[14px] bg-transparent border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Subject *"
                      className="w-full h-[54px] px-5 font-body text-[14px] bg-transparent border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      rows={5}
                      placeholder="Your Message *"
                      className="w-full p-5 font-body text-[14px] bg-transparent border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="h-[54px] px-10 bg-[#111] text-white font-body text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-black transition-colors disabled:opacity-70 mt-2"
                  >
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
