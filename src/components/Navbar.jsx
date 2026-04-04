import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X, ShoppingCart, Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");
  const { items, setCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl tracking-widest text-white">TX<span className="text-primary">PRO</span>KICKS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              SHOP
            </Link>
            <Link
              to="/inventory"
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/inventory" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              INVENTORY
            </Link>
            <Link
              to="/about"
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              ABOUT
            </Link>
            <Link
              to="/admin"
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1.5 ${
                location.pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              ADMIN
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <a
                href="https://www.instagram.com/txprokicks/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/Txprokicks/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cart button */}
          {!isAdmin && (
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-[10px] font-heading font-bold w-4 h-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block font-body text-sm font-medium text-muted-foreground hover:text-primary">SHOP</Link>
          <Link to="/inventory" onClick={() => setMobileOpen(false)} className="block font-body text-sm font-medium text-muted-foreground hover:text-primary">INVENTORY</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block font-body text-sm font-medium text-muted-foreground hover:text-primary">ABOUT</Link>
          <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 font-body text-sm font-medium text-muted-foreground hover:text-primary">
            <ShieldCheck className="w-4 h-4" /> ADMIN
          </Link>
        </div>
      )}
    </nav>
  );
}