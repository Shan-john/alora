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
        a: 'Browse our collection, select your favorite pieces, add them to cart, and proceed to checkout. Complete the payment to confirm your order.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are dispatched within 2–4 working days and usually delivered within 4–8 business days, depending on your location.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Shipping offers may vary based on promotions, order value, or location. Final shipping charges will be shown at checkout.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Once your order is shipped, tracking details will be shared with you.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      {
        q: 'What materials are your jewellery made from?',
        a: 'Our jewellery is crafted using carefully selected quality materials, designed for style and elegance. Material details are mentioned on each product page.',
      },
      {
        q: 'How do I care for my jewellery?',
        a: 'Keep jewellery away from water, perfumes, and chemicals. Store in a dry place and wipe gently after use.',
      },
      {
        q: 'Are your products authentic?',
        a: 'Yes. We carefully curate every product to ensure quality and customer satisfaction.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We do not accept returns unless the product is defective, damaged, or incorrect.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Once approved, refunds are usually processed within 5–7 business days depending on your payment provider.',
      },
      {
        q: 'What items cannot be returned?',
        a: 'Used products, items without original packaging, and products without an unboxing video (for damage claims) cannot be returned.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept secure online payment methods available at checkout such as UPI, cards, net banking, and other supported options.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes. All payments are processed through secure and trusted payment gateways.',
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
