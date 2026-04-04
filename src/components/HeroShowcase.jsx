// @ts-nocheck
import { useMemo } from "react";
import { img, PHOTOS } from "@/assets/images";
import { useShoes } from "@/lib/ShoeContext";

const STRIP_CONFIG = [
  { duration: "16s", direction: "normal",  delay: "0s"   },
  { duration: "22s", direction: "reverse", delay: "-6s"  },
  { duration: "19s", direction: "normal",  delay: "-10s" },
];

// Fallback pool used when inventory is empty / loading
const FALLBACK_URLS = Object.values(PHOTOS).map((id) => img(id, 380, 80));

export default function HeroShowcase() {
  const { shoes } = useShoes();

  // Build a deduped URL pool: live inventory photos first, then fallbacks to pad
  const pool = useMemo(() => {
    const live = shoes
      .filter((s) => s.image_url)
      .map((s) => s.image_url);
    // Merge, remove duplicates, keep at least 9 items for 3 strips × 3
    const merged = [...new Set([...live, ...FALLBACK_URLS])];
    return merged;
  }, [shoes]);

  // Split pool evenly across 3 strips; each strip needs ≥ 4 items for a smooth loop
  const strips = useMemo(() => {
    const minPerStrip = 4;
    return STRIP_CONFIG.map((cfg, i) => {
      // Rotate items by strip index so strips don't show the same photos
      const rotated = [...pool.slice(i), ...pool.slice(0, i)];
      // Ensure at least minPerStrip items by repeating
      let items = rotated;
      while (items.length < minPerStrip) items = [...items, ...rotated];
      // Each strip takes every 3rd item starting at its index, giving variety
      const stripItems = pool.filter((_, idx) => idx % 3 === i);
      const final = stripItems.length >= minPerStrip ? stripItems : rotated.slice(0, Math.max(minPerStrip, Math.ceil(pool.length / 3)));
      return { ...cfg, items: final };
    });
  }, [pool]);

  return (
    <div className="absolute inset-0 flex gap-2 overflow-hidden p-2">
      {/* Top / bottom fade */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, transparent 14%, transparent 86%, black 100%)",
        }}
      />
      {/* Left bleed into text panel */}
      <div
        className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, black, transparent)" }}
      />

      {strips.map((strip, si) => {
        // Double for seamless loop
        const doubled = [...strip.items, ...strip.items];
        return (
          <div key={si} className="flex-1 flex flex-col overflow-hidden">
            <div
              style={{
                animationName: "heroStripScroll",
                animationDuration: strip.duration,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: strip.direction,
                animationDelay: strip.delay,
              }}
            >
              {doubled.map((url, i) => (
                <div
                  key={i}
                  className="mb-2 rounded-xl overflow-hidden"
                  style={{ aspectRatio: "1 / 1.15" }}
                >
                  <img
                    src={url}
                    alt="sneaker"
                    className="w-full h-full object-cover opacity-80"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
