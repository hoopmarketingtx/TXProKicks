import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

const conditionColors = {
  "New": "bg-green-500/20 text-green-400 border-green-500/30",
  "Like New": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Gently Used": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Used": "bg-muted text-muted-foreground border-border",
};

export default function ShoeCard({ shoe, onClick }) {
  const { addToCart, isInCart, setCartOpen } = useCart();
  const inCart = isInCart(shoe.id);
  const isAvailable = shoe.status === "Available";

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (inCart) {
      setCartOpen(true);
    } else {
      addToCart(shoe);
      setCartOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick?.(shoe)}
      className="group cursor-pointer bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-secondary relative">
        <img
          src={shoe.image_url}
          alt={shoe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {shoe.status === "Sold" && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-heading text-2xl font-bold text-destructive tracking-widest rotate-[-15deg]">SOLD</span>
          </div>
        )}
        {shoe.status === "On Hold" && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-body text-xs">
              ON HOLD
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-body text-xs text-primary font-semibold tracking-wider uppercase">{shoe.brand}</p>
            <h3 className="font-heading text-lg font-semibold text-foreground truncate">{shoe.name}</h3>
          </div>
          <span className="font-heading text-xl font-bold text-foreground whitespace-nowrap">
            ${shoe.price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-body text-xs border-border text-muted-foreground">
            Size {shoe.size}
          </Badge>
          <Badge variant="outline" className={`font-body text-xs ${conditionColors[shoe.condition] || ""}`}>
            {shoe.condition}
          </Badge>
        </div>
        {isAvailable && (
          <Button
            size="sm"
            onClick={handleCartClick}
            className={`w-full mt-2 font-heading tracking-wider text-xs ${
              inCart ? "bg-green-600 hover:bg-green-700" : ""
            }`}
          >
            {inCart ? (
              <><Check className="w-3.5 h-3.5 mr-1.5" /> In Cart</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart</>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}