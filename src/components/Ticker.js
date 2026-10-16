"use client";
import { getProducts, fmtPrice, fmtUnit, toBn } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";

export default function Ticker() {
  const { data } = useFetch(() => getProducts(), []);
  if (!data?.length) return <div className="h-9 bg-neutral" />;
  const items = [...data, ...data];
  return (
    <div className="bg-neutral text-neutral-content overflow-hidden text-sm">
      <div className="marquee-track py-2">
        {items.map((p, i) => (
          <span key={i} className="px-5 whitespace-nowrap">
            {/^(https?:|\/)/.test(String(p.emoji)) ? "🛒" : p.emoji} {p.name} {fmtPrice(p.price)}/{fmtUnit(p.unit).replace("প্রতি ", "")}{" "}
            <span className={p.change >= 0 ? "text-green-400" : "text-red-400"}>
              {p.change >= 0 ? "▲" : "▼"} {toBn(Math.abs(p.change).toFixed(1))}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
