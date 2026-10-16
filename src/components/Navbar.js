"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import Ticker from "./Ticker";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: cats } = useFetch(getCategories, []);
  const [date, setDate] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    );
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error(e.message || "সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  const link = (active) =>
    `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
      active ? "bg-primary text-primary-content font-semibold" : "hover:bg-base-200"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-base-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <Link href="/" className="leading-tight">
          <span className="text-xl font-bold">🛒 বাজার দর</span>
          <span className="block text-xs text-base-content/60">{date}</span>
        </Link>

        <nav className="hidden lg:flex gap-1 overflow-x-auto">
          <Link href="/" className={link(pathname === "/")}>হোম</Link>
          {cats?.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className={link(pathname === `/category/${c.slug}`)}>
              {c.icon} {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-24" />
          ) : session ? (
            <>
              <Link href="/profile" className="btn btn-sm sm:btn-md btn-ghost">
                👤 {session.user.name?.split(" ")[0]}
              </Link>
              <button onClick={handleSignOut} disabled={signingOut} className="btn btn-sm sm:btn-md btn-outline">
                {signingOut ? "..." : "সাইন আউট"}
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      {/* categories row for mobile / tablet */}
      <nav className="lg:hidden max-w-6xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
        <Link href="/" className={link(pathname === "/")}>হোম</Link>
        {cats?.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={link(pathname === `/category/${c.slug}`)}>
            {c.icon} {c.name}
          </Link>
        ))}
      </nav>
      <Ticker />
    </header>
  );
}
