import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Heart, ChevronRight, Minus, Plus, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import { InstagramIcon as Instagram } from '../components/common/Icons';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice, discountPercent } from '../utils/format';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CheckoutModal from '../components/checkout/CheckoutModal';
import { PageSpinner } from '../components/common/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
        // Load reviews
        api.getReviews(id).then(r => setReviews(r.reviews || [])).catch(() => {});
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <PageSpinner />;

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-ivory">
        <h1 className="font-display text-3xl text-charcoal mb-4">Product Not Found</h1>
        <Link to="/shop">
          <Button variant="solid">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice : product.price;
  const discount = hasDiscount ? discountPercent(product.price, product.salePrice) : 0;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Buy Online — Alora by Trio</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
        <meta property="og:title" content={`${product.name} | Alora by Trio`} />
        <meta property="og:description" content={product.description?.substring(0, 160)} />
        <meta property="og:image" content={product.images?.[0]} />
      </Helmet>

      <div className="pt-20 sm:pt-24 pb-16 bg-ivory">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-body">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[3/4] rounded-xl overflow-hidden bg-warm"
              >
                <img
                  src={product.images?.[selectedImage] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              {product.isTrendingIG && (
                <Badge color="amber" className="mb-3">🔥 Trending on Instagram</Badge>
              )}

              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="mb-4">
                  <StarRating rating={product.rating} size={16} showCount count={product.reviewCount} />
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-semibold text-charcoal">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-stone-400 line-through font-body">
                      {formatPrice(product.price)}
                    </span>
                    <Badge color="red">-{discount}%</Badge>
                  </>
                )}
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-6 font-body">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants?.sizes?.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs tracking-widest uppercase font-body text-stone-500 mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant(size)}
                        className={`py-2 px-4 border rounded text-sm transition-all cursor-pointer ${
                          selectedVariant === size
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-stone-200 text-charcoal hover:border-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants?.colors?.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs tracking-widest uppercase font-body text-stone-500 mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant(color)}
                        className={`py-2 px-4 border rounded text-sm transition-all cursor-pointer ${
                          selectedVariant === color
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-stone-200 text-charcoal hover:border-gold'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-xs tracking-widest uppercase font-body text-stone-500 mb-2 block">Quantity</label>
                <div className="flex items-center border border-stone-200 rounded inline-flex">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-gold transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-gold transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-8">
                <Button onClick={handleAddToCart} variant="solid" className="w-full" size="lg">
                  <ShoppingBag size={16} className="mr-2" />
                  Add to Cart — {formatPrice(currentPrice * quantity)}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => { handleAddToCart(); setCheckoutOpen(true); }} variant="solid" size="md">
                    <Instagram size={14} className="mr-1.5" />
                    Buy via IG DM
                  </Button>
                  <Button onClick={() => { handleAddToCart(); setCheckoutOpen(true); }} variant="outline" size="md">
                    <MessageCircle size={14} className="mr-1.5" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="border-t border-stone-200 pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Truck size={16} className="text-gold" />
                  <span>Free shipping on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <RefreshCw size={16} className="text-gold" />
                  <span>Easy 7-day returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>100% authentic & quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
