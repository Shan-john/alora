import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';
import Button from '../common/Button';

export default function FilterSidebar({ onFilter, isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleApply = () => {
    onFilter({ category: selectedCategory, minPrice, maxPrice, sort });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    onFilter({});
    onClose();
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'A — Z' },
  ];

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h4 className="text-xs tracking-widest uppercase font-body text-charcoal mb-3">Sort By</h4>
        <div className="space-y-2">
          {sortOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sort === opt.value}
                onChange={(e) => setSort(e.target.value)}
                className="accent-gold"
              />
              <span className="text-sm text-charcoal">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs tracking-widest uppercase font-body text-charcoal mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => setSelectedCategory('')}
              className="accent-gold"
            />
            <span className="text-sm text-charcoal">All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={selectedCategory === cat.slug}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="accent-gold"
              />
              <span className="text-sm text-charcoal">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs tracking-widest uppercase font-body text-charcoal mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full py-2 px-3 border border-stone-200 rounded text-sm focus:outline-none focus:border-gold"
          />
          <span className="text-stone-400 self-center">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full py-2 px-3 border border-stone-200 rounded text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Button onClick={handleApply} variant="solid" className="w-full" size="sm">Apply Filters</Button>
        <Button onClick={handleReset} variant="ghost" className="w-full" size="sm">Reset All</Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-warm rounded-xl p-6 border border-stone-100">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-6 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gold" />
            Filters
          </h3>
          {filterContent}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-ivory z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-gold" />
                    Filters
                  </h3>
                  <button onClick={onClose} className="p-2">
                    <X size={20} />
                  </button>
                </div>
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
