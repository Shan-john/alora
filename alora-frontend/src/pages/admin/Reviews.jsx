import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Search, Trash2 } from 'lucide-react';
import { adminApi } from '../../utils/api';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusColors = {
  approved: 'green',
  pending: 'amber',
};

const normalizeReview = (review) => ({
  ...review,
  customerName: review.customerName || review.customer_name || 'Anonymous',
  igHandle: review.igHandle || review.ig_handle || '',
  rating: Number(review.rating || 0),
  text: review.text || review.review_text || '',
  productName: review.productName || review.product_name || 'General',
  productCategory: review.productCategory || review.product_category || '',
  isApproved: typeof review.isApproved === 'boolean' ? review.isApproved : Boolean(review.is_approved),
});

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getReviews();
      const normalized = (data.reviews || []).map(normalizeReview);
      setReviews(normalized);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      if (!query) return true;

      return (
        review.customerName.toLowerCase().includes(query) ||
        review.productName.toLowerCase().includes(query) ||
        review.text.toLowerCase().includes(query)
      );
    });
  }, [reviews, search]);

  const groupedHierarchy = useMemo(() => {
    const categoryMap = new Map();

    filteredReviews.forEach((review) => {
      const categoryKey = review.productCategory || 'uncategorized';
      const productKey = review.productName || 'General';

      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, new Map());
      }

      const productMap = categoryMap.get(categoryKey);
      if (!productMap.has(productKey)) {
        productMap.set(productKey, []);
      }

      productMap.get(productKey).push(review);
    });

    return Array.from(categoryMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, productMap]) => ({
        category,
        products: Array.from(productMap.entries())
          .sort((a, b) => b[1].length - a[1].length)
          .map(([productName, productReviews]) => ({
            productName,
            reviews: productReviews,
          })),
      }));
  }, [filteredReviews]);

  const handleApproval = async (id) => {
    try {
      await adminApi.approveReview(id, true);
      toast.success('Review approved');
      fetchReviews();
    } catch {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      await adminApi.deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Reviews</h1>
          <p className="text-sm text-stone-500">Hierarchy view: Category to Product to Reviews.</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer, product, category, or review text"
          className="w-full py-2.5 pl-10 pr-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
        />
      </div>

      {groupedHierarchy.length === 0 ? (
        <p className="text-center py-12 text-stone-400">No reviews found</p>
      ) : (
        <div className="space-y-5">
          {groupedHierarchy.map(({ category, products }) => (
            <div key={category} className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-body text-sm font-semibold text-charcoal capitalize">
                  {category.replace(/-/g, ' ')}
                </h2>
              </div>

              <div className="space-y-4">
                {products.map(({ productName, reviews: productReviews }) => (
                  <div key={`${category}-${productName}`} className="border border-stone-100 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-charcoal">{productName}</p>
                      <Badge color="gray">{productReviews.length} review{productReviews.length > 1 ? 's' : ''}</Badge>
                    </div>

                    <div className="space-y-3">
                      {productReviews.map((review) => (
                        <div key={review.id} className="border border-stone-100 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <p className="font-medium text-charcoal text-sm">{review.customerName}</p>
                                {review.igHandle && <span className="text-xs text-gold">@{review.igHandle.replace(/^@/, '')}</span>}
                                <Badge color={review.isApproved ? statusColors.approved : statusColors.pending}>
                                  {review.isApproved ? 'approved' : 'pending'}
                                </Badge>
                              </div>

                              <div className="text-xs text-stone-600 mb-2 space-y-1">
                                <p>
                                  <span className="font-semibold text-stone-700">Category:</span>{' '}
                                  <span className="capitalize">{category.replace(/-/g, ' ')}</span>
                                </p>
                                <p>
                                  <span className="font-semibold text-stone-700">Product:</span>{' '}
                                  <span>{productName}</span>
                                </p>
                              </div>

                              <div className="mb-2">
                                <StarRating rating={review.rating} size={14} />
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-stone-700 mb-1">Review:</p>
                                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{review.text || '-'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!review.isApproved && (
                                <button
                                  onClick={() => handleApproval(review.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}

                              <button
                                onClick={() => handleDelete(review.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
