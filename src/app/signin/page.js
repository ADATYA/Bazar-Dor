"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.get("protected")) toast.error("এই পাতা দেখতে আগে সাইন ইন করুন");
  }, [params]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email")?.toString().trim();
    const password = fd.get("password")?.toString();
    if (!email || !password) {
      const m = "ইমেইল ও পাসওয়ার্ড দিন";
      setError(m); toast.error(m); return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        const m = error.message || "ইমেইল বা পাসওয়ার্ড ভুল";
        setError(m); toast.error(m);
        return;
      }
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.push(redirect);
      router.refresh();
    } catch {
      const m = "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(m); toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  async function social(provider) {
    const { error } = await authClient.signIn.social({ provider, callbackURL: redirect });
    if (error) toast.error(error.message || `${provider} দিয়ে সাইন ইন করা যায়নি`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card border border-base-300 shadow-sm">
        <form onSubmit={onSubmit} className="card-body gap-3">
          <h1 className="text-2xl font-bold text-center">সাইন ইন</h1>
          {error && <div role="alert" className="alert alert-error py-2 text-sm">{error}</div>}
          <input name="email" type="email" placeholder="ইমেইল" className="input input-bordered w-full" required />
          <input name="password" type="password" placeholder="পাসওয়ার্ড" className="input input-bordered w-full" required />
          <button disabled={loading} className="btn btn-primary">{loading ? "অপেক্ষা করুন..." : "সাইন ইন"}</button>
          <div className="divider text-xs">অথবা</div>
          <button type="button" onClick={() => social("google")} className="btn btn-outline">Google দিয়ে সাইন ইন</button>
          <button type="button" onClick={() => social("github")} className="btn btn-outline">GitHub দিয়ে সাইন ইন</button>
          <p className="text-sm text-center">
            অ্যাকাউন্ট নেই? <Link href="/signup" className="link link-primary">সাইন আপ করুন</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return <Suspense fallback={<div className="max-w-md mx-auto p-12"><div className="skeleton h-80" /></div>}><SignInForm /></Suspense>;
}
