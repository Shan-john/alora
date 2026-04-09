import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import ProductGrid from '../components/shop/ProductGrid';

const prettifyName = (value = '') => value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function CollectionItems() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      setLoading(true);
      try {
        const [productData, categoryData] = await Promise.all([
          api.getProducts({ category: slug, sort: 'newest', limit: 40 }),
          api.getCategories().catch(() => ({ categories: [] })),
        ]);

        setProducts(Array.isArray(productData?.products) ? productData.products : []);
        setCategories(Array.isArray(categoryData?.categories) ? categoryData.categories : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionProducts();
  }, [slug]);

  const collectionName = useMemo(() => {
    const matchedCategory = categories.find((category) => {
      if (typeof category === 'string') return slugify(category) === slug;
      const categorySlug = category.slug || category.categorySlug || slugify(category.name || category.title || '');
      return categorySlug === slug;
    });

    if (!matchedCategory) return prettifyName(slug);
    if (typeof matchedCategory === 'string') return prettifyName(matchedCategory);
    return matchedCategory.name || matchedCategory.title || prettifyName(slug);
  }, [categories, slug]);

  return (
    <>
      <Helmet>
        <title>{collectionName} Collection | Alora by Trio</title>
        <meta
          name="description"
          content={`Shop ${collectionName} collection items from Alora by Trio.`}
        />
      </Helmet>

      <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="bg-charcoal py-12 sm:py-16 text-center px-4">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Collection</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#C9A96E]">{collectionName}</h1>
          <p className="text-stone-300 text-sm mt-3 font-body">
            {loading ? 'Loading items...' : `${products.length} ${products.length === 1 ? 'item' : 'items'} available`}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500 mb-6">
            <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/collections" className="hover:text-charcoal transition-colors">Collections</Link>
            <ChevronRight size={14} />
            <span className="text-charcoal font-semibold">{collectionName}</span>
          </div>

          <ProductGrid products={products} loading={loading} />

          {!loading && products.length === 0 && (
            <div className="text-center mt-8">
              <Link to="/collections" className="btn-outline">View All Collections</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
