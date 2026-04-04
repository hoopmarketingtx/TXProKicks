// @ts-nocheck
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useShoes } from "@/lib/ShoeContext";
import { cn } from "@/lib/utils";

export default function CheckoutModal({ open, onClose }) {
  const { items, total, clearCart } = useCart();
  const { updateShoe } = useShoes();

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate small network delay for UX
    await new Promise((r) => setTimeout(r, 900));
    // Mark each shoe as Sold in the inventory
    items.forEach((shoe) => {
      updateShoe(shoe.id, { ...shoe, status: "Sold", sold_date: new Date().toISOString(), buyer_name: form.name });
    });
    clearCart();
    setLoading(false);
    setSuccess(true);
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    // Reset after animation
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: "", email: "", phone: "", notes: "" });
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Order Received!</h2>
              <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                Thanks, {form.name}! We'll reach out to <strong className="text-foreground">{form.email}</strong> or <strong className="text-foreground">{form.phone}</strong> to confirm your order and arrange pickup/payment.
              </p>
            </div>
            <Button onClick={handleClose} className="font-heading tracking-wider mt-2">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <DialogTitle className="font-heading text-xl text-foreground">Checkout</DialogTitle>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Fill out your info and we'll contact you to arrange payment and pickup.
              </p>
            </DialogHeader>

            {/* Order summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2 my-2">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Order Summary</p>
              {items.map((shoe) => (
                <div key={shoe.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">{shoe.name}</p>
                    <p className="font-body text-xs text-muted-foreground">Size {shoe.size} · {shoe.condition}</p>
                  </div>
                  <span className="font-heading text-sm font-bold text-foreground flex-shrink-0">${shoe.price}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Total</span>
                <span className="font-heading text-xl font-bold text-primary">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="font-body text-sm text-muted-foreground">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Jordan Thompson"
                    autoComplete="name"
                    className={cn("mt-1 bg-secondary border-border", errors.name && "border-destructive")}
                  />
                  {errors.name && <p className="font-body text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label className="font-body text-sm text-muted-foreground">Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={cn("mt-1 bg-secondary border-border", errors.email && "border-destructive")}
                  />
                  {errors.email && <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="font-body text-sm text-muted-foreground">Phone <span className="text-destructive">*</span></Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(555) 000-0000"
                    autoComplete="tel"
                    className={cn("mt-1 bg-secondary border-border", errors.phone && "border-destructive")}
                  />
                  {errors.phone && <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label className="font-body text-sm text-muted-foreground">Notes (optional)</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Questions, preferred pickup time, etc."
                  className="mt-1 bg-secondary border-border min-h-[72px] resize-none"
                />
              </div>
              <Button type="submit" className="w-full font-heading tracking-wider" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing…</>
                ) : (
                  <>Place Order · ${total.toLocaleString()}</>
                )}
              </Button>
              <p className="font-body text-xs text-muted-foreground text-center">
                No payment collected online. We'll contact you to arrange everything.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
