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
        className="group bg-warm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Image container */}
        <div className="relative aspect-3/4 overflow-hidden">
          <img
            src={isHovered && product.images?.[1] ? product.images[1] : product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges — minimal */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge color="red">-{discount}%</Badge>
            )}
            {product.isTrendingIG && (
              <Badge color="amber">
                <Flame size={10} className="mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white opacity-0 group-hover:opacity-100"
          >
            <Heart
              size={13}
              strokeWidth={1.5}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-charcoal'}
            />
          </button>

          {/* Add to Cart — revealed on hover */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 left-0 right-0 p-3"
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-charcoal/90 backdrop-blur text-white text-[10px] tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 hover:bg-gold transition-colors duration-300 cursor-pointer"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Product info — clean, minimal */}
        <div className="py-4 px-1">
          <h3 className="font-body text-[13px] text-charcoal font-medium truncate tracking-wide">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-body text-[13px] font-semibold text-charcoal">
              {formatPrice(hasDiscount ? product.salePrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="font-body text-[11px] text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="mt-2">
              <StarRating rating={product.rating} size={11} showCount count={product.reviewCount} />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
