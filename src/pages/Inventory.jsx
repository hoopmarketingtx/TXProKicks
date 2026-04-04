import { useState, useMemo } from "react";
import { useShoes } from "@/lib/ShoeContext";
import { Loader2, Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import ShoeCard from "../components/ShoeCard";
import ShoeDetailModal from "../components/ShoeDetailModal";
import CheckoutModal from "../components/CheckoutModal";
import Footer from "../components/Footer";

const BRANDS = ["All", "Nike", "Jordan Brand", "Adidas", "New Balance", "Yeezy", "Puma", "Reebok", "Converse", "Vans", "Other"];
const CONDITIONS = ["All", "New", "Like New", "Gently Used"];
const STATUSES = ["Available", "On Hold", "Sold", "All"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name A → Z" },
];

export default function Inventory() {
  const { shoes, loading } = useShoes();
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Available");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Derive unique sizes from full inventory, sorted numerically
  const availableSizes = useMemo(() => {
    const sizes = [...new Set(shoes.map((s) => s.size).filter(Boolean))].sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    );
    return ["All", ...sizes];
  }, [shoes]);

  // Count active (non-default) filters for badge
  const activeFilterCount = [
    brandFilter !== "All",
    sizeFilter !== "All",
    conditionFilter !== "All",
    statusFilter !== "Available",
    minPrice !== "",
    maxPrice !== "",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = shoes.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.name?.toLowerCase().includes(q) && !s.brand?.toLowerCase().includes(q)) return false;
      }
      if (brandFilter !== "All" && s.brand !== brandFilter) return false;
      if (sizeFilter !== "All" && s.size !== sizeFilter) return false;
      if (conditionFilter !== "All" && s.condition !== conditionFilter) return false;
      if (statusFilter !== "All" && s.status !== statusFilter) return false;
      if (minPrice !== "" && (s.price || 0) < Number(minPrice)) return false;
      if (maxPrice !== "" && (s.price || 0) > Number(maxPrice)) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":  return [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc": return [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":   return [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      default:           return [...result].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
    }
  }, [shoes, search, brandFilter, sizeFilter, conditionFilter, statusFilter, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setBrandFilter("All");
    setSizeFilter("All");
    setConditionFilter("All");
    setStatusFilter("Available");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  // Total counts from full inventory (not filtered)
  const totalAvailable = shoes.filter((s) => s.status === "Available").length;
  const totalOnHold = shoes.filter((s) => s.status === "On Hold").length;
  const totalSold = shoes.filter((s) => s.status === "Sold").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">INVENTORY</h1>
          <p className="font-body text-muted-foreground mt-2">Browse our full collection</p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border font-body"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "font-body gap-2 border-border shrink-0",
              filtersOpen && "border-primary text-primary bg-primary/5"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-heading leading-none">
                {activeFilterCount}
              </span>
            )}
            {filtersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
        </div>

        {/* Expandable filter panel */}
        {filtersOpen && (
          <div className="bg-card border border-border rounded-xl p-5 mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Brand</label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="bg-secondary border-border font-body text-sm h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Size</label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="bg-secondary border-border font-body text-sm h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{availableSizes.map((sz) => <SelectItem key={sz} value={sz}>{sz}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Condition</label>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="bg-secondary border-border font-body text-sm h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-secondary border-border font-body text-sm h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-secondary border-border font-body text-sm h-9"
              />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Max Price</label>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-secondary border-border font-body text-sm h-9"
              />
            </div>
          </div>
        )}

        {/* Results bar: count + inventory badges + sort + clear */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-sm text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            <span className="text-border">·</span>
            <Badge variant="outline" className="font-body text-xs px-2.5 py-0.5 border-green-500/30 text-green-400">
              {totalAvailable} Available
            </Badge>
            <Badge variant="outline" className="font-body text-xs px-2.5 py-0.5 border-yellow-500/30 text-yellow-400">
              {totalOnHold} On Hold
            </Badge>
            <Badge variant="outline" className="font-body text-xs px-2.5 py-0.5 border-border text-muted-foreground">
              {totalSold} Sold
            </Badge>
            {(activeFilterCount > 0 || search) && (
              <button
                onClick={clearFilters}
                className="font-body text-xs text-destructive hover:underline flex items-center gap-1 ml-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto min-w-[160px] bg-secondary border-border font-body text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="font-body text-muted-foreground text-lg">No shoes match your filters.</p>
            {(activeFilterCount > 0 || search) && (
              <button onClick={clearFilters} className="font-body text-sm text-primary hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} onClick={setSelectedShoe} />
            ))}
          </div>
        )}
      </div>

      <ShoeDetailModal
        shoe={selectedShoe}
        open={!!selectedShoe}
        onClose={() => setSelectedShoe(null)}
        onCheckout={() => { setSelectedShoe(null); setCheckoutOpen(true); }}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <Footer />
    </div>
  );
}