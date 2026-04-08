// Canonical brand options for filters and a small normalizer
export const BRAND_OPTIONS = ["All", "Jordan", "Nike", "Yeezy", "ASICS", "New Balance"];

export function normalizeBrand(raw) {
  if (!raw && raw !== 0) return "";
  const s = String(raw).trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  if (lower.includes("jordan")) return "Jordan";
  if (lower.includes("nike")) return "Nike";
  if (lower.includes("yeezy")) return "Yeezy";
  if (lower.includes("asics")) return "ASICS";
  if (lower.includes("new balance") || lower.includes("newbalance")) return "New Balance";
  return s;
}
