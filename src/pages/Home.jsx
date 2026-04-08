import { useState } from "react";
import { useShoes } from "@/lib/ShoeContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import ShoeCard from "../components/ShoeCard";
import CheckoutModal from "../components/CheckoutModal";
import HeroShowcase from "../components/HeroShowcase";
import Footer from "../components/Footer";
import { BRAND_OPTIONS } from "@/lib/brand-utils";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Use the canonical brand options (exclude the initial "All" entry)
const BRANDS = BRAND_OPTIONS.slice(1);

// All image_url values verified via Unsplash photo pages — exact shoe descriptions confirmed
export default function Home() {
  const { filterShoes, loading } = useShoes();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Show the 8 most recently added available shoes
  const shoes = filterShoes({ status: "Available" })
    .sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0))
    .slice(0, 8);

  // Build a longer repeated brand list for a seamless marquee
  const repeatCount = 6;
  const baseList = BRANDS;
  const longList = Array.from({ length: repeatCount }).flatMap(() => baseList);
  const marqueeItems = [...longList, ...longList];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-black overflow-hidden flex items-stretch">
        {/* Dot grid background */}
        <div className="absolute inset-0 hero-grid" />

        {/* Corner accent glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[650px] h-[650px] bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Left: Text content */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-16 w-full lg:w-[52%]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-7"
          >
            {/* Eyebrow with animated line */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 36 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="h-[2px] bg-primary block flex-shrink-0"
              />
              <p className="font-body text-xs font-semibold tracking-[0.3em] text-primary uppercase">
                East Texas's Premier Sneaker Destination
              </p>
            </motion.div>

            {/* Main title */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-7xl md:text-[108px] leading-none text-white tracking-wide"
            >
              TX<span className="text-primary">PRO</span>
              <br />
              KICKS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="font-body text-base text-white/55 max-w-xs leading-relaxed"
            >
              Authentic sneakers. Real heat. From the heart of East Texas.
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Link to="/inventory">
                <Button
                  size="lg"
                  className="font-heading tracking-[0.2em] text-base px-10 py-6 bg-primary hover:bg-primary/90 text-white rounded-none group"
                >
                  BROWSE KICKS
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-8 pt-5 border-t border-white/10"
            >
              {[
                { value: "10,000+", label: "Pairs Sold" },
                { value: "Est. 2020", label: "Founded" },
                { value: "100%", label: "Authentic" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl text-white leading-none">{stat.value}</p>
                  <p className="font-body text-[10px] text-white/35 tracking-[0.2em] uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Photo strip showcase (desktop) */}
        <div className="hidden lg:block relative flex-1 min-h-[520px] overflow-hidden">
          <HeroShowcase />
        </div>
      </section>

      {/* Mobile photo showcase */}
      <div className="block lg:hidden relative h-[360px] bg-black overflow-hidden">
        <HeroShowcase />
      </div>

      {/* Brand marquee strip */}
      <div className="overflow-hidden bg-primary border-y border-red-900/40 py-[10px]">
          <div className="flex animate-marquee whitespace-nowrap">
            {marqueeItems.map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="font-heading text-white/85 text-sm tracking-[0.25em] mx-5 shrink-0"
              >
                {brand}
                <span className="ml-5 text-white/35">•</span>
              </span>
            ))}
          </div>
      </div>

      {/* Latest Drops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-[0.1em]">LATEST DROPS</h2>
            <p className="font-body text-muted-foreground mt-1">Fresh inventory just added</p>
          </div>
          <Link to="/inventory" className="font-body text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} onClick={() => navigate(`/shoe/${shoe.id}`)} />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}