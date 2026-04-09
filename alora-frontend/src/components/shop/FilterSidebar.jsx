import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';

export default function FilterSidebar({ onFilter, isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  // Local state for the filter UI so it only applies when clicked
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'A — Z' },
  ];

  const handleApply = () => {
    onFilter({ search: searchParams.get('search') || '', category: selectedCategory, minPrice, maxPrice, sort });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    onFilter({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
    if (onClose) onClose();
  };

  const RadioButton = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer group mb-1.5">
      <div className={`w-[18px] h-[18px] flex items-center justify-center rounded-full border transition-colors ${checked ? 'border-gold bg-gold' : 'border-gray-400 group-hover:border-gold'}`}>
        {checked && <div className="w-[8px] h-[8px] bg-charcoal rounded-full" />}
      </div>
      <span className={`font-body text-[15px] ${checked ? 'text-charcoal font-medium' : 'text-[#444] group-hover:text-charcoal transition-colors'}`}>
        {label}
      </span>
    </label>
  );

  const filterContent = (
    <div className="space-y-8 font-body">
      
      {/* Sort By Section */}
      <div>
        <h4 className="font-display tracking-[0.1em] text-[20px] text-charcoal mb-4 uppercase font-medium">
          Sort By
        </h4>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map(opt => (
            <RadioButton 
              key={opt.value}
              checked={sort === opt.value}
              onChange={() => setSort(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="font-display tracking-[0.1em] text-[20px] text-charcoal mb-4 uppercase font-medium">
          Category
        </h4>
        <div className="flex flex-col gap-1.5">
          <RadioButton 
            checked={selectedCategory === ''}
            onChange={() => setSelectedCategory('')}
            label="All Categories"
          />
          {categories.map(cat => (
            <RadioButton 
              key={cat.slug}
              checked={selectedCategory === cat.slug}
              onChange={() => setSelectedCategory(cat.slug)}
              label={cat.name}
            />
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h4 className="font-display tracking-[0.1em] text-[20px] text-charcoal mb-4 uppercase font-medium">
          Price Range
        </h4>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full py-2 px-3 bg-transparent border border-[#eaeaea] rounded-[2px] text-[14px] focus:outline-none focus:border-gold transition-colors font-body"
          />
          <span className="text-[#999]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full py-2 px-3 bg-transparent border border-[#eaeaea] rounded-[2px] text-[14px] focus:outline-none focus:border-gold transition-colors font-body"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleApply}
            className="w-full py-[12px] bg-gold text-white font-body text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-gold-dark transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full py-[12px] bg-[#f9f7f0] text-charcoal font-body text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#eaeaea] transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-28 bg-[#fdfcfb] p-6 border-b lg:border-none border-stone-200">
          <h3 className="font-display tracking-[0.05em] text-[28px] text-charcoal mb-8 flex items-center gap-3">
            <SlidersHorizontal size={22} className="text-gold" strokeWidth={1.5} />
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
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[300px] sm:w-[340px] z-50 shadow-2xl lg:hidden overflow-y-auto bg-[#fdfcfb]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#eaeaea]">
                  <h3 className="font-display tracking-[0.05em] text-[28px] text-charcoal flex items-center gap-3">
                    <SlidersHorizontal size={22} className="text-gold" strokeWidth={1.5} />
                    Filters
                  </h3>
                  <button onClick={onClose} className="p-2 -mr-2 text-charcoal hover:text-gold transition-colors">
                    <X size={24} strokeWidth={1.5} />
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
