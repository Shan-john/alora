/**
 * Alora by Trio — PostgreSQL Seed Script
 * Populates PostgreSQL with sample data for development.
 * Run: node src/seed.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');
const { v4: uuidv4 } = require('uuid');

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

async function seed() {
  console.log('🌱 Seeding PostgreSQL Database...\n');

  try {
    // 1. Initialize Schema
    console.log('📦 Creating tables...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'config/schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('  ✅ Schema applied');

    // Clear existing data (optional, useful for clean re-seeds)
    await pool.query('TRUNCATE TABLE order_items, orders, reviews, product_tags, product_images, product_variants, products, categories, settings, admins, subscribers, enquiries CASCADE');

    // 2. Categories
    console.log('📂 Inserting categories...');
    const categories = [
      { slug: 'necklaces', name: 'Necklaces', image: UNSPLASH_JEWELLERY[0], order: 1 },
      { slug: 'earrings', name: 'Earrings', image: UNSPLASH_JEWELLERY[1], order: 2 },
      { slug: 'bracelets', name: 'Bracelets', image: UNSPLASH_JEWELLERY[2], order: 3 },
      { slug: 'rings', name: 'Rings', image: UNSPLASH_JEWELLERY[3], order: 4 },
      { slug: 'party-wear', name: 'Party Wear', image: UNSPLASH_JEWELLERY[4], order: 5 },
      { slug: 'gift-sets', name: 'Gift Sets', image: UNSPLASH_JEWELLERY[5], order: 6 },
    ];
    for (const cat of categories) {
      await pool.query(
        'INSERT INTO categories (slug, name, image_url, display_order) VALUES ($1, $2, $3, $4)',
        [cat.slug, cat.name, cat.image, cat.order]
      );
    }
    console.log(`  ✅ ${categories.length} categories created`);

    // 3. Products
    console.log('🛍️  Inserting products...');
    const products = [
      {
        id: uuidv4(), slug: 'celestial-gold-pendant-necklace', name: 'Celestial Gold Pendant Necklace', description: 'A stunning gold-plated pendant necklace.', price: 1499, sale_price: 1199, category: 'necklaces', stock: 25, isBestSeller: true, isTrendingIG: true, rating: 4.8, reviewCount: 24, images: [UNSPLASH_JEWELLERY[0], UNSPLASH_JEWELLERY[1]]
      },
      {
        id: uuidv4(), slug: 'pearl-drop-earrings', name: 'Pearl Drop Earrings', description: 'Elegant freshwater pearl drop earrings.', price: 899, sale_price: null, category: 'earrings', stock: 40, isBestSeller: true, isTrendingIG: false, rating: 4.9, reviewCount: 31, images: [UNSPLASH_JEWELLERY[2], UNSPLASH_JEWELLERY[3]]
      },
      {
        id: uuidv4(), slug: 'twisted-gold-cuff-bracelet', name: 'Twisted Gold Cuff Bracelet', description: 'Bold twisted gold cuff bracelet.', price: 1299, sale_price: 999, category: 'bracelets', stock: 18, isBestSeller: true, isTrendingIG: true, rating: 4.7, reviewCount: 19, images: [UNSPLASH_JEWELLERY[4], UNSPLASH_JEWELLERY[5]]
      },
      // ... Add more if desired
    ];

    for (const p of products) {
      await pool.query(
        'INSERT INTO products (id, slug, name, description, price, sale_price, category_slug, stock, is_best_seller, is_trending_ig, rating, review_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [p.id, p.slug, p.name, p.description, p.price, p.sale_price, p.category, p.stock, p.isBestSeller, p.isTrendingIG, p.rating, p.reviewCount]
      );

      for (let i = 0; i < p.images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)',
          [p.id, p.images[i], i]
        );
      }
    }
    console.log(`  ✅ ${products.length} products created`);

    // 4. Settings
    console.log('⚙️  Inserting settings...');
    const storeSettings = {
      storeName: 'Alora by Trio',
      tagline: 'Luxury Jewellery & Lifestyle',
      igHandle: 'alora.trio',
      whatsappNumber: '919876543210',
      announcements: [
        'Free Shipping on Orders Above ₹999',
        'New Arrivals Every Week',
      ],
      heroSlides: [
        {
          image: UNSPLASH_JEWELLERY[7],
          headline: 'Elegance Redefined',
          subheadline: 'Discover our handcrafted collection of luxury jewellery',
          cta1Text: 'Shop Now', cta1Link: '/shop',
          cta2Text: 'New Arrivals', cta2Link: '/shop?sort=newest',
          order: 1,
        }
      ],
      igPosts: [
        { imageUrl: UNSPLASH_JEWELLERY[0], order: 1, isVisible: true },
        { imageUrl: UNSPLASH_JEWELLERY[2], order: 2, isVisible: true },
        { imageUrl: UNSPLASH_JEWELLERY[4], order: 3, isVisible: true },
        { imageUrl: UNSPLASH_JEWELLERY[6], order: 4, isVisible: true },
      ],
      bestSellersImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85',
      trustItems: [
        { icon: 'Truck', label: 'Free Shipping' },
        { icon: 'RefreshCw', label: 'Easy Returns' },
        { icon: 'ShieldCheck', label: 'Secure Checkout' },
      ],
      giftingBanner: {
        image: UNSPLASH_JEWELLERY[9],
        heading: 'The Perfect Gift Awaits',
        subheading: 'Find beautifully curated gifts for every budget',
      },
    };

    await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value',
      ['store', JSON.stringify(storeSettings)]
    );
    console.log('  ✅ Settings created');

    console.log('\n🎉 Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    pool.end();
  }
}

seed();
