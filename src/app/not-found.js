import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl">🔍</p>
      <h1 className="text-4xl font-bold mt-4">৪০৪ — পাতাটি পাওয়া যায়নি</h1>
      <p className="mt-2 text-base-content/60">আপনি যে পাতাটি খুঁজছেন তা নেই।</p>
      <Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
