import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '../utils/api';
import ProductGrid from '../components/shop/ProductGrid';
import FilterSidebar from '../components/shop/FilterSidebar';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        category: filters.category || searchParams.get('category') || '',
        minPrice: filters.minPrice || searchParams.get('minPrice') || '',
        maxPrice: filters.maxPrice || searchParams.get('maxPrice') || '',
        sort: filters.sort || searchParams.get('sort') || 'newest',
        search: searchParams.get('search') || '',
        limit: 40,
      };

      // Clean empty params
      Object.keys(params).forEach(k => !params[k] && delete params[k]);

      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleFilter = (filters) => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    setSearchParams(params);
  };

  const currentCategory = searchParams.get('category');

  return (
    <>
      <Helmet>
        <title>{currentCategory ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} | Alora by Trio` : 'Shop All | Alora by Trio'}</title>
      </Helmet>

      <div className="pt-20 sm:pt-24">
        {/* Header */}
        <div className="bg-charcoal py-12 sm:py-16 text-center">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Collection</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
            {currentCategory
              ? currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              : 'Shop All'}
          </h1>
          <p className="text-stone-400 text-sm mt-2 font-body">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden mb-6 flex items-center gap-2 py-2 px-4 border border-stone-200 rounded-lg text-sm text-charcoal hover:border-gold transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters & Sort
          </button>

          <div className="flex gap-8">
            <FilterSidebar
              onFilter={handleFilter}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />
            <div className="flex-1">
              <ProductGrid products={products} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
