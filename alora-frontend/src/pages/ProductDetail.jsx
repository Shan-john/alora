import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Heart, ChevronRight, ChevronLeft, Minus, Plus, Truck, RefreshCw, ShieldCheck, Maximize2 } from 'lucide-react';
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

      <div className="pt-24 sm:pt-32 pb-16 bg-[#fafafa]">
               {/* Breadcrumb Bar */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 border-b border-[#eaeaea]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-[#777] font-body">
              <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
              <ChevronRight size={12} strokeWidth={1.5} className="text-[#ccc]" />
              <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
              <ChevronRight size={12} strokeWidth={1.5} className="text-[#ccc]" />
              {product.categorySlug && (
                <>
                  <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-charcoal transition-colors capitalize">
                    {product.categorySlug.replace(/-/g, ' ')}
                  </Link>
                  <ChevronRight size={12} strokeWidth={1.5} className="text-[#ccc]" />
                </>
              )}
              <span className="text-charcoal">{product.name}</span>
            </div>
            {/* Nav Arrows */}
            <div className="hidden sm:flex items-center gap-2 text-[#999]">
              <button className="hover:text-charcoal transition-colors"><ChevronLeft size={16} strokeWidth={1.5} /></button>
              <button className="hover:text-charcoal transition-colors"><ChevronRight size={16} strokeWidth={1.5} /></button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 text-center lg:text-left">
            
            {/* Left Column: Product Info (Title, Price, Desc) */}
            <div className="w-full lg:w-[28%] order-2 lg:order-1 flex flex-col pt-2 shrink-0">
              <h1 className="font-display text-[32px] lg:text-[40px] text-[#222] mb-3 leading-[1.1] font-light tracking-[0.01em]">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <StarRating rating={product.rating} size={14} showCount={false} />
                  <span className="font-body text-[13px] text-[#555]">({product.reviewCount} customer review)</span>
                </div>
              )}

              <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-6">
                <span className="font-body text-[22px] lg:text-[24px] text-[#222] font-medium">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[16px] text-[#999] line-through font-body font-light">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="font-body text-[#777] text-[14px] leading-[1.8] mb-6 max-w-sm mx-auto lg:mx-0 font-light text-justify sm:text-left">
                {product.description}
              </p>

              {/* Availability */}
              <div className="mb-4 font-body text-[14px] font-light">
                <span className="text-[#555]">Availability: </span>
                <span className="text-[#84b954]">In Stock</span>
              </div>
              
              {hasDiscount && (
                <div className="flex justify-center lg:justify-start mt-2">
                  <span className="bg-[#84b954] text-white px-2 py-0.5 rounded-[3px] font-body text-[12px] font-bold tracking-wider">
                    Discount {discountPercent(product.price, product.salePrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Center Column: Big Image */}
            <div className="w-full lg:w-[42%] order-1 lg:order-2 flex justify-center items-start shrink-0 relative bg-white p-6 sm:p-10 border border-[#eaeaea]">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full object-contain cursor-crosshair mx-auto"
              />
              <button className="absolute top-4 right-4 w-9 h-9 bg-white shadow-sm flex items-center justify-center rounded-full text-[#555] hover:text-charcoal transition-colors border border-[#eaeaea]">
                 <Maximize2 size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Right Column: Actions (Cart, Enquire, Trust) */}
            <div className="w-full lg:w-[30%] order-3 lg:order-3 shrink-0">
              
              {/* Variants */}
              {product.variants?.sizes?.length > 0 && (
                <div className="mb-5">
                  <label className="font-body text-[13px] text-[#222] mb-2 block text-left">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant(size)}
                        className={`min-w-[40px] h-[40px] px-3 flex items-center justify-center border font-body text-[13px] transition-all bg-white ${
                          selectedVariant === size
                            ? 'border-charcoal text-charcoal'
                            : 'border-[#eaeaea] text-[#777] hover:border-charcoal'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input + Buy Row */}
              <div className="flex gap-4 mb-3">
                <div className="flex items-center border border-[#eaeaea] h-[50px] w-24 shrink-0 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-[30px] h-full flex items-center justify-center text-[#999] hover:text-charcoal transition-colors">
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="flex-1 h-full text-center font-body text-[14px] text-[#222] bg-transparent outline-none w-full border-x border-[#eaeaea]" 
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-[30px] h-full flex items-center justify-center text-[#999] hover:text-charcoal transition-colors">
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
                
                <a 
                  href={`https://wa.me/919497711275?text=Hi! I want to enquire about ${product.name} (${formatPrice(currentPrice)}).`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 h-[50px] bg-[#222] text-white font-body text-[12px] font-bold tracking-[0.05em] uppercase flex items-center justify-center hover:bg-black transition-colors"
                >
                  Confirm on WhatsApp
                </a>
              </div>

              {/* Secondary CTA */}
              <a 
                href="https://instagram.com/alorabytrio"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-[50px] bg-[#ebebeb] text-[#222] font-body text-[12px] font-bold tracking-[0.05em] uppercase flex items-center justify-center hover:bg-[#e0e0e0] transition-colors mb-7"
              >
                Buy via Instagram
              </a>

              {/* Links List */}
              <div className="mb-6 space-y-3 font-body text-[13px] text-[#555] text-left">
                <button className="flex items-center gap-2 hover:text-[#222] transition-colors pb-1">
                  <Heart size={15} strokeWidth={1.5} /> Add to wishlist
                </button>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 hover:text-[#222] transition-colors">
                    <RefreshCw size={15} strokeWidth={1.5} /> Delivery & Return
                  </button>
                  <button className="flex items-center gap-2 hover:text-[#222] transition-colors">
                    <MessageCircle size={15} strokeWidth={1.5} /> Ask a Question
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Truck size={15} strokeWidth={1.5} />
                  <span>Estimated Delivery: <span className="text-[#222]">3 - 7 Business Days</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span><strong className="text-[#222] font-medium">49</strong> People viewing this right now!</span>
                </div>
              </div>

              {/* Trust Features Grid */}
              <div className="grid grid-cols-4 gap-2 mb-8 pt-5 text-center border-t border-[#eaeaea]">
                <div className="flex flex-col items-center justify-center pt-2">
                  <Truck size={22} strokeWidth={1} className="mb-2 text-[#444]" />
                  <span className="font-body text-[11px] text-[#777] leading-[1.2]">Free<br/>Shipping</span>
                </div>
                <div className="flex flex-col items-center justify-center pt-2">
                  <ShieldCheck size={22} strokeWidth={1} className="mb-2 text-[#444]" />
                  <span className="font-body text-[11px] text-[#777] leading-[1.2]">1 Year<br/>Warranty</span>
                </div>
                <div className="flex flex-col items-center justify-center pt-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2 text-[#444]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16H4V4h10v2h-2z" />
                    <rect x="8" y="6" width="12" height="16" rx="2" />
                  </svg>
                  <span className="font-body text-[11px] text-[#777] leading-[1.2]">Secure<br/>payment</span>
                </div>
                <div className="flex flex-col items-center justify-center pt-2">
                  <RefreshCw size={22} strokeWidth={1} className="mb-2 text-[#444]" />
                  <span className="font-body text-[11px] text-[#777] leading-[1.2]">30 Days<br/>Return</span>
                </div>
              </div>

              {/* Safe Checkout Badges */}
              <div className="border border-[#eaeaea] bg-white pt-5 pb-3 px-3 text-center relative mb-8 flex justify-center mt-2 rounded-[2px]">
                <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-[#fafafa] px-2 font-display text-[12px] font-bold text-[#222] tracking-wide w-[max-content]">
                  Guaranteed Safe Checkout
                </span>
                <div className="flex items-center justify-center gap-3 w-full">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-[14px] object-contain brightness-0" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-[16px] object-contain brightness-0" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-[12px] object-contain brightness-0" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" className="h-[14px] object-contain" />
                </div>
              </div>

              <div className="font-body text-[13px] text-left pt-2 border-t border-[#eaeaea]">
                <span className="text-[#222] mr-2">Category:</span> 
                <Link to={`/shop?category=${product.categorySlug}`} className="text-[#777] hover:text-gold transition-colors capitalize hidden lg:inline">
                  {product.categorySlug?.replace(/-/g, ' ')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
