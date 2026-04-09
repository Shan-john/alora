import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our collection, add items to your wishlist, and click "Buy Confirmed" to send us your order via WhatsApp. One of our team members will confirm availability and provide payment details within a few hours.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are typically processed within 1–2 business days. Delivery within Kerala takes 2–4 business days, while orders to other states in India take 4–7 business days.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders above ₹999. Orders below that amount have a flat shipping fee of ₹79.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Once your order is shipped, we will send you a tracking number via WhatsApp so you can monitor your delivery in real time.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      {
        q: 'What materials are your jewellery made from?',
        a: 'All our jewellery is crafted from premium, hypoallergenic materials including 925 sterling silver, 18K gold-plated brass, and stainless steel. Each piece is tarnish-resistant and skin-safe for everyday wear.',
      },
      {
        q: 'How do I care for my jewellery?',
        a: 'To maintain the beauty of your piece, avoid contact with water, perfume, and harsh chemicals. Store in the provided pouch when not in use. Gently clean with a soft, dry cloth after wearing.',
      },
      {
        q: 'Are your products authentic?',
        a: 'Absolutely. Every piece you receive from Alora by Trio is exactly as shown in our catalogue. We personally quality-check each item before dispatch.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return window from the date of delivery. Items must be unused, in their original packaging, and in the same condition as received. Contact us on WhatsApp to initiate a return.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Once we receive and inspect the returned item, refunds are processed within 3–5 business days to your original payment method.',
      },
      {
        q: 'What items cannot be returned?',
        a: 'Customised or personalised pieces, items marked as "Final Sale", and products that show signs of use or damage cannot be returned.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (PhonePe, GPay, Paytm), bank transfers, and cash on delivery for select locations. Payment details are shared after order confirmation on WhatsApp.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes. All UPI and bank transfer transactions are secured by your bank\'s encryption standards. We never store your payment information.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-body text-[15px] text-[#222] font-medium group-hover:text-[#B8973A] transition-colors">
          {q}
        </span>
        <span className="shrink-0 text-[#222]">
          {open ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-body text-[14px] text-[#666] leading-[1.8]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQs | Alora by Trio</title>
        <meta name="description" content="Find answers to common questions about orders, shipping, returns, and products at Alora by Trio." />
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f8f8f8] min-h-screen">

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 mb-10">
          <div className="flex items-center gap-2 text-[12px] text-[#666] font-body">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-[#aaa]">&gt;</span>
            <span className="text-black font-medium">FAQs</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16 max-w-[700px] mx-auto px-6">
          <h1 className="font-display text-[40px] md:text-[50px] text-[#222] font-normal leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-[#666] text-[15px]">
            Everything you need to know about shopping with Alora by Trio.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-[800px] mx-auto px-6 space-y-14">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-body text-[11px] text-[#B8973A] uppercase tracking-[0.2em] font-bold mb-6">
                {section.category}
              </h2>
              <div className="bg-white border border-[#e5e5e5] px-6">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-[800px] mx-auto px-6 mt-16 text-center">
          <div className="bg-white border border-[#e5e5e5] p-12">
            <h3 className="font-display text-[26px] text-[#222] font-normal mb-3">Still have questions?</h3>
            <p className="font-body text-[#666] text-[14px] mb-8">Our team is happy to help. Reach out to us directly.</p>
            <Link to="/contact">
              <button className="h-[50px] px-10 bg-[#111] text-white font-body text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-black transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
