import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { img, PHOTOS } from "@/assets/images";
import { supabase } from "@/lib/supabase";
import { useShoes } from "@/lib/ShoeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Check, Zap } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function ShoePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getShoe, shoes } = useShoes();
  const { addToCart, isInCart, setCartOpen } = useCart();

  const [shoe, setShoe] = useState(() => getShoe(id) || null);
  const [loading, setLoading] = useState(() => !getShoe(id));
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (shoe) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("shoes").select("*").eq("id", id).maybeSingle();
        if (!error && data && mounted) setShoe(data);
      } catch (err) {
        console.error("Failed to load shoe:", err);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id, shoe]);

  // If the global shoes list (from ShoeContext) updates (e.g. dev seed fallback),
  // keep the local `shoe` state in sync so direct reloads find the shoe.
  useEffect(() => {
    const s = getShoe(id);
    if (s) {
      setShoe(s);
      setLoading(false);
    }
  }, [id, shoes, getShoe]);

  useEffect(() => {
    if (shoe) document.title = `${shoe.name} — TXProKicks`;
    return () => { document.title = "TXPRO KICKS"; };
  }, [shoe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto py-32 text-center">
          <h2 className="font-heading text-2xl">Shoe not found</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">This shoe may have been removed.</p>
          <div className="mt-6">
            <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = (() => {
    const imgs = [shoe.image_url, ...(shoe.additional_images || [])].filter(Boolean);
    const placeholder = img(PHOTOS.sneakerDarkProfile);
    const desired = 4;
    while (imgs.length < desired) imgs.push(placeholder);
    return imgs;
  })();
  const inCart = isInCart(shoe.id);
  

  const handleAddToCart = () => {
    addToCart(shoe);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(shoe);
    setCartOpen(true);
    navigate("/checkout");
  };

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/shoe/${shoe.id}`;
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard" });
    } catch (err) {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 lg:p-12 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main image viewport */}
          <div className="flex items-center justify-center p-4 mt-6">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md w-full">
              <div className="aspect-square bg-secondary">
                <img src={allImages[currentImage]} alt={shoe.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Image previews */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    "w-20 h-20 rounded-md overflow-hidden flex-shrink-0",
                    i === currentImage ? "ring-2 ring-primary" : "border border-border"
                  )}
                >
                  <img src={img} alt={`${shoe.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Authenticity line */}
          <div className="text-center">
            <p className="font-body text-sm text-primary font-semibold">100% Authenticity</p>
          </div>

          {/* Name and details */}
          <div className="space-y-4">
            <div>
              <p className="font-body text-xs text-primary font-semibold tracking-wider uppercase">{shoe.brand}</p>
              <h1 className="font-heading text-3xl font-bold text-foreground mt-1">{shoe.name}</h1>
            </div>

            <div>
              <p className="font-heading text-3xl font-bold text-primary">${shoe.price}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="font-body text-xs">Size {shoe.size}</Badge>
                <Badge variant="outline" className="font-body text-xs">{shoe.condition}</Badge>
              </div>
              {shoe.description && <p className="font-body text-sm text-muted-foreground mt-4">{shoe.description}</p>}
            </div>

            <div className="flex gap-3 items-center">
              <>
                <Button onClick={handleAddToCart} variant={inCart ? "outline" : "default"}>
                  {inCart ? <><Check className="w-4 h-4 mr-2" /> In Cart</> : <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>}
                </Button>
                <Button onClick={() => { handleBuyNow(); setCartOpen(true); }}>
                  <Zap className="w-4 h-4 mr-2" /> Buy Now
                </Button>
              </>
              <Button variant="ghost" onClick={copyLink}>Copy Link</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
