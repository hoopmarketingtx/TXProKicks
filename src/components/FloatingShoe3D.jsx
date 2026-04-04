import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { img, PHOTOS } from "@/assets/images";

const SHOE_IMAGES = [
  { label: "Air Jordan 1 Cactus Jack",  url: img(PHOTOS.jordan1CactusJack, 900, 85) },
  { label: "Nike Air Force 1",           url: img(PHOTOS.airForce1White, 900, 85) },
  { label: "Nike Air Max",               url: img(PHOTOS.airMax90Orange, 900, 85) },
  { label: "Nike Air Force 1",           url: img(PHOTOS.nikeWhiteRedBlack, 900, 85) },
  { label: "Sneaker",                    url: img(PHOTOS.sneakerDarkProfile, 900, 85) },
];

export default function FloatingShoe3D() {
  const [idx, setIdx] = useState(0);

  // Auto-cycle every 4.5 s
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SHOE_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: 2 + (i % 3),
        left: 8 + ((i * 13) % 84),
        top: 8 + ((i * 17) % 84),
        delay: i * 0.35,
        duration: 3 + (i % 3),
      })),
    []
  );

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col items-center justify-center overflow-hidden">
      {/* Pulsing glow orb */}
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.22, 0.48, 0.22] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[360px] h-[360px] rounded-full bg-primary/40 blur-[90px] pointer-events-none"
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/60 pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Shoe image carousel */}
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: "900px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.88, rotateY: -25 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotateY: 25 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={SHOE_IMAGES[idx].url}
                alt={SHOE_IMAGES[idx].label}
                className="w-[280px] md:w-[420px] object-cover select-none"
                draggable={false}
                style={{
                  // Multi-stop radial fade: fully opaque center → fully transparent before edges
                  maskImage:
                    "radial-gradient(ellipse 72% 66% at 50% 52%, black 20%, black 42%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.3) 66%, transparent 78%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 72% 66% at 50% 52%, black 20%, black 42%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.3) 66%, transparent 78%)",
                  filter:
                    "drop-shadow(0 22px 50px rgba(180, 20, 35, 0.9)) brightness(1.08) contrast(1.05)",
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Ground shadow */}
        <motion.div
          animate={{ scaleX: [1, 1.28, 1], opacity: [0.5, 0.22, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="-mt-3 pointer-events-none"
          style={{
            width: 200,
            height: 16,
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Dot indicators */}
        <div className="flex justify-center gap-[6px] mt-7">
          {SHOE_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                i === idx ? "w-5 bg-primary" : "w-[5px] bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
