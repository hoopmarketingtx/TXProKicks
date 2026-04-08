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
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function CheckoutModal({ open, onClose }) {
  const { items, subtotal, total, preTaxTotal, taxAmount, taxRate, discountCode, discountAmount, applyDiscount, removeDiscount, clearCart } = useCart();
  const { updateShoe } = useShoes();

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Order type: "shipping" => mark Sold; "pickup" => mark On Hold (collect hold info)
  const [orderType, setOrderType] = useState("shipping");
  const [pickupDate, setPickupDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState({ line1: "", city: "", state: "", zip: "" });

  const [discountInput, setDiscountInput] = useState("");
  const [discountMsg, setDiscountMsg] = useState("");
  const [applying, setApplying] = useState(false);

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
    if (orderType === "pickup" && !pickupDate) errs.pickupDate = "Pickup date is required.";
    if (orderType === "shipping") {
      if (!shippingAddress.line1.trim()) errs.address = "Address is required for shipping.";
      if (!shippingAddress.city.trim()) errs.address = "City is required for shipping.";
      if (!shippingAddress.zip.trim()) errs.address = "ZIP is required for shipping.";
    }
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

    // Build order payload (store tax locally for records). NOTE: do NOT forward `tax_amount` to any external POS API — let the POS calculate tax on its side.
    const orderPayload = {
      type: orderType,
      items: items.map((s) => ({ id: s.id, name: s.name, price: s.price })),
      contact: { name: form.name, email: form.email, phone: form.phone, notes: form.notes },
      pickup_date: orderType === "pickup" ? pickupDate : null,
      shipping_address: orderType === "shipping" ? shippingAddress : null,
      subtotal,
      pre_tax_total: preTaxTotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      discount_code: discountCode,
      discount_amount: discountAmount,
      total,
      created_at: new Date().toISOString(),
    };

    // Try to persist order server-side to Supabase orders table
    let insertedOrder = null;
    try {
      const { data, error } = await supabase.from("orders").insert([orderPayload]).select().single();
      if (!error && data) {
        insertedOrder = data;
      } else if (error) {
        console.warn("Supabase order insert returned error:", error.message || error);
      }
    } catch (err) {
      console.warn("Supabase order insert failed:", err?.message || err);
    }

    // Update inventory according to order type (attach server order id if available)
    try {
      if (orderType === "shipping") {
        // Mark each shoe as Sold
        await Promise.all(items.map((shoe) =>
          updateShoe(shoe.id, { status: "Sold", sold_date: new Date().toISOString(), buyer_name: form.name, order_id: insertedOrder?.id ?? null })
        ));
      } else {
        // pickup -> mark On Hold with hold_name and hold_until
        const holdUntil = new Date(pickupDate).toISOString();
        await Promise.all(items.map((shoe) =>
          updateShoe(shoe.id, { status: "On Hold", hold_name: form.name, hold_until: holdUntil, order_id: insertedOrder?.id ?? null })
        ));
      }
    } catch (err) {
      // If updating inventory failed (Supabase unreachable), continue
      console.error("Inventory update failed:", err);
    }

    // If server-side insert didn't happen, persist a simple order record locally as fallback
    if (!insertedOrder) {
      try {
        const raw = localStorage.getItem("txprokicks_orders");
        const orders = raw ? JSON.parse(raw) : [];
        const order = { ...orderPayload, id: Date.now() };
        orders.unshift(order);
        localStorage.setItem("txprokicks_orders", JSON.stringify(orders));
      } catch (err) {
        console.error("Failed to persist order locally:", err);
      }
    }
    clearCart();
    setLoading(false);
    setSuccess(true);
  };

  const handleApplyDiscount = async () => {
    if (!discountInput) {
      setDiscountMsg("Enter a code.");
      return;
    }
    setApplying(true);
    const res = applyDiscount(discountInput);
    setDiscountMsg(res.message);
    setApplying(false);
    if (res.success) setDiscountInput("");
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setDiscountMsg("Discount removed.");
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
                Thanks, {form.name}! We'll reach out to <strong className="text-foreground">{form.email}</strong> or <strong className="text-foreground">{form.phone}</strong> to confirm your order {orderType === "pickup" ? `and arrange pickup on ${pickupDate}` : "and arrange delivery"}.
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

              {/* Discount input */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="Discount code"
                    className="mt-1 bg-secondary border-border"
                  />
                  <Button size="sm" onClick={handleApplyDiscount} disabled={applying}>{applying ? 'Applying…' : 'Apply'}</Button>
                  {discountCode && <Button size="sm" variant="ghost" onClick={handleRemoveDiscount}>Remove</Button>}
                </div>
                {discountMsg && <p className="font-body text-xs text-muted-foreground mt-1">{discountMsg}</p>}
              </div>

              <div className="pt-3 mt-3">
                {/** helper formatting to always show two decimals */}
                {(() => {
                  const fmt = (v) => (Number(v || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                        <span className="font-body text-sm text-muted-foreground">${fmt(subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-body text-sm text-muted-foreground">Discount {discountCode && `(${discountCode})`}</span>
                          <span className="font-body text-sm text-destructive">-${fmt(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-body text-sm text-muted-foreground">Tax</span>
                        <span className="font-body text-sm text-muted-foreground">${fmt(taxAmount)}</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Total</span>
                        <span className="font-heading text-xl font-bold text-primary">${fmt(total)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <Label className="font-body text-sm text-muted-foreground">Fulfillment</Label>
                <div className="flex items-center gap-2 mt-2">
                  <button type="button" onClick={() => setOrderType("shipping")} className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-body",
                    orderType === "shipping" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}>Shipping</button>
                  <button type="button" onClick={() => setOrderType("pickup")} className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-body",
                    orderType === "pickup" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}>Pickup</button>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-2">Choose delivery or pickup. Shipping orders are marked Sold; pickup orders are placed On Hold and show in the dashboard's On Hold tab.</p>
              </div>

              {orderType === "pickup" && (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="font-body text-sm text-muted-foreground">Pickup Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={cn("mt-1 bg-secondary border-border", errors.pickupDate && "border-destructive")} />
                    {errors.pickupDate && <p className="font-body text-xs text-destructive mt-1">{errors.pickupDate}</p>}
                  </div>
                </div>
              )}

              {orderType === "shipping" && (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="font-body text-sm text-muted-foreground">Shipping Address <span className="text-destructive">*</span></Label>
                    <Input value={shippingAddress.line1} onChange={(e) => setShippingAddress((p) => ({ ...p, line1: e.target.value }))} placeholder="Street address" className={cn("mt-1 bg-secondary border-border", errors.address && "border-destructive")} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input value={shippingAddress.city} onChange={(e) => setShippingAddress((p) => ({ ...p, city: e.target.value }))} placeholder="City" className={cn("mt-1 bg-secondary border-border", errors.address && "border-destructive")} />
                    <Input value={shippingAddress.state} onChange={(e) => setShippingAddress((p) => ({ ...p, state: e.target.value }))} placeholder="State" className="mt-1 bg-secondary border-border" />
                    <Input value={shippingAddress.zip} onChange={(e) => setShippingAddress((p) => ({ ...p, zip: e.target.value }))} placeholder="ZIP" className={cn("mt-1 bg-secondary border-border", errors.address && "border-destructive")} />
                  </div>
                  {errors.address && <p className="font-body text-xs text-destructive mt-1">{errors.address}</p>}
                </div>
              )}

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
                  <>Place Order · ${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
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
