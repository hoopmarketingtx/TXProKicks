import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, ShoppingCart, Instagram, Facebook } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { items, setCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2">
          <Link to="/" className="flex-none flex items-center gap-2">
            <span className="font-heading text-xl sm:text-2xl tracking-widest text-white">TX<span className="text-primary">PRO</span>KICKS</span>
          </Link>

          {/* Nav links - all screen sizes */}
          <div className="flex-1 flex items-center justify-center gap-3 md:gap-8">
            <Link
              to="/"
              className={`font-body text-[10px] md:text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-white/60"
              }`}
            >
              SHOP
            </Link>
            <Link
              to="/inventory"
              className={`font-body text-[10px] md:text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/inventory" ? "text-primary" : "text-white/60"
              }`}
            >
              INVENTORY
            </Link>
            <Link
              to="/about"
              className={`font-body text-[10px] md:text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-white/60"
              }`}
            >
              ABOUT
            </Link>
            <Link
              to="/admin"
              className={`font-body text-[10px] md:text-sm font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1 ${
                location.pathname.startsWith("/admin") ? "text-primary" : "text-white/60"
              }`}
            >
              <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
              ADMIN
            </Link>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6">
              <a
                href="https://www.instagram.com/txprokicks/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/Txprokicks/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cart button */}
          {!isAdmin && (
            <button
              onClick={() => setCartOpen(true)}
              className="flex-none relative text-white/70 hover:text-white transition-colors"
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
        </div>
      </div>
    </nav>
  );
}