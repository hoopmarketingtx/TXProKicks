// @ts-nocheck
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { supabase } from "./supabase";

const CartContext = createContext(null);

const CART_KEY = "txprokicks_cart";

// Discount codes are managed by admin and loaded from Supabase (fallback localStorage)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState(null);
  const [discountCodes, setDiscountCodes] = useState({});
  const [codesLoading, setCodesLoading] = useState(true);
  const [taxRate, setTaxRate] = useState(() => {
    try {
      const raw = localStorage.getItem("txprokicks_tax_rate");
      const n = raw ? Number(raw) : NaN;
      return !isNaN(n) ? n : 0.0825; // default 8.25%
    } catch (err) {
      return 0.0825;
    }
  });

  // Load from localStorage on mount (support legacy array shape and new object shape)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.items)) setItems(parsed.items);
          if (parsed.discountCode) setDiscountCode(parsed.discountCode);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage (store items + discountCode)
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ items, discountCode }));
    } catch {
      // ignore
    }
  }, [items, discountCode]);

  // Load discount codes from Supabase; fallback to localStorage
  const loadDiscountCodes = async () => {
    setCodesLoading(true);
    // Try Supabase first
    try {
      const { data, error } = await supabase.from("discount_codes").select("*");
      if (!error && Array.isArray(data)) {
        const map = {};
        data.forEach((r) => {
          const key = (r.code || "").trim().toUpperCase();
          if (key) map[key] = { ...r };
        });
        setDiscountCodes(map);
        setCodesLoading(false);
        return;
      }
    } catch (err) {
      // ignore and fallback
      console.debug("Supabase discount_codes fetch failed:", err?.message || err);
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem("txprokicks_discount_codes");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const map = {};
          parsed.forEach((r) => {
            const key = (r.code || "").trim().toUpperCase();
            if (key) map[key] = { ...r };
          });
          setDiscountCodes(map);
        } else if (parsed && typeof parsed === "object") {
          setDiscountCodes(parsed);
        }
      }
    } catch (err) {
      // ignore
      console.debug("Local discount_codes parse failed:", err?.message || err);
    }
    setCodesLoading(false);
  };

  useEffect(() => {
    loadDiscountCodes();
  }, []);

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

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
  };

  const isInCart = (shoeId) => items.some((i) => i.id === shoeId);

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0), 0);

  const discountAmount = useMemo(() => {
    if (!discountCode) return 0;
    const code = discountCodes[discountCode];
    if (!code) return 0;
    const value = Number(code.value || 0);
    if (code.type === "percent") return Math.round((subtotal * value) / 100);
    return value || 0;
  }, [discountCode, subtotal, discountCodes]);

  // Amount before tax (subtotal minus discounts)
  const preTaxTotal = Math.max(0, subtotal - discountAmount);

  // Tax amount (rounded to cents)
  const taxAmount = Math.round(preTaxTotal * (Number(taxRate) || 0) * 100) / 100;

  // Final total includes tax
  const total = Math.round((preTaxTotal + taxAmount) * 100) / 100;

  const applyDiscount = (codeInput) => {
    if (!codeInput) return { success: false, message: "Enter a code." };
    const normalized = codeInput.trim().toUpperCase();
    const code = discountCodes[normalized];
    if (!code) return { success: false, message: "Invalid code." };
    setDiscountCode(normalized);
    const label = code.label || (code.type === "percent" ? `${code.value}% off` : `$${code.value} off`);
    return { success: true, message: `Applied ${label}` };
  };

  const removeDiscount = () => setDiscountCode(null);

  const reloadDiscountCodes = async () => {
    await loadDiscountCodes();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        subtotal,
        total,
        preTaxTotal,
        taxAmount,
        taxRate,
        setTaxRate,
        discountCode,
        discountAmount,
        applyDiscount,
        removeDiscount,
        discountCodes,
        codesLoading,
        reloadDiscountCodes,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
