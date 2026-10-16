export const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

const BN = "০১২৩৪৫৬৭৮৯";
export const toBn = (n) => String(n).replace(/\d/g, (d) => BN[d]);
// Bengali / English numeral string -> real number (for correct sorting)
export const toNum = (v) => {
  if (typeof v === "number") return v;
  const s = String(v ?? "")
    .replace(/[০-৯]/g, (d) => BN.indexOf(d))
    .replace(/,/g, "")
    .replace(/[^\d.\-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};
export const fmtPrice = (n) => toBn(Number(n).toLocaleString("en-US")) + " টাকা";
export const fmtUnit = (u) => (!u ? "" : /^প্রতি/.test(u) ? u : `প্রতি ${u}`);

// The API field names may differ slightly - adjust ONLY here if needed.
export function normalize(p = {}) {
  const markets = p.markets ?? p.bazars ?? p.marketPrices ?? p.market_prices ?? [];
  return {
    slug: String(p.slug ?? p.id ?? p._id),
    name: p.name_bn ?? p.nameBn ?? p.name ?? p.title ?? "",
    emoji: p.emoji ?? p.icon ?? "🛒",
    unit: p.unit ?? "",
    price: toNum(p.price ?? p.todayPrice ?? p.current_price ?? p.currentPrice),
    change: toNum(p.change ?? p.changePercent ?? p.change_percent ?? p.percentage),
    category: p.category ?? p.categorySlug ?? "",
    categories: [].concat(p.categories ?? p.tags ?? p.category ?? []),
    description: p.description ?? p.summary ?? p.subtitle ?? "",
    min: toNum(p.min ?? p.minPrice ?? p.min_price),
    max: toNum(p.max ?? p.maxPrice ?? p.max_price),
    avg: toNum(p.avg ?? p.average ?? p.avgPrice ?? p.avg_price),
    markets: (Array.isArray(markets) ? markets : []).map((m) => ({
      name: m.name ?? m.market ?? m.bazar ?? m.title ?? "",
      price: toNum(m.price ?? m.todayPrice ?? m.value),
    })),
  };
}

const unwrap = (j) =>
  j?.data ?? j?.products ?? j?.categories ?? j?.product ?? j?.category ?? j;

export async function getJSON(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error("not-found");
  return unwrap(await res.json());
}
export const getProducts = async (qs = "") =>
  (await getJSON("/products" + qs)).map(normalize);
export const getProduct = async (slug) =>
  normalize(await getJSON("/products/" + slug));
export const getCategories = async () => {
  const c = await getJSON("/categories");
  return c.map((x) => ({
    slug: String(x.slug ?? x.id ?? x.name),
    name: x.name_bn ?? x.name ?? x.title ?? x.slug,
    icon: x.icon ?? x.emoji ?? "",
  }));
};
