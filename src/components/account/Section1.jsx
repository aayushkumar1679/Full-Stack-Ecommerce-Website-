"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Section1() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuthStore();
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      router.push("/account/overview");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7f8] to-[#e9f0f2] flex items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <span className="text-3xl font-serif tracking-wide">
          <span className="text-neutral-900">Shop</span>
          <span className="text-orange-500">ora</span>
        </span>
      </div>

      {/* Card */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleLogin}
          className="relative rounded-[28px] bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(16,24,40,0.08)] border border-white/40 p-8"
        >
          <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-neutral-900 text-center mb-6">
            Login / Sign Up
          </h1>

          {/* Email */}
          <label className="block text-sm text-neutral-600 mb-2">Email</label>
          <div className="mb-4 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-3 shadow-sm">
            <Mail className="h-4 w-4 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Password */}
          <label className="block text-sm text-neutral-600 mb-2">
            Password
          </label>
          <div className="mb-6 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-3 shadow-sm">
            <Lock className="h-4 w-4 text-neutral-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Remember me */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 select-none text-neutral-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-neutral-900"
              />
              Remember Me
            </label>
          </div>

          {/* CTA */}
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-[999px] bg-[#ff7a45] text-white py-4 text-sm font-semibold shadow-[0_8px_20px_rgba(255,122,69,0.35)]"
          >
            Sign In / Create Account
          </motion.button>

          {/* Base highlight */}
          <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-transparent via-[#cfe1ea] to-transparent opacity-70" />
        </form>
      </motion.section>
    </main>
  );
}
