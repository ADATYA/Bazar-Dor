"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name")?.toString().trim();
    if (!name) return toast.error("নাম দিন");
    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);
    if (error) return toast.error(error.message || "আপডেট করা যায়নি");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  if (isPending) return <div className="max-w-md mx-auto p-12"><div className="skeleton h-48" /></div>;
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={onSubmit} className="card border border-base-300 shadow-sm card-body gap-3">
        <h1 className="text-2xl font-bold text-center">তথ্য আপডেট</h1>
        <input name="name" defaultValue={session?.user?.name} placeholder="নাম" className="input input-bordered w-full" required />
        <button disabled={loading} className="btn btn-primary">{loading ? "অপেক্ষা করুন..." : "আপডেট করুন"}</button>
      </form>
    </div>
  );
}
