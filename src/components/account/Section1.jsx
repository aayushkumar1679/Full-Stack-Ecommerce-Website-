"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const LOGIN_API_URL = "/api/auth/login";
const SIGNUP_API_URL = "/api/auth/register";

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in → redirect to account
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account/overview");
    }
  }, [isAuthenticated, router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? SIGNUP_API_URL : LOGIN_API_URL;
      const body =
        mode === "signup" ? { name, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      let token = data.token;
      let user = data.user;

      // Auto-login after signup
      if (mode === "signup") {
        const loginRes = await fetch(LOGIN_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        token = loginData.token;
        user = loginData.user;
      }

      if (token) {
        login(user, token); // Zustand state update
        router.push("/account/overview");
      } else {
        setError("No token received.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7f8] to-[#e9f0f2] flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <span className="text-3xl font-serif tracking-wide">
          <span className="text-neutral-900">Shop</span>
          <span className="text-orange-500">ora</span>
        </span>
      </div>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleAuth}
          className="relative rounded-[28px] bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(16,24,40,0.08)] border border-white/40 p-8"
        >
          <h1 className="text-3xl md:text-[34px] font-extrabold text-center mb-6">
            {mode === "login" ? "Login" : "Sign Up"}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <>
              <label className="block text-sm text-neutral-600 mb-2">
                Full Name
              </label>
              <div className="mb-4 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-3 shadow-sm">
                <User className="h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-transparent outline-none text-sm"
                  required
                />
              </div>
            </>
          )}

          <label className="block text-sm text-neutral-600 mb-2">Email</label>
          <div className="mb-4 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-3 shadow-sm">
            <Mail className="h-4 w-4 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent outline-none text-sm"
              required
            />
          </div>

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
              className="w-full bg-transparent outline-none text-sm"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: loading ? 0 : -2 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className={`w-full rounded-[999px] py-4 text-sm font-semibold transition-colors duration-200 ${
              loading
                ? "bg-orange-300 text-white cursor-not-allowed"
                : "bg-[#ff7a45] text-white"
            }`}
          >
            {loading
              ? mode === "signup"
                ? "Creating Account..."
                : "Signing In..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </motion.button>

          <p className="text-center text-sm text-neutral-600 mt-4">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </motion.section>
    </main>
  );
}
