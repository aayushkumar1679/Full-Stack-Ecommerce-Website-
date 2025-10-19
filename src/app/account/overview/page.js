"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function OverviewPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Wait until Zustand rehydrates before redirecting
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((r) => setTimeout(r, 100)); // small delay for Zustand to load
      if (!isAuthenticated) router.push("/");
    };
    checkAuth();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent flicker

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.name || "User"} 👋
      </h1>
      <p className="text-gray-600 text-lg mb-6">Email: {user?.email}</p>

      <button
        onClick={logout}
        className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
