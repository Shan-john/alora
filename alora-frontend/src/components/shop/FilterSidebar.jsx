import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';

export default function FilterSidebar({ onFilter, isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Update URL whenever any filter changes instantly instead of having an apply button
  // based on the new design which lacks an apply button in the screenshot.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilter({ search, category: selectedCategory, minPrice, maxPrice, sort });
    }, 300); // 300ms debounce for typing
    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, minPrice, maxPrice, sort]);

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_desc', label: 'High Price' },
    { value: 'price_asc', label: 'Low Price' },
    { value: 'name_asc', label: 'A - Z' },
  ];

  const filterContent = (
    <div className="space-y-8 font-body">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search jewelry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Category Section (Text pills) */}
      <div>
        <h4 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-[13px] transition-colors ${
              !selectedCategory 
                ? 'bg-[#B8973A] text-white font-medium' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-[13px] transition-colors ${
                selectedCategory === cat.slug 
                  ? 'bg-[#B8973A] text-white font-medium' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Section (Outline pills) */}
      <div>
        <h4 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Sort By
        </h4>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-4 py-2 rounded-lg text-[13px] transition-colors border ${
                sort === opt.value
                  ? 'bg-[#B8973A] border-[#B8973A] text-white font-medium'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h4 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Price Range
        </h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-gold transition-colors"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="sticky top-28 bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-display text-[16px] font-bold text-charcoal mb-6 uppercase flex items-center justify-between">
            Filter
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
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[300px] sm:w-[340px] z-50 shadow-2xl lg:hidden overflow-y-auto bg-[#FAFAFA]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-[16px] font-bold text-charcoal uppercase">
                    Filter
                  </h3>
                  <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <X size={20} strokeWidth={2} />
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
