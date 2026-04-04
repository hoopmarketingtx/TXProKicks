import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { useShoes } from "@/lib/ShoeContext";
import {
  Plus, Pencil, Trash2, Loader2, Package, DollarSign, LayoutGrid,
  Eye, EyeOff, LogOut, Settings, Home, TrendingUp,
  Download, Upload, Lock, ExternalLink, Menu, Search,
  AlertTriangle, Clock, BarChart2, CheckCircle, RefreshCw,
  ArrowUp, ArrowDown, ArrowUpDown, Filter, X, UserPlus, Users, Mail, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import AdminShoeForm from "../components/AdminShoeForm";
import { cn } from "@/lib/utils";

// Auth is handled by Supabase - see src/lib/supabase.js

// â”€â”€â”€ Sidebar nav items â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

// â”€â”€â”€ Login Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError("Invalid email or password.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="font-heading text-4xl font-bold tracking-tight mb-1">
            <span className="text-primary">TX</span>
            <span className="text-foreground">PRO</span>
            <span className="text-muted-foreground"> KICKS</span>
          </div>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label className="font-body text-sm text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              className="mt-1 bg-secondary border-border"
            />
          </div>
          <div>
            <Label className="font-body text-sm text-muted-foreground">Password</Label>
            <div className="relative mt-1">
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="bg-secondary border-border pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="font-body text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full font-heading tracking-wider" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Sign In
          </Button>
        </form>
        <p className="font-body text-xs text-muted-foreground text-center mt-6">
          Use the email and password from your Supabase Authentication settings.
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Sidebar({ activeSection, onNavigate, username, onLogout, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-30 flex flex-col transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <div className="font-heading text-xl font-bold tracking-tight">
            <span className="text-primary">TX</span>
            <span className="text-foreground">PRO</span>
            <span className="text-muted-foreground"> KICKS</span>
          </div>
          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mt-0.5">Admin Panel</p>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-sm flex-shrink-0">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-foreground truncate">{username}</p>
            <p className="font-body text-xs text-muted-foreground">Site Manager</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest px-3 mb-3">Main</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors text-left",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            View Website
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// â”€â”€â”€ Sort helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function applySort(arr, field, dir) {
  return [...arr].sort((a, b) => {
    let av = field === "profit" ? (a.price || 0) - (a.cost || 0) : a[field];
    let bv = field === "profit" ? (b.price || 0) - (b.cost || 0) : b[field];
    if (av == null) av = typeof bv === "string" ? "" : 0;
    if (bv == null) bv = typeof av === "string" ? "" : 0;
    if (typeof av === "string") return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return dir === "asc" ? av - bv : bv - av;
  });
}

function SortableHeader({ label, field, sortField, sortDir, onSort, className = "" }) {
  const active = sortField === field;
  return (
    <th className={cn("px-4 py-3", className)}>
      <button
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-1 font-body text-xs uppercase tracking-wider whitespace-nowrap transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        {active
          ? (sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />)
          : <ArrowUpDown className="w-3 h-3 text-muted-foreground/30" />}
      </button>
    </th>
  );
}

// â”€â”€â”€ Overview Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OverviewSection({ shoes, onNavigate }) {
  const [overviewSort, setOverviewSort] = useState({ field: "created_date", dir: "desc" });
  const [overviewStatusFilter, setOverviewStatusFilter] = useState("All");
  const [overviewShowAll, setOverviewShowAll] = useState(false);

  const available = shoes.filter((s) => s.status === "Available");
  const sold = shoes.filter((s) => s.status === "Sold");
  const onHold = shoes.filter((s) => s.status === "On Hold");

  const inventoryValue = available.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalRevenue = sold.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalProfit = sold.reduce((sum, s) => sum + ((s.price || 0) - (s.cost || 0)), 0);

  const stats = [
    { label: "Total Items", value: shoes.length, icon: LayoutGrid, color: "text-primary", bg: "bg-primary/10" },
    { label: "Available", value: available.length, icon: Package, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Sold", value: sold.length, icon: TrendingUp, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "On Hold", value: onHold.length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Inventory Value", value: `$${inventoryValue.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Total Profit", value: `$${totalProfit.toLocaleString()}`, icon: BarChart2, color: totalProfit >= 0 ? "text-green-400" : "text-destructive", bg: totalProfit >= 0 ? "bg-green-500/10" : "bg-destructive/10" },
  ];

  const sizeCounts = available.reduce((acc, s) => {
    const key = s.size ? `${s.size}` : "?";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sizeEntries = Object.entries(sizeCounts).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

  const alerts = [];
  if (available.length < 5) alerts.push({ type: "warning", msg: `Low inventory: only ${available.length} pair${available.length !== 1 ? "s" : ""} available.` });
  const noCostCount = shoes.filter((s) => s.status !== "Sold" && !s.cost).length;
  if (noCostCount > 0) alerts.push({ type: "info", msg: `${noCostCount} shoe${noCostCount !== 1 ? "s" : ""} missing a cost basis â€” profit tracking will be incomplete.` });
  const expiredHolds = onHold.filter((s) => s.hold_until && new Date(s.hold_until) < new Date());
  if (expiredHolds.length > 0) alerts.push({ type: "warning", msg: `${expiredHolds.length} On Hold item${expiredHolds.length !== 1 ? "s have" : " has"} an expired hold date.` });

  const handleOverviewSort = (field) =>
    setOverviewSort((prev) =>
      prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );

  const overviewBase = overviewStatusFilter === "All" ? shoes : shoes.filter((s) => s.status === overviewStatusFilter);
  const overviewSorted = applySort(overviewBase, overviewSort.field, overviewSort.dir);
  const overviewDisplay = overviewShowAll ? overviewSorted : overviewSorted.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="font-body text-muted-foreground mt-1">Welcome back. Here's a quick summary of your inventory.</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2 mb-6">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-body border",
                a.type === "warning"
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
                  : "bg-primary/10 border-primary/30 text-primary"
              )}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", s.bg)}>
                <Icon className={cn("w-5 h-5", s.color)} />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
              <p className="font-body text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Size breakdown */}
      {sizeEntries.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-primary" />
            <span className="font-heading text-base font-semibold text-foreground">Available by Size</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeEntries.map(([size, count]) => (
              <div key={size} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="font-heading text-sm font-bold text-foreground">{size}</span>
                <span className="font-body text-xs text-muted-foreground">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory table with status filter + sortable columns */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
          <span className="font-heading text-base font-semibold text-foreground">
            Inventory ({overviewBase.length})
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={overviewStatusFilter} onValueChange={(v) => { setOverviewStatusFilter(v); setOverviewShowAll(false); }}>
              <SelectTrigger className="h-8 text-xs bg-secondary border-border font-body w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "Available", "On Hold", "Sold"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => onNavigate("inventory")} className="font-body text-sm text-primary hover:underline whitespace-nowrap">
              Manage →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Inventory overview table">
            <thead>
              <tr className="border-b border-border/50">
                <SortableHeader label="Shoe" field="name" sortField={overviewSort.field} sortDir={overviewSort.dir} onSort={handleOverviewSort} className="text-left" />
                <SortableHeader label="Brand" field="brand" sortField={overviewSort.field} sortDir={overviewSort.dir} onSort={handleOverviewSort} className="text-left hidden sm:table-cell" />
                <SortableHeader label="Price" field="price" sortField={overviewSort.field} sortDir={overviewSort.dir} onSort={handleOverviewSort} className="text-left" />
                <SortableHeader label="Added" field="created_date" sortField={overviewSort.field} sortDir={overviewSort.dir} onSort={handleOverviewSort} className="text-left hidden md:table-cell" />
                <SortableHeader label="Status" field="status" sortField={overviewSort.field} sortDir={overviewSort.dir} onSort={handleOverviewSort} className="text-left" />
              </tr>
            </thead>
            <tbody>
              {overviewDisplay.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 font-body text-muted-foreground">
                    No inventory yet. Go to Inventory to add shoes.
                  </td>
                </tr>
              ) : (
                overviewDisplay.map((shoe) => (
                  <tr key={shoe.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                          <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <span className="font-body text-sm font-medium text-foreground truncate max-w-[140px]">{shoe.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell font-body text-sm text-muted-foreground">{shoe.brand}</td>
                    <td className="px-4 py-3 font-heading text-sm font-bold text-foreground">${shoe.price}</td>
                    <td className="px-4 py-3 hidden md:table-cell font-body text-sm text-muted-foreground">
                      {shoe.created_date ? new Date(shoe.created_date).toLocaleDateString() : "â€”"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-body text-xs",
                          shoe.status === "Available" ? "border-green-500/30 text-green-400" :
                          shoe.status === "Sold" ? "border-destructive/30 text-destructive" :
                          "border-yellow-500/30 text-yellow-400"
                        )}
                      >
                        {shoe.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {overviewBase.length > 5 && (
          <div className="px-6 py-3 border-t border-border/30 text-center">
            <button onClick={() => setOverviewShowAll(!overviewShowAll)} className="font-body text-sm text-primary hover:underline">
              {overviewShowAll ? "Show less" : `Show all ${overviewBase.length} items`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Inventory Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InventorySection({ shoes, addShoe, updateShoe, deleteShoeById }) {
  const [tab, setTab] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // All Inventory tab
  const [search, setSearch] = useState("");
  const [allBrand, setAllBrand] = useState("All");
  const [allCondition, setAllCondition] = useState("All");
  const [allSort, setAllSort] = useState({ field: "name", dir: "asc" });

  // On Hold tab
  const [holdSearch, setHoldSearch] = useState("");
  const [holdSort, setHoldSort] = useState({ field: "name", dir: "asc" });

  // Sales History tab
  const [historySearch, setHistorySearch] = useState("");
  const [historySort, setHistorySort] = useState({ field: "price", dir: "desc" });

  const brands = useMemo(
    () => ["All", ...new Set(shoes.map((s) => s.brand).filter(Boolean))].sort(),
    [shoes]
  );

  const makeSort = (setter) => (field) =>
    setter((prev) =>
      prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );

  const allBase = shoes.filter((s) => s.status !== "Sold" && s.status !== "On Hold");
  const allFiltered = applySort(
    allBase.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.name?.toLowerCase().includes(q) && !s.brand?.toLowerCase().includes(q)) return false;
      }
      if (allBrand !== "All" && s.brand !== allBrand) return false;
      if (allCondition !== "All" && s.condition !== allCondition) return false;
      return true;
    }),
    allSort.field, allSort.dir
  );

  const holdBase = shoes.filter((s) => s.status === "On Hold");
  const holdShoes = applySort(
    holdSearch
      ? holdBase.filter((s) =>
          s.name?.toLowerCase().includes(holdSearch.toLowerCase()) ||
          s.hold_name?.toLowerCase().includes(holdSearch.toLowerCase())
        )
      : holdBase,
    holdSort.field, holdSort.dir
  );

  const soldBase = shoes.filter((s) => s.status === "Sold");
  const soldShoes = applySort(
    historySearch
      ? soldBase.filter((s) =>
          s.name?.toLowerCase().includes(historySearch.toLowerCase()) ||
          s.brand?.toLowerCase().includes(historySearch.toLowerCase())
        )
      : soldBase,
    historySort.field, historySort.dir
  );

  const handleSave = async (data) => {
    if (editingShoe) {
      updateShoe(editingShoe.id, data);
      toast({ title: "Shoe updated!" });
    } else {
      addShoe(data);
      toast({ title: "Shoe added to inventory!" });
    }
    setEditingShoe(null);
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteShoeById(confirmDelete.id);
    setConfirmDelete(null);
    toast({ title: "Shoe removed from inventory." });
  };

  const handleRelease = (shoe) => {
    updateShoe(shoe.id, { status: "Available", hold_name: "", hold_until: "" });
    toast({ title: `${shoe.name} released back to Available.` });
  };

  const TABS = [
    { id: "all", label: `All Inventory (${allBase.length})` },
    { id: "holds", label: `On Hold (${holdBase.length})` },
    { id: "history", label: `Sales History (${soldBase.length})` },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Inventory</h1>
          <p className="font-body text-muted-foreground mt-1">Add, edit, and remove shoe listings. Changes reflect immediately on the public site.</p>
        </div>
        <Button onClick={() => { setEditingShoe(null); setFormOpen(true); }} className="font-heading tracking-wider flex-shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Shoe
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors whitespace-nowrap",
              tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* â”€â”€ All Inventory Tab â”€â”€ */}
      {tab === "all" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex flex-col gap-3 px-6 py-4 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="font-heading text-base font-semibold text-foreground flex-shrink-0">
                Active Listings ({allFiltered.length})
              </span>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, brand…"
                  aria-label="Search inventory"
                  className="pl-9 bg-secondary border-border"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={allBrand} onValueChange={setAllBrand}>
                <SelectTrigger className="h-8 text-xs bg-secondary border-border font-body w-36">
                  <Filter className="w-3 h-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={allCondition} onValueChange={setAllCondition}>
                <SelectTrigger className="h-8 text-xs bg-secondary border-border font-body w-36">
                  <Filter className="w-3 h-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "New", "Like New", "Gently Used"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {(allBrand !== "All" || allCondition !== "All" || search) && (
                <button
                  onClick={() => { setSearch(""); setAllBrand("All"); setAllCondition("All"); }}
                  className="h-8 px-2 font-body text-xs text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Inventory management table">
              <thead>
                <tr className="border-b border-border">
                  <SortableHeader label="Shoe" field="name" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left" />
                  <SortableHeader label="Brand" field="brand" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left hidden sm:table-cell" />
                  <SortableHeader label="Price" field="price" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left" />
                  <SortableHeader label="Size" field="size" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left hidden md:table-cell" />
                  <SortableHeader label="Condition" field="condition" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left hidden lg:table-cell" />
                  <SortableHeader label="Status" field="status" sortField={allSort.field} sortDir={allSort.dir} onSort={makeSort(setAllSort)} className="text-left" />
                  <th className="text-right font-body text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allFiltered.map((shoe) => (
                  <tr key={shoe.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                          <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <span className="font-body text-sm font-medium text-foreground truncate max-w-[130px]">{shoe.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell font-body text-sm text-muted-foreground">{shoe.brand}</td>
                    <td className="px-4 py-3 font-heading text-sm font-bold text-foreground">${shoe.price}</td>
                    <td className="px-4 py-3 hidden md:table-cell font-body text-sm text-muted-foreground">{shoe.size}</td>
                    <td className="px-4 py-3 hidden lg:table-cell font-body text-sm text-muted-foreground">{shoe.condition}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("font-body text-xs",
                        shoe.status === "Available" ? "border-green-500/30 text-green-400" :
                        shoe.status === "Sold" ? "border-destructive/30 text-destructive" :
                        "border-yellow-500/30 text-yellow-400"
                      )}>{shoe.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingShoe(shoe); setFormOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label={`Edit ${shoe.name}`}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(shoe)} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={`Delete ${shoe.name}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {allFiltered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-14">
                      <Package className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="font-body text-muted-foreground">
                        {search || allBrand !== "All" || allCondition !== "All"
                          ? "No shoes match your filters."
                          : 'No active inventory. Click "Add Shoe" to get started.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â”€â”€ On Hold Tab â”€â”€ */}
      {tab === "holds" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
            <div>
              <span className="font-heading text-base font-semibold text-foreground">On Hold ({holdShoes.length})</span>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Shoes reserved for specific customers. Release to make them available again.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={holdSearch} onChange={(e) => setHoldSearch(e.target.value)} placeholder="Search shoe or name…" className="pl-9 bg-secondary border-border text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="On hold shoes table">
              <thead>
                <tr className="border-b border-border">
                  <SortableHeader label="Shoe" field="name" sortField={holdSort.field} sortDir={holdSort.dir} onSort={makeSort(setHoldSort)} className="text-left" />
                  <SortableHeader label="Brand" field="brand" sortField={holdSort.field} sortDir={holdSort.dir} onSort={makeSort(setHoldSort)} className="text-left hidden sm:table-cell" />
                  <SortableHeader label="Price" field="price" sortField={holdSort.field} sortDir={holdSort.dir} onSort={makeSort(setHoldSort)} className="text-left" />
                  <SortableHeader label="Hold Name" field="hold_name" sortField={holdSort.field} sortDir={holdSort.dir} onSort={makeSort(setHoldSort)} className="text-left" />
                  <SortableHeader label="Hold Until" field="hold_until" sortField={holdSort.field} sortDir={holdSort.dir} onSort={makeSort(setHoldSort)} className="text-left hidden md:table-cell" />
                  <th className="text-right font-body text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdShoes.map((shoe) => {
                  const expired = shoe.hold_until && new Date(shoe.hold_until) < new Date();
                  return (
                    <tr key={shoe.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                            <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <span className="font-body text-sm font-medium text-foreground truncate max-w-[130px]">{shoe.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-body text-sm text-muted-foreground">{shoe.brand}</td>
                      <td className="px-4 py-3 font-heading text-sm font-bold text-foreground">${shoe.price}</td>
                      <td className="px-4 py-3 font-body text-sm text-foreground">{shoe.hold_name || <span className="text-muted-foreground italic">â€”</span>}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {shoe.hold_until ? (
                          <span className={cn("font-body text-sm", expired ? "text-destructive font-semibold" : "text-muted-foreground")}>
                            {expired && <AlertTriangle className="inline w-3.5 h-3.5 mr-1 mb-0.5" />}
                            {new Date(shoe.hold_until).toLocaleDateString()}{expired && " (expired)"}
                          </span>
                        ) : (
                          <span className="font-body text-sm text-muted-foreground italic">No date</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleRelease(shoe)} className="h-8 font-body text-xs text-green-400 border-green-500/30 hover:bg-green-500/10" aria-label={`Release ${shoe.name} from hold`}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Release
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setEditingShoe(shoe); setFormOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label={`Edit ${shoe.name}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {holdShoes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-14">
                      <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="font-body text-muted-foreground">
                        {holdSearch ? "No holds match your search." : 'No shoes on hold. Set a shoe\'s status to "On Hold" to see it here.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â”€â”€ Sales History Tab â”€â”€ */}
      {tab === "history" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
            <div>
              <span className="font-heading text-base font-semibold text-foreground">Sales History ({soldShoes.length})</span>
              <p className="font-body text-xs text-muted-foreground mt-0.5">All shoes marked as Sold. Profit = Sale Price âˆ’ Cost Paid.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Search sold shoes…" className="pl-9 bg-secondary border-border text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Sales history table">
              <thead>
                <tr className="border-b border-border">
                  <SortableHeader label="Shoe" field="name" sortField={historySort.field} sortDir={historySort.dir} onSort={makeSort(setHistorySort)} className="text-left" />
                  <SortableHeader label="Brand" field="brand" sortField={historySort.field} sortDir={historySort.dir} onSort={makeSort(setHistorySort)} className="text-left hidden sm:table-cell" />
                  <SortableHeader label="Sale Price" field="price" sortField={historySort.field} sortDir={historySort.dir} onSort={makeSort(setHistorySort)} className="text-left" />
                  <SortableHeader label="Cost" field="cost" sortField={historySort.field} sortDir={historySort.dir} onSort={makeSort(setHistorySort)} className="text-left hidden md:table-cell" />
                  <SortableHeader label="Profit" field="profit" sortField={historySort.field} sortDir={historySort.dir} onSort={makeSort(setHistorySort)} className="text-left" />
                  <th className="text-right font-body text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {soldShoes.map((shoe) => {
                  const profit = (shoe.price || 0) - (shoe.cost || 0);
                  const hasCost = shoe.cost !== undefined && shoe.cost !== null && shoe.cost !== "";
                  return (
                    <tr key={shoe.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                            <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <span className="font-body text-sm font-medium text-foreground truncate max-w-[130px]">{shoe.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-body text-sm text-muted-foreground">{shoe.brand}</td>
                      <td className="px-4 py-3 font-heading text-sm font-bold text-foreground">${shoe.price}</td>
                      <td className="px-4 py-3 hidden md:table-cell font-body text-sm text-muted-foreground">
                        {hasCost ? `$${shoe.cost}` : <span className="italic text-muted-foreground/50">â€”</span>}
                      </td>
                      <td className="px-4 py-3">
                        {hasCost ? (
                          <span className={cn("font-heading text-sm font-bold", profit >= 0 ? "text-green-400" : "text-destructive")}>
                            {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
                          </span>
                        ) : (
                          <span className="font-body text-xs text-muted-foreground italic">No cost set</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingShoe(shoe); setFormOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label={`Edit ${shoe.name}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {soldShoes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-14">
                      <TrendingUp className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="font-body text-muted-foreground">
                        {historySearch ? "No sales match your search." : "No sales yet. Sold shoes will appear here."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminShoeForm
        shoe={editingShoe}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingShoe(null); }}
        onSave={handleSave}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">Remove Shoe?</AlertDialogTitle>
            <AlertDialogDescription className="font-body text-muted-foreground">
              This will permanently remove "{confirmDelete?.name}" from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 font-heading tracking-wider">DELETE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// â”€â”€â”€ Settings Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SettingsSection({ shoes, addShoe, clearAll }) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSaveCreds = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    if (!newPass) {
      setAlert({ type: "error", message: "New password is required." });
      return;
    }
    if (newPass !== confirmPass) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (newPass.length < 8) {
      setAlert({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({ type: "success", message: "Password updated successfully." });
      setNewPass("");
      setConfirmPass("");
    }
  };


  // ── User Management ──────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserConfirmPass, setNewUserConfirmPass] = useState("");
  const [userAlert, setUserAlert] = useState({ type: "", message: "" });
  const [confirmRemoveUser, setConfirmRemoveUser] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: true }).then(({ data, error }) => {
      if (!error) setUsers(data || []);
      setUsersLoading(false);
    });
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserAlert({ type: "", message: "" });
    if (!newUserEmail || !newUserPass) {
      setUserAlert({ type: "error", message: "Email and password are required." });
      return;
    }
    if (newUserPass !== newUserConfirmPass) {
      setUserAlert({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (newUserPass.length < 8) {
      setUserAlert({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "create", email: newUserEmail, password: newUserPass },
    });
    if (error || data?.error) {
      setUserAlert({ type: "error", message: data?.error || error.message });
      return;
    }
    setUsers((prev) => [...prev, { id: data.user.id, email: data.user.email, created_at: data.user.created_at }]);
    setNewUserEmail("");
    setNewUserPass("");
    setNewUserConfirmPass("");
    setUserAlert({ type: "success", message: `User ${newUserEmail} created successfully.` });
  };

  const handleRemoveUser = async (userId, email) => {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "delete", userId },
    });
    if (error || data?.error) {
      setUserAlert({ type: "error", message: data?.error || error.message });
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setConfirmRemoveUser(null);
    setUserAlert({ type: "success", message: `User ${email} removed.` });
  };

  const importRef = useRef(null);

  const handleExport = () => {
    const rows = shoes.map((s) => ({
      ID:           s.id,
      Brand:        s.brand,
      Name:         s.name,
      Price:        s.price,
      Cost:         s.cost ?? "",
      Size:         s.size,
      Condition:    s.condition,
      Status:       s.status,
      Category:     s.category,
      Description:  s.description,
      Image_URL:    s.image_url,
      Hold_Name:    s.hold_name ?? "",
      Hold_Until:   s.hold_until ?? "",
      Created_Date: s.created_date,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `txprokicks-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!importRef.current) importRef.current = e.target;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        if (!rows.length) { alert("No rows found in the file."); return; }
        const imported = rows.map((r) => ({
          brand:            r.Brand || "",
          name:             r.Name || "",
          price:            Number(r.Price) || 0,
          cost:             r.Cost !== undefined && r.Cost !== "" ? Number(r.Cost) : null,
          size:             String(r.Size || ""),
          condition:        r.Condition || "New",
          status:           r.Status || "Available",
          category:         r.Category || "Sneakers",
          description:      r.Description || "",
          image_url:        r.Image_URL || "",
          additional_images: [],
          hold_name:        r.Hold_Name || "",
          hold_until:       r.Hold_Until || null,
          created_date:     r.Created_Date || new Date().toISOString(),
        }));
        const confirmed = window.confirm(
          `Import ${imported.length} shoe${imported.length !== 1 ? "s" : ""}? This will ADD them to your existing inventory.`
        );
        if (!confirmed) return;
        await Promise.all(imported.map((shoe) => addShoe(shoe)));
        e.target.value = "";
        alert(`${imported.length} shoes imported successfully.`);
      } catch (err) {
        console.error(err);
        alert("Failed to read file. Make sure it's a valid .xlsx, .xls, or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearInventory = async () => {
    if (!window.confirm("This will permanently delete ALL shoes from your inventory. This cannot be undone. Are you sure?")) return;
    await clearAll();
    alert("Inventory cleared.");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
        <p className="font-body text-muted-foreground mt-1">Manage your admin password and inventory data.</p>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-1">Change Password</h2>
        <p className="font-body text-sm text-muted-foreground mb-5">Update your Supabase admin password.</p>
        <form onSubmit={handleSaveCreds} noValidate className="space-y-4 max-w-md">
          <div>
            <Label className="font-body text-sm text-muted-foreground">New Password <span className="text-destructive">*</span></Label>
            <Input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 bg-secondary border-border"
            />
          </div>
          <div>
            <Label className="font-body text-sm text-muted-foreground">Confirm New Password <span className="text-destructive">*</span></Label>
            <Input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 bg-secondary border-border"
            />
          </div>
          {alert.message && (
            <p className={cn(
              "font-body text-sm rounded-lg px-3 py-2",
              alert.type === "error"
                ? "text-destructive bg-destructive/10 border border-destructive/20"
                : "text-green-400 bg-green-500/10 border border-green-500/20"
            )}>
              {alert.message}
            </p>
          )}
          <Button type="submit" size="sm" className="font-heading tracking-wider">
            Save Password
          </Button>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-1">Data Management</h2>
        <p className="font-body text-sm text-muted-foreground mb-5">
          Export your inventory as an Excel file, import from .xlsx, .xls, or .csv, or clear all data.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="font-heading tracking-wider">
            <Download className="w-4 h-4 mr-2" /> Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-file-input").click()}
            className="font-heading tracking-wider"
          >
            <Upload className="w-4 h-4 mr-2" /> Import File
          </Button>
          <input
            id="import-file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearInventory}
            className="font-heading tracking-wider border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All Inventory
          </Button>
        </div>
        <p className="font-body text-xs text-muted-foreground mt-4">
          Import columns: <span className="text-foreground">Brand, Name, Price, Cost, Size, Condition, Status, Category, Description, Image_URL, Hold_Name, Hold_Until</span>.
          Download an existing export to use as a template.
        </p>
      </div>

      {/* User Management */}
      <div className="bg-card border border-border rounded-xl p-6 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">User Management</h2>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-5">
          Create and remove admin users who can log into this dashboard. Requires the{" "}
          <code className="text-foreground">manage-users</code> Edge Function to be deployed.
        </p>

        {/* Add User Form */}
        <div className="bg-secondary/50 border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="font-heading text-sm font-semibold text-foreground">Add New User</span>
          </div>
          <form onSubmit={handleCreateUser} noValidate className="space-y-3 max-w-md">
            <div>
              <Label className="font-body text-sm text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
                autoComplete="off"
                required
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Password <span className="text-destructive">*</span></Label>
              <Input
                type="password"
                value={newUserPass}
                onChange={(e) => setNewUserPass(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <Label className="font-body text-sm text-muted-foreground">Confirm Password <span className="text-destructive">*</span></Label>
              <Input
                type="password"
                value={newUserConfirmPass}
                onChange={(e) => setNewUserConfirmPass(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 bg-background border-border"
              />
            </div>
            {userAlert.message && (
              <p className={cn(
                "font-body text-sm rounded-lg px-3 py-2",
                userAlert.type === "error"
                  ? "text-destructive bg-destructive/10 border border-destructive/20"
                  : "text-green-400 bg-green-500/10 border border-green-500/20"
              )}>
                {userAlert.message}
              </p>
            )}
            <Button type="submit" size="sm" className="font-heading tracking-wider">
              <UserPlus className="w-4 h-4 mr-2" /> Create User
            </Button>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-heading text-sm font-semibold text-foreground">Current Users</span>
          </div>
          {usersLoading ? (
            <div className="flex items-center gap-2 py-4 text-muted-foreground font-body text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading users…
            </div>
          ) : users.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground italic py-2">No users found. The profiles table may not be set up yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-sm flex-shrink-0">
                      {u.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{u.email}</p>
                      {u.created_at && (
                        <p className="font-body text-xs text-muted-foreground">
                          Added {new Date(u.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmRemoveUser(u)}
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${u.email}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!confirmRemoveUser} onOpenChange={() => setConfirmRemoveUser(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">Remove User?</AlertDialogTitle>
            <AlertDialogDescription className="font-body text-muted-foreground">
              This will permanently remove <strong className="text-foreground">{confirmRemoveUser?.email}</strong> from the admin dashboard. They will no longer be able to sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemoveUser(confirmRemoveUser?.id, confirmRemoveUser?.email)}
              className="bg-destructive hover:bg-destructive/90 font-heading tracking-wider"
            >
              REMOVE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// â”€â”€â”€ Main Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Admin() {
  const { shoes, loading, addShoe, updateShoe, deleteShoe, clearAll } = useShoes();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveSection("overview");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        username={user.email}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content shifted right on desktop */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground hover:text-primary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-foreground">
            {NAV_ITEMS.find((i) => i.id === activeSection)?.label || "Overview"}
          </span>
        </div>

        <main className="flex-1 p-6 lg:p-8">
          {activeSection === "overview" && (
            <OverviewSection shoes={shoes} onNavigate={setActiveSection} />
          )}
          {activeSection === "inventory" && (
            <InventorySection
              shoes={shoes}
              addShoe={addShoe}
              updateShoe={updateShoe}
              deleteShoeById={deleteShoe}
            />
          )}
          {activeSection === "settings" && (
            <SettingsSection shoes={shoes} addShoe={addShoe} clearAll={clearAll} />
          )}
        </main>
      </div>
    </div>
  );
}
