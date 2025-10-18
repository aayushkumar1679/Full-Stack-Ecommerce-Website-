"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingCart } from "lucide-react";

export default function Section2() {
  const [productsData, setProductsData] = useState([]);
  const { addToCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductsData(data);
    };
    fetchProducts();
  }, []);

  // ✅ FIX #1: Add dependency so categories update when data is fetched
  const categories = useMemo(() => {
    if (!productsData.length) return ["All"];
    const cats = Array.from(new Set(productsData.map((p) => p.category)));
    return ["All", ...cats];
  }, [productsData]);

  // ✅ FIX #2: Include productsData in dependency array
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return productsData;
    return productsData.filter((p) => p.category === activeCategory);
  }, [activeCategory, productsData]);

  const toggleLike = (pid) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      next.has(pid) ? next.delete(pid) : next.add(pid);
      return next;
    });
  };

  return (
    <section className="py-20 bg-[#fafafa] text-gray-800 font-poppins">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold tracking-tight text-gray-900 uppercase"
          >
            ÉLEGANCE Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed"
          >
            Timeless expressions captured with grace and detail — curated from
            our premium ÉLEGANCE collection.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.pid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredCard(product.pid)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/shop/${product.slug}`} className="block">
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={product.src}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      animate={
                        hoveredCard === product.pid
                          ? { scale: 1.08 }
                          : { scale: 1 }
                      }
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredCard === product.pid ? 1 : 0,
                      }}
                      className="absolute inset-0 bg-black/30 flex justify-center items-center pointer-events-none"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="flex items-center gap-2 bg-white/95 text-gray-900 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-sm pointer-events-auto"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="p-3 text-center">
                    <h3 className="text-[13px] font-medium text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {product.category}
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <p className="text-[13px] font-semibold text-gray-900">
                        ${product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Like Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(product.pid)}
                  className={`absolute top-2 right-2 transition-colors z-10 ${
                    likedItems.has(product.pid)
                      ? "text-red-500"
                      : "text-gray-300 hover:text-red-400"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={likedItems.has(product.pid) ? "currentColor" : "none"}
                  />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
