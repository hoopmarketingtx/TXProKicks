import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";
import { Loader2 } from "lucide-react";
import { generateStandardSizeOptions } from "@/lib/size-utils";

const brands = ["Nike", "Jordan", "Adidas", "New Balance", "Yeezy", "Puma", "Reebok", "Converse", "Vans", "Other"];
const conditions = ["New", "Like New", "Gently Used", "Used"];
const categories = ["Sneakers", "Boots", "Sandals", "Dress Shoes", "Athletic", "Casual"];
const statuses = ["Available", "Sold", "On Hold"];

export default function AdminShoeForm({ shoe, open, onClose, onSave }) {
  const isEdit = !!shoe;
  const [form, setForm] = useState({
    name: shoe?.name || "",
    brand: shoe?.brand || "Nike",
    price: shoe?.price || "",
    cost: shoe?.cost || "",
    size: shoe?.size || "",
    condition: shoe?.condition || "New",
    description: shoe?.description || "",
    image_url: shoe?.image_url || "",
    additional_images: shoe?.additional_images || [],
    status: shoe?.status || "Available",
    category: shoe?.category || "Sneakers",
    hold_name: shoe?.hold_name || "",
    hold_until: shoe?.hold_until || "",
  });
  const [saving, setSaving] = useState(false);

  const sizeOptions = useMemo(() => generateStandardSizeOptions(4, 15, 0.5), []);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.size || !form.image_url) return;
    setSaving(true);
    await onSave({ ...form, price: Number(form.price), cost: form.cost ? Number(form.cost) : undefined });
    setSaving(false);
    onClose();
  };

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">
            {isEdit ? "Edit Shoe" : "Add New Shoe"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="font-body text-sm text-muted-foreground">Shoe Name *</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Brand *</Label>
              <Select value={form.brand} onValueChange={(v) => update("brand", v)}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Price *</Label>
              <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="mt-1 bg-secondary border-border" placeholder="0.00" />
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Cost Paid</Label>
              <Input type="number" value={form.cost} onChange={(e) => update("cost", e.target.value)} className="mt-1 bg-secondary border-border" placeholder="0.00" />
            </div>
            {form.price && form.cost && (
              <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-sm font-body">
                <span className="text-muted-foreground">Profit preview:</span>
                <span className="font-semibold" style={{ color: Number(form.price) - Number(form.cost) >= 0 ? "hsl(142,72%,40%)" : "hsl(0,72%,50%)" }}>
                  ${(Number(form.price) - Number(form.cost)).toFixed(2)}
                </span>
                <span className="text-muted-foreground text-xs">
                  (${Number(form.price).toFixed(2)} − ${Number(form.cost).toFixed(2)})
                </span>
              </div>
            )}
            <div>
              <Label className="font-body text-sm text-muted-foreground">Size *</Label>
              <Select value={form.size} onValueChange={(v) => update("size", v)}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex flex-col">
                        <span className="leading-tight">{opt.primary}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{opt.secondary}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Condition *</Label>
              <Select value={form.condition} onValueChange={(v) => update("condition", v)}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.status === "On Hold" && (
              <>
                <div>
                  <Label className="font-body text-sm text-muted-foreground">Hold Name</Label>
                  <Input value={form.hold_name} onChange={(e) => update("hold_name", e.target.value)} className="mt-1 bg-secondary border-border" placeholder="Customer name" />
                </div>
                <div>
                  <Label className="font-body text-sm text-muted-foreground">Hold Until</Label>
                  <Input type="date" value={form.hold_until} onChange={(e) => update("hold_until", e.target.value)} className="mt-1 bg-secondary border-border" />
                </div>
              </>
            )}
          </div>
          <div>
            <Label className="font-body text-sm text-muted-foreground">Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1 bg-secondary border-border min-h-[80px]" />
          </div>
          <div>
            <Label className="font-body text-sm text-muted-foreground mb-2 block">Main Image *</Label>
            <ImageUploader value={form.image_url} onChange={(url) => update("image_url", url)} />
          </div>
          <div>
            <Label className="font-body text-sm text-muted-foreground mb-2 block">Additional Images</Label>
            <ImageUploader value={form.additional_images} onChange={(urls) => update("additional_images", urls)} multiple />
          </div>
          <Button onClick={handleSave} disabled={saving || !form.name || !form.price || !form.size || !form.image_url} className="w-full font-heading tracking-wider">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : isEdit ? "UPDATE SHOE" : "ADD SHOE"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}