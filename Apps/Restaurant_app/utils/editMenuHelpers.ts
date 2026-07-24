export const cleanText = (t: string) => (t || "").trim();

export const parsePrice = (v: string) =>
  Number(String(v || "").replace(/,/g, "")) || 0;

export const safeNumber = (v: any) => {
  if (v === null || v === undefined) return 0;

  const cleaned = String(v).replace(/,/g, "").trim();
  const n = Number(cleaned);

  return Number.isFinite(n) ? n : 0;
};