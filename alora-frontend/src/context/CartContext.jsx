import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'alora_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (product, variant = '', quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}_${variant}`;
      const existing = prev.find(item => `${item.productId}_${item.variant}` === key);

      if (existing) {
        return prev.map(item =>
          `${item.productId}_${item.variant}` === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images?.[0] || '',
        variant,
        quantity,
        slug: product.slug,
      }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId, variant = '') => {
    setItems(prev => prev.filter(item =>
      !(item.productId === productId && item.variant === variant)
    ));
  };

  const updateQuantity = (productId, variant, quantity) => {
    if (quantity <= 0) return removeItem(productId, variant);
    setItems(prev =>
      prev.map(item =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
