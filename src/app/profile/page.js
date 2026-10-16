"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <div className="max-w-md mx-auto p-12"><div className="skeleton h-64" /></div>;
  const u = session?.user;
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card border border-base-300 shadow-sm">
        <div className="card-body items-center text-center">
          {u?.image ? (
            <img src={u.image} alt="" className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl">
              {u?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold">{u?.name}</h1>
          <p className="text-base-content/70">{u?.email}</p>
          <Link href="/profile/update" className="btn btn-primary mt-3">তথ্য আপডেট করুন</Link>
        </div>
      </div>
    </div>
  );
}
