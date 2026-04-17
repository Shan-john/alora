import { useEffect, useState } from 'react';
import { AlertTriangle, Check, GripVertical, ImageIcon, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../utils/api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const toSlug = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function Categories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Add new
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [creating, setCreating] = useState(false);

  // Rename
  const [renamingSlug, setRenamingSlug] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [savingRename, setSavingRename] = useState(false);

  // Image edit
  const [editingImageSlug, setEditingImageSlug] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [savingImage, setSavingImage] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([
        adminApi.getCategories().catch(() => ({ categories: [] })),
        adminApi.getProducts({ status: 'all' }).catch(() => ({ products: [] })),
      ]);
      setCategories(Array.isArray(catData?.categories) ? catData.categories : []);
      setProducts(Array.isArray(prodData?.products) ? prodData.products : []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductCount = (slug) => products.filter((p) => p.category === slug).length;

  // ── Drag & Drop Reorder ──
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder array
    const updated = [...categories];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);

    // Optimistic UI
    setCategories(updated);
    setDragIndex(null);
    setDragOverIndex(null);

    // Persist all new orders
    try {
      await Promise.all(
        updated.map((cat, i) =>
          adminApi.updateCategory(cat.slug, {
            name: cat.name,
            image: cat.image || '',
            order: i + 1,
            isVisible: cat.isVisible ?? true,
          })
        )
      );
      toast.success('Category order saved');
    } catch {
      toast.error('Failed to save order');
      await fetchData();
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Create ──
  const handleCreate = async () => {
    const name = newName.trim();
    const slug = toSlug(name);
    if (!name || !slug) {
      toast.error('Enter a valid category name');
      return;
    }
    if (categories.some((c) => c.slug === slug)) {
      toast.error('Category already exists');
      return;
    }
    setCreating(true);
    try {
      await adminApi.createCategory({
        slug,
        name,
        image: newImage.trim(),
        order: categories.length + 1,
        isVisible: true,
      });
      setNewName('');
      setNewImage('');
      await fetchData();
      toast.success(`Category "${name}" created`);
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  // ── Rename ──
  const startRename = (cat) => {
    setRenamingSlug(cat.slug);
    setRenameValue(cat.name);
  };

  const saveRename = async () => {
    const newName = renameValue.trim();
    if (!newName) { toast.error('Name cannot be empty'); return; }
    const cat = categories.find((c) => c.slug === renamingSlug);
    if (!cat) return;
    setSavingRename(true);
    try {
      await adminApi.updateCategory(renamingSlug, {
        name: newName,
        image: cat.image || '',
        order: cat.order || 0,
        isVisible: cat.isVisible ?? true,
      });
      await fetchData();
      toast.success(`Renamed to "${newName}"`);
    } catch (err) {
      toast.error(err.message || 'Failed to rename');
    } finally {
      setSavingRename(false);
      setRenamingSlug(null);
    }
  };

  // ── Image ──
  const startEditImage = (cat) => {
    setEditingImageSlug(cat.slug);
    setEditImageUrl(cat.image || '');
  };

  const saveImage = async () => {
    const cat = categories.find((c) => c.slug === editingImageSlug);
    if (!cat) return;
    setSavingImage(true);
    try {
      await adminApi.updateCategory(editingImageSlug, {
        name: cat.name,
        image: editImageUrl.trim(),
        order: cat.order || 0,
        isVisible: cat.isVisible ?? true,
      });
      await fetchData();
      toast.success('Category image updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update image');
    } finally {
      setSavingImage(false);
      setEditingImageSlug(null);
    }
  };

  // ── Visibility ──
  const toggleVisibility = async (cat) => {
    try {
      await adminApi.updateCategory(cat.slug, {
        name: cat.name,
        image: cat.image || '',
        order: cat.order || 0,
        isVisible: !cat.isVisible,
      });
      await fetchData();
      toast.success(`"${cat.name}" is now ${cat.isVisible ? 'hidden' : 'visible'}`);
    } catch (err) {
      toast.error(err.message || 'Failed to toggle visibility');
    }
  };

  // ── Delete ──
  const startDelete = (cat) => {
    const affected = products.filter((p) => p.category === cat.slug);
    setDeleteConfirm({
      slug: cat.slug,
      name: cat.name,
      productCount: affected.length,
      products: affected,
    });
    setReassignTo('');
  };

  const confirmDelete = async (shouldReassign) => {
    if (!deleteConfirm) return;
    const { slug, name, products: affected } = deleteConfirm;
    setDeleting(true);
    try {
      if (shouldReassign && reassignTo) {
        for (const p of affected) {
          await adminApi.updateProduct(p.id, { ...p, category: reassignTo });
        }
        const target = categories.find((c) => c.slug === reassignTo);
        toast.success(`${affected.length} product(s) moved to "${target?.name || reassignTo}"`);
      }
      await adminApi.deleteCategory(slug);
      await fetchData();
      toast.success(`Category "${name}" deleted`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Categories</h1>
          <p className="text-sm text-stone-500">Manage product categories, images, and visibility.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw size={14} className="mr-1" /> Refresh
        </Button>
      </div>

      {/* Add New Category */}
      <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
        <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">Add New Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Category Name *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Anklets"
              className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm"
            />
            {newName.trim() && (
              <p className="text-xs text-stone-400 mt-1">Slug: <span className="font-mono">{toSlug(newName)}</span></p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Image URL (optional)</label>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://..."
              className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm"
            />
          </div>
        </div>
        {/* Preview */}
        {newImage.trim() && (
          <img
            src={newImage.trim()}
            alt="Preview"
            className="h-20 w-32 object-cover rounded-lg border border-stone-200"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <Button variant="solid" size="sm" onClick={handleCreate} loading={creating}>
          <Plus size={14} className="mr-1" /> Add Category
        </Button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-body text-sm font-semibold text-charcoal">All Categories ({categories.length})</h2>
          <p className="text-xs text-stone-400">Drag to reorder</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center py-12 text-stone-400 text-sm">No categories yet. Create one above.</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {categories.map((cat, index) => {
              const count = getProductCount(cat.slug);
              const isDragging = dragIndex === index;
              const isOver = dragOverIndex === index;
              return (
                <div
                  key={cat.slug}
                  className={`group relative transition-all duration-150 ${isDragging ? 'opacity-40' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Drop indicator */}
                  {isOver && dragIndex !== null && dragIndex !== index && (
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-gold rounded-full z-10" />
                  )}
                  {/* Main row */}
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors">
                    {/* Drag handle */}
                    <div className="hidden sm:block shrink-0 cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} className="text-stone-300 hover:text-stone-500 transition-colors" />
                    </div>

                    {/* Thumbnail */}
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                        <ImageIcon size={20} className="text-stone-400" />
                      </div>
                    )}

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      {renamingSlug === cat.slug ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') { e.preventDefault(); saveRename(); }
                              if (e.key === 'Escape') setRenamingSlug(null);
                            }}
                            className="flex-1 py-1.5 px-3 border border-gold/40 rounded-lg text-sm focus:outline-none focus:border-gold bg-gold/5"
                            autoFocus
                          />
                          <button type="button" onClick={saveRename} disabled={savingRename} className="p-1.5 text-green-600 hover:text-green-700 transition-colors" title="Save">
                            {savingRename ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                          </button>
                          <button type="button" onClick={() => setRenamingSlug(null)} className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors" title="Cancel">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-charcoal text-sm">{cat.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            <span className="font-mono">/{cat.slug}</span>
                            <span className="mx-2">·</span>
                            <span>{count} product{count !== 1 ? 's' : ''}</span>
                          </p>
                        </>
                      )}
                    </div>

                    {/* Visibility badge */}
                    <button
                      type="button"
                      onClick={() => toggleVisibility(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                        cat.isVisible
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {cat.isVisible ? 'Visible' : 'Hidden'}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditImage(cat)}
                        className="p-2 text-stone-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit image"
                      >
                        <ImageIcon size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => startRename(cat)}
                        className="p-2 text-stone-400 hover:text-gold rounded-lg hover:bg-gold/10 transition-colors"
                        title="Rename"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => startDelete(cat)}
                        className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Inline image editor */}
                  {editingImageSlug === cat.slug && (
                    <div className="px-6 pb-4 space-y-3 bg-blue-50/30 border-t border-blue-100">
                      <p className="text-xs font-medium text-blue-700 pt-3">Edit Category Image</p>
                      {editImageUrl && (
                        <img
                          src={editImageUrl}
                          alt="Preview"
                          className="w-full max-w-xs h-28 object-cover rounded-lg border border-stone-200"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); saveImage(); }
                            if (e.key === 'Escape') setEditingImageSlug(null);
                          }}
                          placeholder="Paste image URL"
                          className="flex-1 py-2 px-3 border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                          autoFocus
                        />
                        <Button variant="solid" size="sm" onClick={saveImage} loading={savingImage}>
                          <Check size={14} className="mr-1" /> Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingImageSlug(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !deleting && setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">Delete Category</h3>
                <p className="text-sm text-stone-500">"<span className="font-medium text-stone-700">{deleteConfirm.name}</span>"</p>
              </div>
              <button
                type="button"
                onClick={() => !deleting && setDeleteConfirm(null)}
                className="ml-auto p-1 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-5 space-y-4">
              {deleteConfirm.productCount > 0 ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      This category has <strong>{deleteConfirm.productCount} product{deleteConfirm.productCount !== 1 ? 's' : ''}</strong>.
                      You can move them to another category before deleting, or delete anyway (products become uncategorized).
                    </p>
                  </div>

                  {/* Product list */}
                  <div className="max-h-28 overflow-y-auto border border-stone-100 rounded-lg divide-y divide-stone-50">
                    {deleteConfirm.products.slice(0, 10).map((p) => (
                      <div key={p.id} className="flex items-center gap-2 px-3 py-1.5">
                        <img src={p.images?.[0] || ''} alt="" className="w-6 h-6 rounded object-cover bg-stone-100 shrink-0" />
                        <span className="text-xs text-stone-600 truncate">{p.name}</span>
                      </div>
                    ))}
                    {deleteConfirm.productCount > 10 && (
                      <p className="text-xs text-stone-400 text-center py-1.5">+{deleteConfirm.productCount - 10} more</p>
                    )}
                  </div>

                  {/* Reassign */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-stone-500 mb-1 block">Move products to</label>
                    <select
                      value={reassignTo}
                      onChange={(e) => setReassignTo(e.target.value)}
                      className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gold"
                    >
                      <option value="">— Don't move (leave uncategorized) —</option>
                      {categories.filter((c) => c.slug !== deleteConfirm.slug).map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {reassignTo && (
                      <Button variant="solid" size="sm" onClick={() => confirmDelete(true)} loading={deleting} className="flex-1">
                        <RefreshCw size={14} className="mr-1" /> Move & Delete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(false)}
                      loading={deleting}
                      className={`flex-1 border-red-200 text-red-600 hover:bg-red-50`}
                    >
                      <Trash2 size={14} className="mr-1" /> Delete Anyway
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} disabled={deleting} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-stone-600">
                    This category has <strong>no products</strong>. It's safe to delete.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(false)}
                      loading={deleting}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete Category
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
