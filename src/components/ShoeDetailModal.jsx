import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Zap } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function ShoeDetailModal({ shoe, open, onClose, onCheckout }) {
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart, isInCart, setCartOpen } = useCart();
  const inCart = shoe ? isInCart(shoe.id) : false;
  const isAvailable = shoe?.status === "Available";

  const handleAddToCart = () => {
    addToCart(shoe);
    setCartOpen(true);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(shoe);
    onClose();
    onCheckout?.();
  };

  if (!shoe) return null;

  const allImages = [shoe.image_url, ...(shoe.additional_images || [])].filter(Boolean);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image section */}
          <div className="relative aspect-square bg-secondary">
            <img
              src={allImages[currentImage]}
              alt={shoe.name}
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full p-1.5 hover:bg-background/80 transition">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full p-1.5 hover:bg-background/80 transition">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition ${i === currentImage ? "bg-primary" : "bg-foreground/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details section */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <DialogHeader>
                <p className="font-body text-xs text-primary font-semibold tracking-wider uppercase">{shoe.brand}</p>
                <DialogTitle className="font-heading text-2xl font-bold text-foreground">{shoe.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-3">
                <p className="font-heading text-3xl font-bold text-primary">${shoe.price}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-body border-border text-muted-foreground">Size {shoe.size}</Badge>
                  <Badge variant="outline" className="font-body border-border text-muted-foreground">{shoe.condition}</Badge>
                  {shoe.category && <Badge variant="outline" className="font-body border-border text-muted-foreground">{shoe.category}</Badge>}
                </div>
                {shoe.description && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mt-4">{shoe.description}</p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Badge
                className={`font-body text-sm px-4 py-1.5 ${
                  shoe.status === "Available"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : shoe.status === "Sold"
                    ? "bg-destructive/20 text-destructive border-destructive/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
                variant="outline"
              >
                {shoe.status}
              </Badge>
              {isAvailable && (
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    className={`flex-1 font-heading tracking-wider text-sm ${
                      inCart ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : ""
                    }`}
                    onClick={inCart ? () => { setCartOpen(true); onClose(); } : handleAddToCart}
                  >
                    {inCart ? (
                      <><Check className="w-4 h-4 mr-1.5" /> In Cart</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4 mr-1.5" /> Add to Cart</>
                    )}
                  </Button>
                  <Button className="flex-1 font-heading tracking-wider text-sm" onClick={handleBuyNow}>
                    <Zap className="w-4 h-4 mr-1.5" /> Buy Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}