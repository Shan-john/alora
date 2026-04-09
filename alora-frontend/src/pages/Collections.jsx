import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import { api } from '../utils/api';

const fallbackCollections = [
  {
    slug: 'rings',
    name: 'Rings',
    description: 'Signature rings designed for everyday luxury.',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Layer-friendly pieces that elevate every look.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'earrings',
    name: 'Earrings',
    description: 'Classic and statement silhouettes for any mood.',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'bracelets',
    name: 'Bracelets',
    description: 'Elegant layers crafted to wear solo or stacked.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80&auto=format&fit=crop',
  },
];

const prettifyName = (value = '') => value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await api.getCategories();
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const collections = useMemo(() => {
    if (categories.length === 0) return fallbackCollections;

    return categories.map((category, index) => {
      if (typeof category === 'string') {
        const slug = slugify(category);
        return {
          slug,
          name: prettifyName(category),
          description: 'Explore curated pieces from this signature line.',
          image: fallbackCollections[index % fallbackCollections.length].image,
        };
      }

      const slug = category.slug || category.categorySlug || slugify(category.name || category.title || '');
      const name = category.name || category.title || prettifyName(slug);

      return {
        slug,
        name,
        description: category.description || 'Explore curated pieces from this signature line.',
        image: category.image || category.bannerImage || fallbackCollections[index % fallbackCollections.length].image,
      };
    });
  }, [categories]);

  return (
    <>
      <Helmet>
        <title>Collections | Alora by Trio</title>
        <meta name="description" content="Browse all Alora collections and discover curated jewellery pieces." />
      </Helmet>

      <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="bg-charcoal py-12 sm:py-16 text-center px-4">
          <p className="text-gold text-xs tracking-[4px] uppercase font-body mb-3">Browse</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#C9A96E]">Collections</h1>
          <p className="text-stone-300 text-sm mt-3 font-body">Find your next favorite line of signature pieces.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 sm:h-80 bg-stone-200/70 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  to={`/collections/${collection.slug}`}
                  className="group rounded-xl overflow-hidden border border-stone-200 bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-3xl text-charcoal mb-2">{collection.name}</h2>
                    <p className="text-sm text-stone-600 font-body mb-4">{collection.description}</p>
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-charcoal group-hover:text-gold transition-colors">
                      View Collection
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
