import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';
import { api } from '../utils/api';
import { formatPrice } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';

export default function Compare() {
  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.getProducts({ limit: 100 })
      .then(data => setAllProducts(data.products || []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (slotIndex, productId) => {
    const product = allProducts.find(p => p.id === productId) || null;
    setSelected(prev => {
      const next = [...prev];
      next[slotIndex] = product;
      return next;
    });
  };

  const clearSlot = (i) => {
    setSelected(prev => { const n = [...prev]; n[i] = null; return n; });
  };

  const specs = ['Price', 'Category', 'Material', 'Weight', 'Rating'];

  const getSpec = (product, spec) => {
    if (!product) return '—';
    switch (spec) {
      case 'Price': return formatPrice(product.price);
      case 'Category': return product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : '—';
      case 'Material': return product.material || 'Premium Alloy';
      case 'Weight': return product.weight ? `${product.weight}g` : '—';
      case 'Rating': return product.reviewCount > 0 ? `${product.rating} / 5 (${product.reviewCount})` : 'No reviews yet';
      default: return '—';
    }
  };

  const activeCount = selected.filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>Compare Products | Alora by Trio</title>
        <meta name="description" content="Compare jewellery pieces side by side to find your perfect match at Alora by Trio." />
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-24 bg-[#f8f8f8] min-h-screen">

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12 mb-10">
          <div className="flex items-center gap-2 text-[12px] text-[#666] font-body">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-[#aaa]">&gt;</span>
            <span className="text-black font-medium">Compare</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-14 px-6">
          <h1 className="font-display text-[40px] md:text-[50px] text-[#222] font-normal leading-tight mb-3">
            Compare Products
          </h1>
          <p className="font-body text-[#666] text-[15px]">
            Select up to 3 products to compare side by side.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 xl:px-12">

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {selected.map((product, i) => (
              <div key={i} className="bg-white border border-[#e5e5e5] p-4">
                {product ? (
                  <div className="relative">
                    <button
                      onClick={() => clearSlot(i)}
                      className="absolute top-0 right-0 text-[#999] hover:text-black transition-colors"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                    <div className="h-[160px] flex items-center justify-center mb-3 bg-[#f8f8f8]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain mix-blend-multiply p-3"
                      />
                    </div>
                    <p className="font-body text-[13px] text-[#222] font-medium line-clamp-2 text-center">
                      {product.name}
                    </p>
                    <p className="font-body text-[13px] text-[#B8973A] font-semibold text-center mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center gap-3">
                    <ShoppingBag size={28} strokeWidth={1} className="text-[#ccc]" />
                    <p className="font-body text-[13px] text-[#aaa]">Select a product</p>
                    <select
                      onChange={(e) => handleSelect(i, e.target.value)}
                      defaultValue=""
                      className="w-full border border-[#e5e5e5] bg-white text-[13px] font-body text-[#444] py-2 px-3 focus:outline-none focus:border-[#222] transition-colors"
                      disabled={loading}
                    >
                      <option value="" disabled>
                        {loading ? 'Loading...' : '— Choose product —'}
                      </option>
                      {allProducts
                        .filter(p => !selected.some(s => s?.id === p.id))
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                )}
                {/* Replace dropdown if product selected */}
                {product && (
                  <select
                    onChange={(e) => handleSelect(i, e.target.value)}
                    value={product.id}
                    className="w-full mt-3 border border-[#e5e5e5] bg-white text-[12px] font-body text-[#666] py-2 px-3 focus:outline-none focus:border-[#222] transition-colors"
                  >
                    <option value={product.id}>{product.name}</option>
                    {allProducts
                      .filter(p => p.id !== product.id && !selected.some(s => s?.id === p.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {activeCount >= 2 && (
            <div className="bg-white border border-[#e5e5e5] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="text-left py-4 px-6 font-body text-[11px] uppercase tracking-[0.1em] text-[#aaa] font-semibold w-[180px]">
                      Spec
                    </th>
                    {selected.map((product, i) => (
                      <th key={i} className="text-center py-4 px-4 font-body text-[13px] text-[#222] font-medium">
                        {product ? (
                          <Link to={`/product/${product.id}`} className="hover:text-[#B8973A] transition-colors">
                            {product.name}
                          </Link>
                        ) : (
                          <span className="text-[#ccc]">—</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, si) => (
                    <tr key={spec} className={`border-b border-[#e5e5e5] ${si % 2 === 0 ? '' : 'bg-[#fafafa]'}`}>
                      <td className="py-4 px-6 font-body text-[13px] text-[#666] font-medium">{spec}</td>
                      {selected.map((product, i) => (
                        <td key={i} className="py-4 px-4 font-body text-[14px] text-[#222] text-center">
                          {getSpec(product, spec)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Action Row */}
                  <tr>
                    <td className="py-5 px-6 font-body text-[13px] text-[#666] font-medium">Actions</td>
                    {selected.map((product, i) => (
                      <td key={i} className="py-5 px-4 text-center">
                        {product ? (
                          <div className="flex flex-col items-center gap-2">
                            <Link to={`/product/${product.id}`}>
                              <button className="h-[38px] px-6 bg-[#111] text-white font-body text-[11px] font-bold tracking-[0.05em] uppercase hover:bg-black transition-colors flex items-center gap-2">
                                View <ArrowRight size={12} />
                              </button>
                            </Link>
                            <button
                              onClick={() => toggleWishlist(product)}
                              className={`h-[38px] px-6 border font-body text-[11px] font-bold tracking-[0.05em] uppercase transition-colors ${
                                isInWishlist(product.id)
                                  ? 'border-[#B8973A] text-[#B8973A]'
                                  : 'border-[#e5e5e5] text-[#666] hover:border-[#222] hover:text-[#222]'
                              }`}
                            >
                              {isInWishlist(product.id) ? '♥ Saved' : '♡ Wishlist'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#ccc]">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeCount < 2 && (
            <div className="text-center py-12 text-[#aaa] font-body text-[14px]">
              Select at least 2 products above to see a comparison.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
