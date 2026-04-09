import { createContext, useContext, useState, useEffect } from 'react';
import { normalizeImageUrl } from '../utils/image';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'alora_wishlist';

function loadWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const toggleWishlist = (product) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      if (exists) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          image: normalizeImageUrl(product.images?.[0]) || '',
          slug: product.slug,
        }];
      }
    });
  };

  const isInWishlist = (productId) => {
    return items.some((item) => item.id === productId);
  };

  const totalWishlistItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      toggleWishlist,
      isInWishlist,
      totalWishlistItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
