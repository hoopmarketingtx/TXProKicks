import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { items, removeFromCart, subtotal, total, preTaxTotal, taxAmount, discountAmount, discountCode, cartOpen, setCartOpen } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span className="font-heading text-lg font-bold text-foreground">Your Cart</span>
                  {items.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full text-xs font-heading font-bold w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full py-20 text-center"
                    >
                      <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="font-heading text-lg text-muted-foreground">Your cart is empty</p>
                      <p className="font-body text-sm text-muted-foreground/60 mt-1">Browse inventory to add shoes</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-6 font-heading tracking-wider"
                        onClick={() => setCartOpen(false)}
                        asChild
                      >
                        <a href="/inventory">Shop Now</a>
                      </Button>
                    </motion.div>
                  ) : (
                    items.map((shoe) => (
                      <motion.div
                        key={shoe.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex items-center gap-4 bg-secondary/50 rounded-xl p-3"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs text-primary font-semibold uppercase tracking-wider">{shoe.brand}</p>
                          <p className="font-body text-sm font-medium text-foreground truncate">{shoe.name}</p>
                          <p className="font-body text-xs text-muted-foreground">Size {shoe.size} · {shoe.condition}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="font-heading text-base font-bold text-foreground">${shoe.price}</span>
                          <button
                            onClick={() => removeFromCart(shoe.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${shoe.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border px-5 py-5 space-y-4">
                  <div className="space-y-2">
                        {(() => {
                          const fmt = (v) => (Number(v || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="font-body text-sm text-muted-foreground">Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                                <span className="font-heading text-2xl font-bold text-foreground">${fmt(subtotal)}</span>
                              </div>
                              {discountAmount > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="font-body text-sm text-muted-foreground">Discount {discountCode && `(${discountCode})`}</span>
                                  <span className="font-body text-sm text-destructive">-${fmt(discountAmount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="font-body text-sm text-muted-foreground">Tax</span>
                                <span className="font-heading text-2xl font-bold text-foreground">${fmt(taxAmount)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-body text-sm text-muted-foreground">Total</span>
                                <span className="font-heading text-2xl font-bold text-foreground">${fmt(total)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                  <Button
                    className="w-full font-heading tracking-wider"
                    onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  >
                    Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    No payment collected online — we'll contact you to arrange everything.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
