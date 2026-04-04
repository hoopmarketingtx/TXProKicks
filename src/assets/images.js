// ─── Local assets ─────────────────────────────────────────────────────────────
import accountImgSrc from "./images/account.jpg";
import jordan1ImgSrc from "./images/jordan1.webp";

export { accountImgSrc, jordan1ImgSrc };

// ─── Unsplash helper ──────────────────────────────────────────────────────────
// Usage: img(PHOTOS.jordan1CactusJack)         → 600w thumbnail (default)
//        img(PHOTOS.jordan1CactusJack, 900, 85) → 900w hero
const BASE = "https://images.unsplash.com/";
export const img = (id, w = 600, q = 80) => `${BASE}${id}?w=${w}&q=${q}`;

// ─── Verified Unsplash photo IDs ──────────────────────────────────────────────
// Each ID confirmed via individual Unsplash photo page scraping.
export const PHOTOS = {
  jordan1CactusJack:  "photo-1600686436232-82a3c677bc51",
  airForce1White:     "photo-1597350584914-55bb62285896",
  airMax90Orange:     "photo-1584735175097-719d848f8449",
  sbBlazerMid:        "photo-1591370409347-2fd43b7842de",
  sbBlazerLow:        "photo-1596644882941-2c7645aa4e5e",
  jordan1LowRedWhite: "photo-1706611761038-0c1e2c06e623",
  airForce1Shadow:    "photo-1636718281370-b5e3f51a5af2",
  airForce1TripleWht: "photo-1656164847621-4665c4c397da",
  nikeWhiteRedBlack:  "photo-1636718282214-0b4162a154f0",
  sneakerDarkProfile: "photo-1755194757953-a9301005114b",
};

// ─── 3D model ─────────────────────────────────────────────────────────────────
// Nike Air Force 1 — self-hosted in /public, Draco-compressed
export const MODEL_3D_URL = "/shoe-draco.glb";
export const DRACO_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
