"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import ProductCard from "@/components/ProductCard";
import { CardSkeleton } from "@/components/Skeletons";

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState("default");
  const { data, loading, error } = useFetch(
    async () => ({
      items: await getProducts(`?category=${slug}`),
      cats: await getCategories().catch(() => []),
    }),
    [slug]
  );

  let items = data?.items ?? [];
  if (sort === "asc") items = [...items].sort((a, b) => a.price - b.price);  // numeric, not string
  if (sort === "desc") items = [...items].sort((a, b) => b.price - a.price);
  const cat = data?.cats.find((c) => c.slug === slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">{cat?.icon} {cat?.name ?? slug}</h1>
        <label className="flex items-center gap-2 text-sm">
          সাজান:
          <select className="select select-sm sm:select-md" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : error || items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl">🛒</p>
          <h2 className="text-2xl font-bold mt-3">৪০৪ — কোনো পণ্য পাওয়া যায়নি</h2>
          <Link href="/" className="btn btn-primary mt-5">হোম পেজে ফিরে যান</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      )}
    </div>
  );
}
