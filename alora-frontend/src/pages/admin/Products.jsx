import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Archive } from 'lucide-react';
import { adminApi } from '../../utils/api';
import { formatPrice } from '../../utils/format';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusColors = { active: 'green', draft: 'gray', hidden: 'amber', archived: 'red' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts({ status: 'all' });
      setProducts(data.products || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleArchive = async (id) => {
    if (!confirm('Archive this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product archived');
      fetchProducts();
    } catch { toast.error('Failed to archive'); }
  };

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Products</h1>
        <Link to="/admin/products/new">
          <Button variant="solid" size="sm"><Plus size={14} className="mr-1" /> Add Product</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full py-2.5 pl-10 pr-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Product</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Price</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500 hidden md:table-cell">Stock</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0]} alt="" className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="font-medium text-charcoal truncate max-w-[200px]">{product.name}</p>
                      {product.isBestSeller && <span className="text-[10px] text-gold">⭐ Best Seller</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{product.category}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{formatPrice(product.salePrice || product.price)}</span>
                  {product.salePrice && <span className="text-stone-400 line-through text-xs ml-1">{formatPrice(product.price)}</span>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={product.stock <= 5 ? 'text-red-600 font-medium' : 'text-stone-600'}>{product.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge color={statusColors[product.status]}>{product.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/products/${product.id}`} className="p-1.5 text-stone-400 hover:text-gold transition-colors">
                      <Edit size={14} />
                    </Link>
                    <button onClick={() => handleArchive(product.id)} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors">
                      <Archive size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-stone-400 text-sm">No products found</p>
        )}
      </div>
    </div>
  );
}
