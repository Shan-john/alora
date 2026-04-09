import { useEffect, useRef, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  MessageCircle,
  Heart,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  ShieldCheck,
  Maximize2,
  Star,
} from "lucide-react";
import { InstagramIcon as Instagram } from "../components/common/Icons";
import { api } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, discountPercent } from "../utils/format";
import { normalizeImageUrl } from "../utils/image";
import StarRating from "../components/common/StarRating";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { PageSpinner } from "../components/common/Spinner";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { settings = {} } = useOutletContext() || {};
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    rating: 0,
    reviewText: "",
  });
  const [reviewIdentity, setReviewIdentity] = useState("anonymous");
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const trackedProductRef = useRef(null);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const whatsappNumber = String(settings?.whatsappNumber || "919497711275").replace(/\D/g, "");

  const handleWishlistAdd = () => {
    if (!product) return;
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success("Added to your wishlist!");
    } else {
      toast("Removed from your wishlist.", { icon: "ℹ️" });
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchProduct = async () => {
      if (!isCancelled) setLoading(true);
      try {
        const [productData, reviewData] = await Promise.all([
          api.getProduct(id),
          api.getReviews(id).catch(() => ({ reviews: [] })),
        ]);
        if (isCancelled) return;
        setProduct(productData);
        setReviews(reviewData.reviews || []);
      } catch {
        if (!isCancelled) setProduct(null);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchProduct();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;
    if (trackedProductRef.current === product.id) return;

    trackedProductRef.current = product.id;
    api.trackProductClick(product.id, "detail-view").catch(() => {});
  }, [product]);

  if (loading) return <PageSpinner />;

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-ivory">
        <h1 className="font-display text-3xl text-charcoal mb-4">
          Product Not Found
        </h1>
        <Link to="/shop">
          <Button variant="solid">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice : product.price;
  const discount = hasDiscount
    ? discountPercent(product.price, product.salePrice)
    : 0;
  const actualReviewCount = reviews.length;
  const normalizedImages = (product.images || []).map((img) => normalizeImageUrl(img));
  const selectedImageUrl =
    normalizedImages?.[selectedImage] || normalizedImages?.[0] || "";

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;

    if (!reviewForm.reviewText.trim() || !reviewForm.rating) {
      toast.error("Please add rating and review message");
      return;
    }

    if (reviewIdentity === "named" && !reviewForm.customerName.trim()) {
      toast.error("Please enter your name or choose Anonymous");
      return;
    }

    const reviewerName =
      reviewIdentity === "named" ? reviewForm.customerName.trim() : "Anonymous";

    setSubmittingReview(true);
    try {
      await api.submitReview({
        productId: product.id,
        customerName: reviewerName,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText.trim(),
      });
      const latestReviews = await api.getReviews(product.id);
      setReviews(latestReviews.reviews || []);
      toast.success("Thanks! Your review was added.");
      setReviewForm({ customerName: reviewIdentity === "named" ? reviewerName : "", rating: 0, reviewText: "" });
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const buildWhatsAppLink = (text) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  const getGiftOrderMessage = () => {
    const messageLines = [
      "Hello, I want to place a *GIFT ORDER*.",
      "",
      "*Product Details:*",
      `- Product: ${product.name}`,
      `- Product ID: ${product.id}`,
      `- Quantity: ${quantity}`,
      `- Price each: ${formatPrice(currentPrice)}`,
      `- Total: ${formatPrice(currentPrice * quantity)}`,
      `- Product page: ${window.location.href}`,
      `- Product image: ${selectedImageUrl || "N/A"}`,
    ];
    return messageLines.join("\n");
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Buy Online — Alora by Trio</title>
        <meta
          name="description"
          content={product.description?.substring(0, 160)}
        />
        <meta property="og:title" content={`${product.name} | Alora by Trio`} />
        <meta
          property="og:description"
          content={product.description?.substring(0, 160)}
        />
        <meta property="og:image" content={normalizedImages?.[0] || ""} />
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f6f6f6]">
        {/* Breadcrumb Bar */}
        <div className="w-full mb-10">
          <div className="max-w-[1440px] px-6 lg:px-8 xl:px-12 mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#666] font-body bg-transparent">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <ChevronRight
                size={13}
                strokeWidth={1.5}
                className="text-[#aaa]"
              />
              <Link to="/shop" className="hover:text-black transition-colors">
                Shop
              </Link>
              <ChevronRight
                size={13}
                strokeWidth={1.5}
                className="text-[#aaa]"
              />
              {product.categorySlug && (
                <>
                  <Link
                    to={`/shop?category=${product.categorySlug}`}
                    className="hover:text-black transition-colors capitalize"
                  >
                    {product.categorySlug.replace(/-/g, " ")}
                  </Link>
                  <ChevronRight
                    size={13}
                    strokeWidth={1.5}
                    className="text-[#aaa]"
                  />
                </>
              )}
              <span className="text-black font-medium">{product.name}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[#999]">
              <button className="hover:text-black transition-colors">
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button className="hover:text-black transition-colors">
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-8 xl:px-12 pb-10">
          <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-14 w-full">
            {/* ═══ LEFT: Product Info (25%) ═══ */}
            <div className="w-full lg:w-[25%] order-2 lg:order-1 pt-0">
              <h1 className="font-display text-[30px] lg:text-[36px] text-[#222] leading-[1.15] font-normal mb-3">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating
                    rating={product.rating}
                    size={13}
                    showCount={false}
                  />
                  <span className="font-body text-[12px] text-[#888]">
                    ({actualReviewCount} customer {actualReviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-body text-[22px] text-[#222] font-medium">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[15px] text-[#999] line-through font-body">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="font-body text-[#666] text-[15px] leading-[1.8] mb-6 pr-2">
                This regulator has a rolled diaphragm and high flow rate with
                reduced pressure drop.It has an excellent degree of
                condensation.{" "}
                {/* Using standard filler to match reference if description is empty */}
                {product.description}
              </p>

              <p className="font-body text-[13px] text-[#666] mb-0 flex items-center gap-1.5">
                Availability:{" "}
                <span className="text-[#519d36] font-medium">In Stock</span>
              </p>
            </div>

            {/* ═══ CENTER: Product Image (50%) ═══ */}
            <div
              className="w-full lg:w-[50%] order-1 lg:order-2 flex items-start justify-center relative overflow-hidden group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={selectedImageUrl}
                alt={product.name}
                style={{
                  ...zoomStyle,
                  transition: isZoomed ? "none" : "transform 0.3s ease",
                }}
                className="w-full max-w-[650px] object-contain cursor-crosshair mix-blend-multiply drop-shadow-sm"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-[#555] hover:text-black hover:shadow-md transition-all opacity-100 group-hover:opacity-0">
                <Maximize2 size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* ═══ RIGHT: Actions & Trust (25%) ═══ */}
            <div className="w-full lg:w-[25%] order-3 lg:order-3 pt-0">
              {/* Variants */}
              {product.variants?.sizes?.length > 0 && (
                <div className="mb-6">
                  <label className="font-body text-[13px] text-[#222] mb-3 block font-medium">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant(size)}
                        className={`min-w-[42px] h-[42px] px-3 flex items-center justify-center border font-body text-[13px] transition-all bg-transparent ${
                          selectedVariant === size
                            ? "border-black text-black ring-1 ring-black"
                            : "border-[#ccc] text-[#666] hover:border-black hover:text-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Type Radio */}
              <div className="mb-4 space-y-2 border border-[#e5e5e5] p-4 rounded bg-white">
                <label className="flex items-center gap-2 cursor-pointer font-body text-[14px] text-[#444]">
                  <input type="radio" checked={!isGiftOrder} onChange={() => setIsGiftOrder(false)} className="accent-charcoal" />
                  Normal order
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-body text-[14px] text-[#444]">
                  <input type="radio" checked={isGiftOrder} onChange={() => setIsGiftOrder(true)} className="accent-charcoal" />
                  Gift order
                </label>
                {isGiftOrder && (
                  <p className="text-[12px] text-[#777] font-body mt-2 border-t border-[#e5e5e5] pt-2">
                    Tap below to open WhatsApp with a ready gift-order template.
                  </p>
                )}
              </div>

              {/* Quantity + Buy Row */}
              <div className="flex gap-2 mb-6 w-full h-[52px]">
                <div className="flex items-center border border-[#ccc] bg-transparent w-[35%] shrink-0 h-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 h-full flex items-center justify-center text-[#999] hover:text-black transition-colors"
                  >
                    <Minus size={15} strokeWidth={1} />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-10 h-full text-center font-body text-[15px] text-[#222] bg-transparent outline-none border-x border-[#ccc]"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 h-full flex items-center justify-center text-[#999] hover:text-black transition-colors"
                  >
                    <Plus size={15} strokeWidth={1} />
                  </button>
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${
                    isGiftOrder
                      ? encodeURIComponent(getGiftOrderMessage())
                      : encodeURIComponent(`Hi! I want to enquire about ${product.name} (${formatPrice(currentPrice)}).`)
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[65%] h-full bg-[#111] !text-white font-body text-[11px] sm:text-[12px] font-bold tracking-[0.05em] uppercase flex items-center justify-center hover:bg-black transition-colors text-center leading-tight whitespace-break-spaces px-2"
                >
                  {isGiftOrder ? 'SEND GIFT ORDER ON WHATSAPP' : 'BUY CONFIRMED'}
                </a>
              </div>

              {/* Action Links */}
              <div className="space-y-4 mb-10 font-body text-[13px] text-[#666]">
                <button 
                  onClick={handleWishlistAdd}
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  <Heart 
                    size={16} 
                    strokeWidth={1.5} 
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-[#333]"} 
                  />{" "}
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </button>
                <div className="flex items-center justify-start">
                  <a
                    href={buildWhatsAppLink(`Hi! I have a question about ${product.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    <MessageCircle
                      size={15}
                      strokeWidth={1.5}
                      className="text-[#333]"
                    />{" "}
                    Ask a Question
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Truck size={16} strokeWidth={1.5} className="text-[#333]" />
                  <span>Fast dispatch after order confirmation</span>
                </div>
              </div>

              {/* Description Area */}
              <div className="mb-8">
                <div className="border-t border-[#e5e5e5] pt-6">
                  <h3 className="font-display text-[15px] font-medium text-[#222] mb-3">
                    Product Information
                  </h3>
                  <div className="font-body text-[13px] text-[#666] leading-[1.8] whitespace-pre-line">
                    {product.longDescription ||
                      product.description ||
                      "Detailed product information and specifications will be displayed here."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Animated Image Section on Scroll */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-[50vh] sm:h-[70vh] relative overflow-hidden"
      >
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={
            normalizedImages?.[1] ||
            normalizedImages?.[0] ||
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
          }
          alt="Product Lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5" />
      </motion.div>

      {/* Reviews Section */}
      <section className="bg-white py-16 border-t border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Reviews</p>
              <h2 className="font-display text-[32px] text-[#222] font-normal mb-2">Customer Reviews</h2>
              <p className="text-sm text-[#777] font-body mb-6">
                {reviews.length} approved {reviews.length === 1 ? "review" : "reviews"} for this product
              </p>

              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <div className="p-4 border border-[#e5e5e5] rounded-lg">
                    <p className="text-sm text-[#777] font-body">No reviews yet. Be the first to share your feedback.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-[#e5e5e5] rounded-lg">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-body text-[14px] font-semibold text-[#222]">{review.customer_name}</p>
                        <StarRating rating={review.rating} size={13} showCount={false} />
                      </div>
                      <p className="font-body text-[14px] text-[#666] leading-[1.7]">{review.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Write Review</p>
              <h3 className="font-display text-[28px] text-[#222] font-normal mb-6">Add Your Review</h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-[12px] uppercase tracking-[0.08em] text-[#777] mb-2 block">
                    Name Option
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-[14px] text-[#555] font-body">
                      <input
                        type="radio"
                        name="reviewIdentity"
                        checked={reviewIdentity === "anonymous"}
                        onChange={() => setReviewIdentity("anonymous")}
                      />
                      Anonymous
                    </label>
                    <label className="inline-flex items-center gap-2 text-[14px] text-[#555] font-body">
                      <input
                        type="radio"
                        name="reviewIdentity"
                        checked={reviewIdentity === "named"}
                        onChange={() => setReviewIdentity("named")}
                      />
                      Add Name
                    </label>
                  </div>
                </div>

                {reviewIdentity === "named" && (
                  <div>
                    <label className="font-body text-[12px] uppercase tracking-[0.08em] text-[#777] mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewForm.customerName}
                      onChange={(event) => setReviewForm((prev) => ({ ...prev, customerName: event.target.value }))}
                      className="w-full py-3 px-3 border border-[#ddd] rounded-md text-[14px] font-body focus:outline-none focus:border-charcoal"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div>
                  <label className="font-body text-[12px] uppercase tracking-[0.08em] text-[#777] mb-2 block">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: starValue }))}
                        className="p-1"
                        aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={22}
                          className={starValue <= reviewForm.rating ? "fill-gold text-gold" : "text-stone-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-body text-[12px] uppercase tracking-[0.08em] text-[#777] mb-2 block">
                    Your Review
                  </label>
                  <textarea
                    rows={5}
                    value={reviewForm.reviewText}
                    onChange={(event) => setReviewForm((prev) => ({ ...prev, reviewText: event.target.value }))}
                    className="w-full py-3 px-3 border border-[#ddd] rounded-md text-[14px] font-body focus:outline-none focus:border-charcoal resize-none"
                    placeholder="Share your experience with this product"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="py-3 px-6 bg-charcoal text-white text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-black transition-colors disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <p className="text-[12px] text-[#888] font-body">
                  Reviews are verified before they appear publicly.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
