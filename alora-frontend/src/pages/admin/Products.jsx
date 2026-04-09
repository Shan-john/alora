import { useEffect, useMemo, useState } from 'react';
import { Download, FileUp, Pencil, Plus, RefreshCw, Save, Search, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../utils/api';
import { formatPrice } from '../../utils/format';
import { normalizeImageUrl } from '../../utils/image';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const statusColors = { active: 'green', draft: 'gray', hidden: 'amber', archived: 'red' };

const emptyForm = {
  id: '',
  slug: '',
  name: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  stock: 0,
  status: 'active',
  isBestSeller: false,
  isTrendingIG: false,
  imagesText: '',
};

const toSlug = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

const parseCsvText = (text = '') => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
};

const productToForm = (product) => ({
  id: product.id,
  slug: product.slug || '',
  name: product.name || '',
  description: product.description || '',
  price: product.price ?? '',
  salePrice: product.salePrice ?? '',
  category: product.category || '',
  stock: product.stock ?? 0,
  status: product.status || 'active',
  isBestSeller: Boolean(product.isBestSeller),
  isTrendingIG: Boolean(product.isTrendingIG),
  imagesText: (product.images || []).join('\n'),
});

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');
  const [form, setForm] = useState(emptyForm);
  const [csvRows, setCsvRows] = useState([]);
  const [csvFileName, setCsvFileName] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productData, categoryData] = await Promise.all([
        adminApi.getProducts({ status: 'all' }),
        adminApi.getCategories().catch(() => ({ categories: [] })),
      ]);

      setProducts(Array.isArray(productData?.products) ? productData.products : []);
      setCategories(Array.isArray(categoryData?.categories) ? categoryData.categories : []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.toLowerCase();

    return products.filter((product) => {
      const inName = (product.name || '').toLowerCase().includes(query);
      const inSlug = (product.slug || '').toLowerCase().includes(query);
      const inCategory = (product.category || '').toLowerCase().includes(query);
      return inName || inSlug || inCategory;
    });
  }, [products, search]);

  const updateField = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !prev.id && (!prev.slug || prev.slug === toSlug(prev.name))) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setView('table');
  };

  const startCreate = () => {
    setForm(emptyForm);
    setView('form');
  };

  const startEdit = (product) => {
    setForm(productToForm(product));
    setView('form');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await adminApi.deleteProduct(productId);
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name || !form.slug || !form.category || Number(form.price) <= 0) {
      toast.error('Please fill required fields: name, slug, category, price');
      return;
    }

    const payload = {
      slug: toSlug(form.slug),
      name: form.name.trim(),
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice === '' ? null : Number(form.salePrice),
      category: form.category,
      stock: Number(form.stock || 0),
      status: form.status,
      isBestSeller: Boolean(form.isBestSeller),
      isTrendingIG: Boolean(form.isTrendingIG),
      images: form.imagesText
        .split(/\r?\n/)
        .map((img) => img.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (form.id) {
        await adminApi.updateProduct(form.id, payload);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Product created');
      }

      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleCsvFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCsvText(text);
      if (!rows.length) {
        toast.error('No rows found in CSV');
        return;
      }

      setCsvRows(rows);
      setCsvFileName(file.name);
      toast.success(`Loaded ${rows.length} rows from CSV`);
    } catch {
      toast.error('Failed to read CSV file');
    }
  };

  const handleCsvImport = async () => {
    if (!csvRows.length) {
      toast.error('Please upload a CSV file first');
      return;
    }

    setImporting(true);
    try {
      const response = await adminApi.importProducts(csvRows);
      const summary = response?.summary;

      if (summary) {
        toast.success(`Import done: ${summary.created} created, ${summary.updated} updated, ${summary.failed} failed`);
        if (summary.failed > 0) {
          console.warn('CSV import errors', summary.errors);
        }
      } else {
        toast.success('CSV import completed');
      }

      await fetchData();
      setCsvRows([]);
      setCsvFileName('');
      setView('table');
    } catch (error) {
      toast.error(error.message || 'CSV import failed');
    } finally {
      setImporting(false);
    }
  };

  const downloadCsvTemplate = () => {
    const headers = ['slug', 'name', 'description', 'price', 'salePrice', 'category', 'stock', 'status', 'isBestSeller', 'isTrendingIG', 'images'];
    const sample = [
      'celestial-gold-pendant-necklace',
      'Celestial Gold Pendant Necklace',
      'A stunning gold-plated pendant necklace.',
      '1499',
      '1199',
      'necklaces',
      '25',
      'active',
      'true',
      'true',
      'https://example.com/image1.jpg|https://example.com/image2.jpg',
    ];

    const csv = `${headers.join(',')}\n${sample.join(',')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'alora-products-template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Product Manager</h1>
          <p className="text-sm text-stone-500">Use table view, manual form, or CSV upload in one place.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw size={14} className="mr-1" /> Refresh</Button>
          <Button variant="solid" size="sm" onClick={startCreate}><Plus size={14} className="mr-1" /> New Product</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'table', label: 'Product Table' },
          { key: 'form', label: form.id ? 'Edit Product' : 'Manual Form' },
          { key: 'csv', label: 'CSV Upload' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setView(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              view === tab.key
                ? 'bg-gold/10 border-gold/40 text-gold'
                : 'bg-white border-stone-200 text-stone-600 hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'table' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, slug, or category"
              className="w-full py-2.5 pl-10 pr-4 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[780px]">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Product</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Category</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Price</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Stock</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Status</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={normalizeImageUrl(product.images?.[0])} alt="" className="w-10 h-10 rounded object-cover bg-stone-100" />
                        <div>
                          <p className="font-medium text-charcoal truncate max-w-[240px]">{product.name}</p>
                          <p className="text-xs text-stone-400">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{product.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{formatPrice(product.salePrice || product.price)}</span>
                      {product.salePrice && (
                        <span className="text-stone-400 line-through text-xs ml-1">{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock <= 5 ? 'text-red-600 font-medium' : 'text-stone-600'}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={statusColors[product.status] || 'gray'}>{product.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <p className="text-center py-8 text-stone-400 text-sm">No products found</p>
            )}
          </div>
        </div>
      )}

      {view === 'form' && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">
            {form.id ? 'Edit Product' : 'Create Product'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Name *</label>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Slug *</label>
              <input value={form.slug} onChange={(e) => updateField('slug', toSlug(e.target.value))} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" required />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Price *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Sale Price</label>
              <input type="number" min="0" value={form.salePrice} onChange={(e) => updateField('salePrice', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm bg-white">
                {['active', 'draft', 'hidden', 'archived'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Category *</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm bg-white" required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Image URLs (one per line)</label>
            <textarea value={form.imagesText} onChange={(e) => updateField('imagesText', e.target.value)} rows={4} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none" />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={form.isBestSeller} onChange={(e) => updateField('isBestSeller', e.target.checked)} />
              Best Seller
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={form.isTrendingIG} onChange={(e) => updateField('isTrendingIG', e.target.checked)} />
              Trending on Instagram
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1" /> Save Product</Button>
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {view === 'csv' && (
        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">CSV Upload</h2>
          <p className="text-sm text-stone-600">
            Upload many products at once. Existing products with same `slug` will be updated.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={downloadCsvTemplate}><Download size={14} className="mr-1" /> Download Template</Button>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 text-sm cursor-pointer hover:border-gold transition-colors">
              <FileUp size={14} /> Choose CSV
              <input type="file" accept=".csv" onChange={handleCsvFile} className="hidden" />
            </label>
            <Button type="button" variant="solid" size="sm" onClick={handleCsvImport} loading={importing}><Upload size={14} className="mr-1" /> Import CSV</Button>
          </div>

          {csvFileName && <p className="text-xs text-stone-500">Loaded file: {csvFileName}</p>}

          {csvRows.length > 0 && (
            <div className="overflow-x-auto border border-stone-100 rounded-lg">
              <table className="w-full text-xs min-w-[860px]">
                <thead className="bg-stone-50">
                  <tr>
                    {Object.keys(csvRows[0]).map((header) => (
                      <th key={header} className="text-left px-3 py-2 uppercase tracking-wider text-stone-500">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 8).map((row, index) => (
                    <tr key={index} className="border-t border-stone-100">
                      {Object.keys(csvRows[0]).map((header) => (
                        <td key={`${index}-${header}`} className="px-3 py-2 text-stone-700">{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvRows.length > 8 && (
                <p className="text-xs text-stone-500 px-3 py-2 border-t border-stone-100">Showing first 8 of {csvRows.length} rows.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
