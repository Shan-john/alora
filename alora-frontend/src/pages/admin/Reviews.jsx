import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Plus, Star } from 'lucide-react';
import { adminApi } from '../../utils/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function Reviews() {
  const [tab, setTab] = useState('pending');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', igHandle: '', rating: 5, text: '', productId: '' });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = tab === 'pending'
        ? await adminApi.getPendingReviews()
        : await adminApi.getReviews();
      setReviews(tab === 'pending' ? (data.reviews || []) : (data.reviews || []).filter(r => r.isApproved));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [tab]);

  const handleApprove = async (id) => {
    try {
      await adminApi.updateReview(id, { isApproved: true });
      toast.success('Review approved');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this review?')) return;
    try {
      await adminApi.updateReview(id, { isApproved: false });
      toast.success('Review rejected');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const handleCreate = async () => {
    try {
      await adminApi.createReview(form);
      toast.success('Review created');
      setShowForm(false);
      setForm({ customerName: '', igHandle: '', rating: 5, text: '', productId: '' });
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Reviews</h1>
        <Button onClick={() => setShowForm(true)} variant="solid" size="sm">
          <Plus size={14} className="mr-1" /> Add Review
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['pending', 'approved'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 px-4 rounded-lg text-sm font-body transition-colors cursor-pointer ${
              tab === t ? 'bg-gold/10 text-gold' : 'text-stone-500 hover:text-charcoal bg-white border border-stone-200'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Spinner size="lg" className="py-20" /> : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center py-12 text-stone-400">No {tab} reviews</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-charcoal text-sm">{review.customerName}</p>
                      <span className="text-xs text-gold">{review.igHandle}</span>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                    <p className="mt-2 text-sm text-stone-600">{review.text}</p>
                  </div>
                  {tab === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(review.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => handleReject(review.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-semibold mb-4">Add Review</h2>
            <div className="space-y-3">
              <input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})}
                placeholder="Customer name" className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" />
              <input value={form.igHandle} onChange={e => setForm({...form, igHandle: e.target.value})}
                placeholder="@instagram_handle" className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" />
              <select value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})}
                placeholder="Review text" rows={3} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none" />
              <Button onClick={handleCreate} variant="solid" className="w-full" size="sm">Create Review</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
