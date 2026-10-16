"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.toString().trim();
    const email = fd.get("email")?.toString().trim();
    const password = fd.get("password")?.toString() ?? "";
    if (!name || !email) { const m = "সব ঘর পূরণ করুন"; setError(m); toast.error(m); return; }
    if (password.length < 6) { const m = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"; setError(m); toast.error(m); return; }
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        const m = error.message || "রেজিস্ট্রেশন করা যায়নি";
        setError(m); toast.error(m); return;
      }
      toast.success("রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন");
      router.push("/signin");
    } catch {
      const m = "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(m); toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  async function social(provider) {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || `${provider} দিয়ে সাইন আপ করা যায়নি`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card border border-base-300 shadow-sm">
        <form onSubmit={onSubmit} className="card-body gap-3">
          <h1 className="text-2xl font-bold text-center">সাইন আপ</h1>
          {error && <div role="alert" className="alert alert-error py-2 text-sm">{error}</div>}
          <input name="name" placeholder="নাম" className="input input-bordered w-full" required />
          <input name="email" type="email" placeholder="ইমেইল" className="input input-bordered w-full" required />
          <input name="password" type="password" placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" className="input input-bordered w-full" required />
          <button disabled={loading} className="btn btn-primary">{loading ? "অপেক্ষা করুন..." : "রেজিস্টার"}</button>
          <div className="divider text-xs">অথবা</div>
          <button type="button" onClick={() => social("google")} className="btn btn-outline">Google দিয়ে সাইন আপ</button>
          <button type="button" onClick={() => social("github")} className="btn btn-outline">GitHub দিয়ে সাইন আপ</button>
          <p className="text-sm text-center">
            আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin" className="link link-primary">সাইন ইন করুন</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
