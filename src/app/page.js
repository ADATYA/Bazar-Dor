"use client";
import { getProducts } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import ProductCard from "@/components/ProductCard";
import { CardSkeleton } from "@/components/Skeletons";

function Section({ id, title, sub, items, loading }) {
  return (
    <section id={id} className="scroll-mt-32 mt-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      {sub && <p className="text-base-content/60 mb-4">{sub}</p>}
      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const { data, loading, error } = useFetch(() => getProducts(), []);
  const all = data ?? [];
  const risers = [...all].filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = [...all].filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="grid md:grid-cols-2 gap-8 items-center py-10">
        <div>
          <p className="text-primary font-semibold">আজকের বাজার দর</p>
          <h1 className="text-3xl sm:text-5xl font-bold mt-2 leading-tight">নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে</h1>
          <p className="mt-4 text-base-content/70">চাল, ডাল, সবজি, মাছ ও মাংসের সর্বশেষ দাম ও দামের ওঠানামা জানুন।</p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-6">সব পণ্য দেখুন</a>
        </div>
        <div className="flex justify-center">
          <img src="/bazar-hero.png" alt="বাজার" className="max-h-72 w-auto rounded-2xl"
            onError={(e) => { if (!e.currentTarget.src.endsWith(".svg")) e.currentTarget.src = "/bazar-hero.svg"; }} />
        </div>
      </section>

      {error && <div role="alert" className="alert alert-error">ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।</div>}
      <Section title="আজ দাম বেড়েছে ▲" items={risers} loading={loading} />
      <Section title="আজ দাম কমেছে ▼" items={fallers} loading={loading} />
      <Section id="সব-পণ্য" title="সব পণ্য" sub="সকল পণ্যের আজকের দাম" items={all} loading={loading} />
    </div>
  );
}
