"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import productsData from "../shop/productsData";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "New Arrivals", href: "/shop" },
    { name: "Men", href: "/shop" },
    { name: "Women", href: "/shop" },
    { name: "Collections", href: "/shop" },
    { name: "Sale", href: "/shop" },
  ];

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  React.useEffect(() => {
    const throttledScroll = () => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    };

    window.addEventListener("scroll", throttledScroll(), { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll());
  }, [handleScroll]);

  React.useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return productsData.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={classNames(
        "sticky top-0 z-50 transition-all duration-500 border-b",
        isScrolled
          ? "backdrop-blur-xl bg-white/95 shadow-lg border-gray-100"
          : "bg-white border-transparent"
      )}
      role="banner"
    >
      {/* Top Announcement Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 text-sm text-center">
        <p className="font-medium">
          Free shipping on orders over $100 •
          <span className="text-orange-400 ml-1">Shop now</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300"
            >
              ÉLEGANCE
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Primary"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  "relative py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg px-3",
                  isActive(item.href)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Search"
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Wishlist"
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 relative"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-xs leading-none bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </motion.button>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cart"
                aria-label="Cart"
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 relative flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 text-xs leading-none bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </Link>
            </motion.div>

            {/* Account */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/account"
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <div className="px-4 py-6 space-y-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={classNames(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                      isActive(item.href)
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-start pt-20 px-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="mt-4 bg-white rounded-2xl shadow-md overflow-hidden">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <img
                        src={product.src}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {product.title}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ${product.salePrice || product.price}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
