import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-warm rounded-lg overflow-hidden">
            <div className="aspect-[3/4] animate-shimmer" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-stone-200 rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-stone-200 rounded animate-shimmer w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-2xl text-stone-400 mb-2">No products found</p>
        <p className="text-stone-500 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
