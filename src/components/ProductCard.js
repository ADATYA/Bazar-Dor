import Link from "next/link";
import Emoji from "./Emoji";
import { fmtPrice, fmtUnit, toBn } from "@/lib/api";

export function Badge({ change }) {
  const cls =
    change > 0 ? "text-green-600 bg-green-100" : change < 0 ? "text-red-600 bg-red-100" : "text-gray-500 bg-gray-100";
  const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "—";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {arrow} {toBn(Math.abs(change).toFixed(1))}%
    </span>
  );
}

export default function ProductCard({ p }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition"
    >
      <div className="card-body p-4 gap-1">
        <Emoji value={p.emoji} />
        <h3 className="font-bold text-lg">{p.name}</h3>
        <p className="text-sm text-base-content/60">{fmtUnit(p.unit)}</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="font-bold text-primary">{fmtPrice(p.price)}</p>
          </div>
          <Badge change={p.change} />
        </div>
      </div>
    </Link>
  );
}
