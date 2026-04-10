import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  X,
  MessageCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/format";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { items, toggleWishlist, totalWishlistItems } = useWishlist();

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const generateWhatsAppCheckoutLink = () => {
    let text = "Hi! I want to confirm my order for the following items:\n\n";
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ${formatPrice(item.price)}\n`;
    });
    text += `\nTotal: ${formatPrice(totalPrice)}`;
    return `https://wa.me/9191884 57331?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Helmet>
        <title>Your Wishlist | Alora by Trio</title>
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f8f8f8] min-h-[80vh]">
        {/* Breadcrumb Bar */}
        <div className="w-full mb-10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#666] font-body bg-transparent">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="text-[#aaa]">&gt;</span>
              <span className="text-black font-medium">Wishlist</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h1 className="font-display text-[40px] text-[#222] font-normal leading-tight mb-2">
              Your Wishlist
            </h1>
            <p className="font-body text-[#666] text-[15px]">
              {totalWishlistItems} {totalWishlistItems === 1 ? "item" : "items"}{" "}
              in your list
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#e5e5e5]">
              <Heart size={48} strokeWidth={1} className="text-[#ccc] mb-4" />
              <h3 className="font-display text-[24px] text-[#222] mb-3">
                Your wishlist is empty
              </h3>
              <p className="font-body text-[#666] text-[15px] mb-8">
                Save your favorite pieces here before deciding.
              </p>
              <Link to="/shop">
                <button className="h-[50px] px-10 bg-[#111] text-white font-body text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-black transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Items List */}
              <div className="w-full lg:w-[65%] bg-white border border-[#e5e5e5]">
                {items.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className={`flex items-stretch p-6 ${index !== items.length - 1 ? "border-b border-[#e5e5e5]" : ""}`}
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="shrink-0 w-[120px] h-[120px] bg-[#f8f8f8] flex items-center justify-center p-2 mr-6"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-body text-[16px] font-medium text-[#222] hover:text-[#B8973A] transition-colors line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="font-body text-[14px] text-[#888] mt-2">
                            Qty: 1
                          </p>
                        </div>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-[#999] hover:text-black transition-colors shrink-0"
                          title="Remove item"
                        >
                          <X size={20} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="font-body text-[18px] text-[#222] font-medium">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-[35%] bg-white border border-[#e5e5e5] p-8 sticky top-[120px]">
                <h3 className="font-display text-[22px] font-medium text-[#222] mb-6 border-b border-[#e5e5e5] pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 font-body text-[14px] text-[#666] mb-6 border-b border-[#e5e5e5] pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#222] font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                </div>

                <div className="flex justify-between font-body text-[18px] text-[#222] font-medium mb-8">
                  <span>Estimated Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <a
                  href={generateWhatsAppCheckoutLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[54px] bg-[#111] !text-white font-body text-[13px] font-bold tracking-[0.05em] uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  <MessageCircle size={18} strokeWidth={1.5} />
                  Buy Confirmed
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
