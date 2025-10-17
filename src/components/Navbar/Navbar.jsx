"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Shop", href: "/shop" },
    { name: "Cart", href: "/cart" },
  ];

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-orange-600 hover:border-orange-300 transition"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-2xl font-serif tracking-tight text-orange-600">
                Shopora
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700"
            aria-label="Primary"
          >
            {links.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className={classNames(
                  "relative transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded",
                  isActive(l.href) ? "text-orange-600" : "hover:text-orange-600"
                )}
              >
                {l.name}
                {isActive(l.href) && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-orange-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 text-gray-700">
            <button
              type="button"
              aria-label="Search"
              className="w-10 h-10 grid place-items-center rounded-xl border border-gray-200 bg-white hover:text-orange-600 hover:border-orange-300 transition"
              onClick={() => alert("Open search")}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="w-10 h-10 grid place-items-center rounded-xl border border-gray-200 bg-white hover:text-orange-600 hover:border-orange-300 transition relative"
              onClick={() => setOpen(false)}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-orange-500 text-white rounded-full px-1.5 py-0.5">
                3
              </span>
            </Link>
            <Link href={"/account"}>
              <button
                type="button"
                aria-label="Account"
                className="w-10 h-10 grid place-items-center rounded-xl border border-gray-200 bg-white hover:text-orange-600 hover:border-orange-300 transition"
              >
                <User className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white/95 border-t border-gray-200"
            aria-label="Mobile"
          >
            <ul className="px-4 py-3 space-y-1">
              {links.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={classNames(
                      "block px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                      isActive(l.href)
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-700"
                    )}
                    prefetch
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    alert("Open search");
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-700 transition"
                >
                  Search
                </button>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-700 transition text-center"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
