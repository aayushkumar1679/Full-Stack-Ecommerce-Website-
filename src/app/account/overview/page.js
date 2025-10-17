"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function OverviewPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/account");
    }
  }, [isLoggedIn, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome {user?.email} 🎉</h1>
        <p className="text-gray-600">You’re now logged in.</p>
      </div>
    </main>
  );
}
