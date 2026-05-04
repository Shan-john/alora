import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import { formatPrice, discountPercent } from '../../utils/format';
import { normalizeImageUrl } from '../../utils/image';
import { api } from '../../utils/api';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discount = hasDiscount ? discountPercent(product.price, product.salePrice) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    try {
      const wl = JSON.parse(localStorage.getItem('alora_wishlist') || '[]');
      if (isWishlisted) {
        localStorage.setItem('alora_wishlist', JSON.stringify(wl.filter(id => id !== product.id)));
      } else {
        localStorage.setItem('alora_wishlist', JSON.stringify([...wl, product.id]));
      }
    } catch {}
  };

  const primaryImage = normalizeImageUrl(product.images?.[0]);
  const secondaryImage = normalizeImageUrl(product.images?.[1]);

  const handleProductClick = () => {
    api.trackProductClick(product.id, 'card-click').catch(() => {});
  };

  return (
    <Link to={`/product/${product.id}`} onClick={handleProductClick}>
      <div
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image — Alukas: #f5f5f5 bg, square, object-contain */}
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105"
            style={{ padding: '20px' }}
          />

          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && <Badge color="red">-{discount}%</Badge>}
            {product.isTrendingIG && (
              <Badge color="amber"><Flame size={10} className="mr-1" />HOT</Badge>
            )}
          </div>

          {/* Alukas action bar — bottom right on hover */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute flex items-center bg-white shadow-md"
            style={{ bottom: '12px', right: '12px' }}
          >
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center text-charcoal hover:text-gold transition-colors duration-200 cursor-pointer"
              style={{ width: '36px', height: '36px', borderRight: '1px solid #e5e5e5' }}
              title="Add to Cart"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
            </button>
             
            <span
              className="flex items-center justify-center text-charcoal hover:text-gold transition-colors duration-200"
              style={{ width: '36px', height: '36px' }}
              title="Quick View"
            >
              <Eye size={16} strokeWidth={1.5} />
            </span>
          </motion.div>
        </div>

        {/* Info — centered, Alukas style */}
        <div className="text-center" style={{ paddingTop: '16px', paddingBottom: '8px' }}>
          {product.category && (
            <p className="font-body uppercase text-[#777]" style={{ fontSize: '13px', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {product.category}
            </p>
          )}
          <h3 className="font-body text-charcoal" style={{ fontSize: '16px', fontWeight: 500 }}>
            {product.name}
          </h3>
          <div className="flex items-baseline justify-center gap-2" style={{ marginTop: '6px' }}>
            <span className="font-body text-charcoal" style={{ fontSize: '16px' }}>
              {formatPrice(hasDiscount ? product.salePrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="font-body text-[#aaa] line-through" style={{ fontSize: '14px' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex justify-center" style={{ marginTop: '8px' }}>
              <StarRating rating={product.rating} size={12} showCount count={product.reviewCount} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
