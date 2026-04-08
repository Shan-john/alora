import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import { formatPrice, discountPercent } from '../../utils/format';

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
    // Save to localStorage
    try {
      const wl = JSON.parse(localStorage.getItem('alora_wishlist') || '[]');
      if (isWishlisted) {
        localStorage.setItem('alora_wishlist', JSON.stringify(wl.filter(id => id !== product.id)));
      } else {
        localStorage.setItem('alora_wishlist', JSON.stringify([...wl, product.id]));
      }
    } catch {}
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        className="group bg-warm border border-stone-100 rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={isHovered && product.images?.[1] ? product.images[1] : product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge color="red">-{discount}%</Badge>
            )}
            {product.isTrendingIG && (
              <Badge color="amber">
                <Flame size={10} className="mr-1" />
                Trending on IG
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white"
          >
            <Heart
              size={14}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-charcoal'}
            />
          </button>

          {/* Add to Cart overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-charcoal/90 backdrop-blur-sm text-white text-xs tracking-widest uppercase font-body rounded flex items-center justify-center gap-2 hover:bg-gold transition-colors cursor-pointer"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <h3 className="font-body text-sm text-charcoal font-medium truncate">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-body text-sm font-bold text-charcoal">
              {formatPrice(hasDiscount ? product.salePrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="font-body text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="mt-1.5">
              <StarRating rating={product.rating} size={12} showCount count={product.reviewCount} />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
