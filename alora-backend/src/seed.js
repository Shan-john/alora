/**
 * Alora by Trio — Seed Script
 * Populates Firestore with sample data for development.
 * Run: node src/seed.js
 */
require('dotenv').config();
const { db, admin } = require('./config/firebase');

const UNSPLASH_JEWELLERY = [
  'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=800&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
  'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1fd?w=800&q=80',
];

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=600&q=80',
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80',
];

async function seed() {
  console.log('🌱 Seeding Alora by Trio database...\n');

  // 1. Categories
  console.log('📂 Creating categories...');
  const categories = [
    { name: 'Necklaces', slug: 'necklaces', image: CATEGORY_IMAGES[0], order: 1, isVisible: true },
    { name: 'Earrings', slug: 'earrings', image: CATEGORY_IMAGES[1], order: 2, isVisible: true },
    { name: 'Bracelets', slug: 'bracelets', image: CATEGORY_IMAGES[2], order: 3, isVisible: true },
    { name: 'Rings', slug: 'rings', image: CATEGORY_IMAGES[3], order: 4, isVisible: true },
    { name: 'Party Wear', slug: 'party-wear', image: CATEGORY_IMAGES[4], order: 5, isVisible: true },
    { name: 'Gift Sets', slug: 'gift-sets', image: CATEGORY_IMAGES[5], order: 6, isVisible: true },
  ];

  for (const cat of categories) {
    await db.collection('categories').add(cat);
  }
  console.log(`  ✅ ${categories.length} categories created`);

  // 2. Products
  console.log('🛍️  Creating products...');
  const products = [
    {
      name: 'Celestial Gold Pendant Necklace',
      slug: 'celestial-gold-pendant-necklace',
      description: 'A stunning gold-plated pendant necklace featuring a celestial star design. Perfect for everyday elegance. Hypoallergenic, tarnish-resistant, and lightweight for all-day comfort.',
      price: 1499,
      salePrice: 1199,
      images: [UNSPLASH_JEWELLERY[0], UNSPLASH_JEWELLERY[1]],
      category: 'necklaces',
      tags: ['gold', 'pendant', 'celestial', 'everyday'],
      stock: 25,
      variants: { sizes: ['16 inch', '18 inch', '20 inch'], colors: ['Gold', 'Rose Gold'] },
      isBestSeller: true,
      isTrendingIG: true,
      status: 'active',
      rating: 4.8,
      reviewCount: 24,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Elegant freshwater pearl drop earrings with 925 sterling silver hooks. A timeless accessory that adds sophistication to any outfit from office wear to evening events.',
      price: 899,
      salePrice: null,
      images: [UNSPLASH_JEWELLERY[2], UNSPLASH_JEWELLERY[3]],
      category: 'earrings',
      tags: ['pearl', 'drop', 'silver', 'classic'],
      stock: 40,
      variants: { sizes: [], colors: ['White Pearl', 'Pink Pearl'] },
      isBestSeller: true,
      isTrendingIG: false,
      status: 'active',
      rating: 4.9,
      reviewCount: 31,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Twisted Gold Cuff Bracelet',
      slug: 'twisted-gold-cuff-bracelet',
      description: 'Bold twisted gold cuff bracelet. Adjustable to fit all wrist sizes. A statement piece that pairs beautifully with any stack.',
      price: 1299,
      salePrice: 999,
      images: [UNSPLASH_JEWELLERY[4], UNSPLASH_JEWELLERY[5]],
      category: 'bracelets',
      tags: ['gold', 'cuff', 'statement', 'adjustable'],
      stock: 18,
      variants: { sizes: ['Small', 'Medium', 'Large'], colors: ['Gold'] },
      isBestSeller: true,
      isTrendingIG: true,
      status: 'active',
      rating: 4.7,
      reviewCount: 19,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Minimalist Signet Ring',
      slug: 'minimalist-signet-ring',
      description: 'Clean, modern signet ring in polished gold. Subtle enough for daily wear, stylish enough for special occasions. Available in multiple sizes.',
      price: 699,
      salePrice: null,
      images: [UNSPLASH_JEWELLERY[6], UNSPLASH_JEWELLERY[7]],
      category: 'rings',
      tags: ['minimalist', 'signet', 'gold', 'daily'],
      stock: 35,
      variants: { sizes: ['5', '6', '7', '8', '9'], colors: ['Gold', 'Silver'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.6,
      reviewCount: 12,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Crystal Chandelier Earrings',
      slug: 'crystal-chandelier-earrings',
      description: 'Showstopping crystal chandelier earrings perfect for weddings, parties, and red-carpet events. Features Swarovski-inspired crystals on gold-plated brass.',
      price: 1899,
      salePrice: 1599,
      images: [UNSPLASH_JEWELLERY[8], UNSPLASH_JEWELLERY[2]],
      category: 'party-wear',
      tags: ['crystal', 'chandelier', 'party', 'wedding'],
      stock: 12,
      variants: { sizes: [], colors: ['Crystal Clear', 'Champagne'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.9,
      reviewCount: 8,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Alora Essentials Gift Set',
      slug: 'alora-essentials-gift-set',
      description: 'The perfect gift — our curated set includes a gold pendant necklace, matching stud earrings, and a delicate bracelet. Beautifully boxed and ready to gift.',
      price: 2999,
      salePrice: 2499,
      images: [UNSPLASH_JEWELLERY[9], UNSPLASH_JEWELLERY[10]],
      category: 'gift-sets',
      tags: ['gift', 'set', 'essentials', 'curated'],
      stock: 15,
      variants: { sizes: [], colors: ['Gold Set', 'Rose Gold Set'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 5.0,
      reviewCount: 6,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Layered Chain Necklace',
      slug: 'layered-chain-necklace',
      description: 'Multi-layer chain necklace with 3 delicate chains at different lengths. Creates a beautiful layered look without the hassle of stacking.',
      price: 1199,
      salePrice: null,
      images: [UNSPLASH_JEWELLERY[11], UNSPLASH_JEWELLERY[0]],
      category: 'necklaces',
      tags: ['layered', 'chain', 'gold', 'trendy'],
      stock: 30,
      variants: { sizes: ['14-16 inch', '16-18 inch'], colors: ['Gold', 'Silver'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.5,
      reviewCount: 15,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Huggie Hoop Earrings',
      slug: 'huggie-hoop-earrings',
      description: 'Dainty huggie hoop earrings that hug your ear perfectly. 18K gold plated with a secure click closure. Ideal for multiple piercings or solo wear.',
      price: 599,
      salePrice: 449,
      images: [UNSPLASH_JEWELLERY[3], UNSPLASH_JEWELLERY[5]],
      category: 'earrings',
      tags: ['huggie', 'hoop', 'gold', 'dainty'],
      stock: 50,
      variants: { sizes: ['Small (10mm)', 'Medium (14mm)'], colors: ['Gold', 'Silver', 'Rose Gold'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.7,
      reviewCount: 28,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Vintage Rose Bracelet',
      slug: 'vintage-rose-bracelet',
      description: 'Romantic vintage-inspired bracelet with rose motifs and cubic zirconia accents. Adjustable clasp for the perfect fit. A beautiful everyday piece.',
      price: 999,
      salePrice: null,
      images: [UNSPLASH_JEWELLERY[7], UNSPLASH_JEWELLERY[9]],
      category: 'bracelets',
      tags: ['vintage', 'rose', 'romantic', 'zirconia'],
      stock: 22,
      variants: { sizes: ['6 inch', '7 inch', '8 inch'], colors: ['Rose Gold', 'Gold'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.4,
      reviewCount: 10,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      name: 'Eternity Band Ring',
      slug: 'eternity-band-ring',
      description: 'Sparkling eternity band with channel-set cubic zirconia stones. Perfect as a wedding band, promise ring, or everyday luxury piece.',
      price: 1099,
      salePrice: 899,
      images: [UNSPLASH_JEWELLERY[6], UNSPLASH_JEWELLERY[10]],
      category: 'rings',
      tags: ['eternity', 'band', 'zirconia', 'wedding'],
      stock: 28,
      variants: { sizes: ['5', '6', '7', '8', '9'], colors: ['Silver', 'Gold', 'Rose Gold'] },
      isBestSeller: false,
      isTrendingIG: false,
      status: 'active',
      rating: 4.8,
      reviewCount: 20,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];

  for (const product of products) {
    await db.collection('products').add(product);
  }
  console.log(`  ✅ ${products.length} products created`);

  // 3. Settings
  console.log('⚙️  Creating store settings...');
  await db.collection('settings').doc('store').set({
    storeName: 'Alora by Trio',
    tagline: 'Luxury Jewellery & Lifestyle',
    igHandle: 'alora.trio',
    whatsappNumber: '919876543210',
    announcements: [
      'Free Shipping on Orders Above ₹999',
      'Easy 7-Day Returns',
      '100% Authentic Products',
      'New Arrivals Every Week',
    ],
    heroSlides: [
      {
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80',
        headline: 'Elegance Redefined',
        subheadline: 'Discover our handcrafted collection of luxury jewellery',
        cta1Text: 'Shop Now',
        cta1Link: '/shop',
        cta2Text: 'New Arrivals',
        cta2Link: '/shop?sort=newest',
        order: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4ce?w=1600&q=80',
        headline: 'Adorn Your Story',
        subheadline: 'Timeless pieces for every moment that matters',
        cta1Text: 'Explore Collections',
        cta1Link: '/shop',
        cta2Text: 'Gift Sets',
        cta2Link: '/shop?category=gift-sets',
        order: 2,
      },
      {
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80',
        headline: 'The Gold Edit',
        subheadline: 'Premium gold-plated pieces starting at ₹599',
        cta1Text: 'Shop Gold',
        cta1Link: '/shop?category=necklaces',
        cta2Text: 'Best Sellers',
        cta2Link: '/shop?sort=bestsellers',
        order: 3,
      },
    ],
    igPosts: [
      { imageUrl: UNSPLASH_JEWELLERY[0], productId: null, order: 1, isVisible: true },
      { imageUrl: UNSPLASH_JEWELLERY[2], productId: null, order: 2, isVisible: true },
      { imageUrl: UNSPLASH_JEWELLERY[4], productId: null, order: 3, isVisible: true },
      { imageUrl: UNSPLASH_JEWELLERY[6], productId: null, order: 4, isVisible: true },
      { imageUrl: UNSPLASH_JEWELLERY[8], productId: null, order: 5, isVisible: true },
      { imageUrl: UNSPLASH_JEWELLERY[10], productId: null, order: 6, isVisible: true },
    ],
    trustItems: [
      { icon: 'Truck', label: 'Free Shipping' },
      { icon: 'RefreshCw', label: 'Easy Returns' },
      { icon: 'ShieldCheck', label: 'Secure Checkout' },
      { icon: 'CheckCircle', label: '100% Authentic' },
      { icon: 'Heart', label: 'Handpicked Designs' },
    ],
    giftingBanner: {
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1600&q=80',
      heading: 'The Perfect Gift Awaits',
      subheading: 'Find beautifully curated gifts for every budget',
    },
    flashSale: {
      isActive: false,
      discountPercent: 20,
      endsAt: null,
    },
    aboutPage: {
      story: 'Alora by Trio was born from a shared passion for elegant, accessible luxury jewellery. Founded by three friends united by their love of design, craftsmanship, and the belief that everyone deserves to shine.',
      founderImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
      mission: 'To make premium jewellery accessible and sustainable, one beautiful piece at a time.',
    },
    lowStockThreshold: 5,
    dmMessageTemplate: "Hi Alora by Trio! 👋 I'd like to place an order:\n\n{orderDetails}\n\nOrder Ref: {orderId}\n\nPlease confirm! 🛍",
    defaultMetaTitle: 'Alora by Trio | Premium Jewellery & Lifestyle',
    defaultMetaDescription: 'Shop handcrafted luxury jewellery at Alora by Trio. Necklaces, earrings, bracelets, rings & gift sets. Free shipping above ₹999. Order via Instagram DM.',
  });
  console.log('  ✅ Store settings created');

  // 4. Reviews (homepage testimonials)
  console.log('⭐ Creating sample reviews...');
  const reviews = [
    {
      productId: null,
      customerName: 'Priya Sharma',
      igHandle: '@priya.s',
      rating: 5,
      text: 'Absolutely love my necklace from Alora! The quality is incredible for the price. Got so many compliments on my first day wearing it. Will definitely be ordering more!',
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      productId: null,
      customerName: 'Ananya Mehta',
      igHandle: '@ananya.m',
      rating: 5,
      text: 'The gift set I ordered was packaged so beautifully — my sister was thrilled! The pieces are dainty, elegant, and look way more expensive than they are. 10/10!',
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      productId: null,
      customerName: 'Riya Patel',
      igHandle: '@riyaapatel',
      rating: 4,
      text: 'Super fast delivery and the earrings are gorgeous. They go with literally everything. The DM ordering process was so easy and the team was super responsive!',
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      productId: null,
      customerName: 'Kavya Nair',
      igHandle: '@kavya.n',
      rating: 5,
      text: "I'm obsessed with the twisted cuff bracelet! It's my everyday go-to now. The gold hasn't faded at all after months of wear. Best jewellery purchase ever!",
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];

  for (const review of reviews) {
    await db.collection('reviews').add(review);
  }
  console.log(`  ✅ ${reviews.length} reviews created`);

  // 5. Admin user (placeholder — replace UID with your actual Firebase Auth UID)
  console.log('👤 Creating admin user...');
  await db.collection('admins').doc('REPLACE_WITH_YOUR_UID').set({
    email: 'admin@alorabytrio.com',
    role: 'superadmin',
  });
  console.log('  ✅ Admin user created (replace UID in /admins collection)');

  console.log('\n🎉 Seed completed! Your Alora by Trio database is ready.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
