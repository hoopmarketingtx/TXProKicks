// Helpers for generating US size options and parsing sizes
export function toHalf(v) {
  return Math.round(v * 2) / 2;
}

export function fmt(v) {
  return Number.isInteger(v) ? `${v}` : `${v}`;
}

// Generate a standard range of US men's sizes with W/Y conversions
export function generateStandardSizeOptions() {
  // Explicit mapping provided by user (covers youth -> women for small sizes,
  // then men's sizes with women conversion for larger sizes).
  const raw = [
    { value: 3.5, kind: "Y", women: 5 },
    { value: 4, kind: "Y", women: 5.5 },
    { value: 4.5, kind: "Y", women: 6 },
    { value: 5, kind: "Y", women: 6.5 },
    { value: 5.5, kind: "Y", women: 7 },
    { value: 6, kind: "Y", women: 7.5 },
    { value: 6.5, kind: "Y", women: 8 },
    { value: 7, kind: "Y", women: 8.5 },
    { value: 7.5, kind: "M", women: 9 },
    { value: 8, kind: "M", women: 9.5 },
    { value: 8.5, kind: "M", women: 10 },
    { value: 9, kind: "M", women: 10.5 },
    { value: 9.5, kind: "M", women: 11 },
    { value: 10, kind: "M", women: 11.5 },
    { value: 10.5, kind: "M", women: 12 },
    { value: 11, kind: "M", women: 12.5 },
    { value: 11.5, kind: "M", women: 13 },
    { value: 12, kind: "M", women: 13.5 },
    { value: 12.5, kind: "M", women: 14 },
    { value: 13, kind: "M", women: 14.5 },
    { value: 13.5, kind: "M", women: 15 },
    { value: 14, kind: "M", women: 15.5 },
    { value: 14.5, kind: "M", women: 16 },
    { value: 15, kind: "M", women: 16.5 },
    { value: 16, kind: "M", women: 17.5 },
    { value: 17, kind: "M", women: 18.5 },
    { value: 18, kind: "M", women: 19.5 },
  ];

  return raw.map((r) => {
    const { value, kind, women } = r;
    const primary = `${kind} ${fmt(value)}`;
    const secondary = `W ${fmt(women)}`;
    return { value: String(value), kind, women, primary, secondary };
  });
}

// Parse a size-like string and return the value rounded to the nearest 0.5
export function parseSizeValue(sizeStr) {
  const n = parseFloat(String(sizeStr || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? toHalf(n) : null;
}
