"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Search, ShoppingCart, Sparkles, Loader2, Star } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StarRating = ({ rating = 4.4, reviews = 0, size = "sm" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={classNames(
            starSize,
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasHalfStar
              ? "fill-amber-300 text-amber-400"
              : "text-gray-300"
          )}
        />
      ))}
      {reviews > 0 && (
        <span className="text-xs text-gray-500 ml-1">({reviews})</span>
      )}
    </div>
  );
};

// ✅ Updated to match your productsData categories
const filterOptions = {
  categories: [
    "All Products",
    "Combos",
    "Jackets",
    "Dresses",
    "Bottoms",
    "Formals",
    "Footwear",
    "Sweaters",
    "Shirts",
  ],
  priceRanges: [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "Over $100", min: 100, max: Infinity },
  ],
};

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, totalItems } = useCartStore();
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductsData(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedPriceRange, searchQuery]);

  // ✅ Fixed filter logic — matches correct categories and price
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        if (
          searchQuery &&
          !product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;

        if (
          selectedCategory !== "All Products" &&
          product.category !== selectedCategory
        )
          return false;

        if (selectedPriceRange) {
          const price = product.salePrice || product.price;
          const { min, max } = selectedPriceRange;
          if (price < min || price > max) return false;
        }

        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [productsData, selectedCategory, selectedPriceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 px-4 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
        {/* Search */}
        <div className="flex-1 w-full max-w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-2xl border border-gray-300 text-sm bg-white hover:border-gray-400 transition"
        >
          {filterOptions.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Cart */}
        <Link href={"/cart"}>
          <button className="relative p-2.5 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems()}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {filteredProducts.map((product) => (
              <Link key={product.pid} href={`/shop/${product.slug}`}>
                <motion.div
                  layout
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.src}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
                          New
                        </span>
                      )}
                      {product.salePrice && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                          Sale
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <StarRating
                        rating={product.rating}
                        reviews={product.reviews}
                      />
                      <div className="text-right">
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">
                              ${product.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Products");
                setSelectedPriceRange(null);
                setSearchQuery("");
              }}
              className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
