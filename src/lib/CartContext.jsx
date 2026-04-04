// @ts-nocheck
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const CART_KEY = "txprokicks_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (shoe) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === shoe.id);
      if (exists) return prev; // sneakers are one-of-a-kind, no duplicates
      return [...prev, shoe];
    });
  };

  const removeFromCart = (shoeId) => {
    setItems((prev) => prev.filter((i) => i.id !== shoeId));
  };

  const clearCart = () => setItems([]);

  const isInCart = (shoeId) => items.some((i) => i.id === shoeId);

  const total = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, total, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
