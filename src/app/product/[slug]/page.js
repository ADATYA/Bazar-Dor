"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProduct, fmtPrice, fmtUnit } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import Emoji from "@/components/Emoji";
import { Badge } from "@/components/ProductCard";
import NotFound from "../../not-found";

export default function ProductPage() {
  const { slug } = useParams();
  const { data: p, loading, error } = useFetch(() => getProduct(slug), [slug]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><div className="skeleton h-72 w-full" /></div>;
  if (error || !p?.name) return <NotFound />;

  const stats = [["সর্বনিম্ন দাম", p.min], ["সর্বোচ্চ দাম", p.max], ["গড় দাম", p.avg]];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="link text-sm">← হোম</Link>
      <div className="mt-4 flex items-start gap-4">
        <Emoji value={p.emoji} className="text-6xl" />
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="text-base-content/70 mt-1">{p.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {p.categories.filter(Boolean).map((c, i) => (
              <span key={i} className="badge badge-outline">{typeof c === "string" ? c : c.name}</span>
            ))}
            <span className="badge badge-ghost">{fmtUnit(p.unit)}</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mt-8">
        {stats.map(([l, v]) => (
          <div key={l} className="card border border-base-300 p-4">
            <p className="text-sm text-base-content/60">{l}</p>
            <p className="text-xl font-bold">{fmtPrice(v)}</p>
          </div>
        ))}
        <div className="card border border-base-300 p-4">
          <p className="text-sm text-base-content/60">আজকের দাম</p>
          <p className="text-xl font-bold text-primary">{fmtPrice(p.price)}</p>
          <Badge change={p.change} />
        </div>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-3">বাজারভিত্তিক আজকের দাম</h2>
      <div className="overflow-x-auto border border-base-300 rounded-xl">
        <table className="table">
          <thead><tr><th>বাজার</th><th>দাম</th></tr></thead>
          <tbody>
            {p.markets.length === 0 && <tr><td colSpan={2}>কোনো তথ্য নেই</td></tr>}
            {p.markets.map((m, i) => (
              <tr key={i}><td>{m.name}</td><td>{fmtPrice(m.price)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
