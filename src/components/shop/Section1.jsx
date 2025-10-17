"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

import {
  Filter,
  ChevronDown,
  Star,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import productsData from "./productsData";

// Utility
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Star rating display
const starRow = (rating = 4.4) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={classNames(
            "h-3.5 w-3.5",
            i < full
              ? "fill-yellow-400 stroke-yellow-400"
              : i === full && half
              ? "fill-yellow-300/70 stroke-yellow-400"
              : "stroke-neutral-400"
          )}
        />
      ))}
    </div>
  );
};

// Filter data
const facets = {
  categories: [
    "Combos",
    "Protants",
    "Colorviews",
    "New Arrivals",
    "Joggers",
    "Bottoms",
    "Tops",
  ],
  genders: ["Men", "Women", "Unisex"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  tones: ["Neutral", "Warm", "Cool", "Vivid", "Pastel"],
  colors: [
    { name: "Black", hex: "#111827" },
    { name: "White", hex: "#f9fafb" },
    { name: "Gray", hex: "#9CA3AF" },
    { name: "Navy", hex: "#1f2a44" },
    { name: "Red", hex: "#ef4444" },
    { name: "Yellow", hex: "#f59e0b" },
    { name: "Green", hex: "#10b981" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Purple", hex: "#8b5cf6" },
  ],
};

export default function Section1() {
  const [open, setOpen] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState({
    category: null,
    gender: null,
    sizes: new Set(),
    tones: new Set(),
    colors: new Set(),
    sort: "Popular",
    onlyNew: false,
  });
  const [grid, setGrid] = React.useState(4);
  const [isLoading, setIsLoading] = React.useState(false);
  const { addToCart, totalItems } = useCartStore();

  const products = productsData;

  // Persist grid preference
  React.useEffect(() => {
    const saved = Number(window.localStorage.getItem("grid")) || 4;
    setGrid(saved);
  }, []);
  React.useEffect(() => {
    window.localStorage.setItem("grid", String(grid));
  }, [grid]);

  // Simulate loading on filter/search changes
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selected, query]);

  const toggleSet = (key, val) => {
    setSelected((s) => {
      const set = new Set(s[key]);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...s, [key]: set };
    });
  };

  // Filter logic
  const filtered = React.useMemo(() => {
    return products
      .filter((p) => !selected.category || p.category === selected.category)
      .filter((p) => !selected.gender || p.gender === selected.gender)
      .filter(
        (p) =>
          selected.sizes.size === 0 ||
          p.sizeOptions.some((sz) => selected.sizes.has(sz))
      )
      .filter((p) => selected.colors.size === 0 || selected.colors.has(p.color))
      .filter((p) => !selected.onlyNew || p.isNew)
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (selected.sort === "Price: Low to High")
          return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        if (selected.sort === "Price: High to Low")
          return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        if (selected.sort === "Newest") return b.isNew ? 1 : -1;
        if (selected.sort === "Rating") return b.rating - a.rating;
        return 0;
      });
  }, [selected, query, products]);

  // Map grid state to min column width
  const colMin = React.useMemo(() => {
    if (grid === 3) return 360; // larger cards, ~3 cols on lg+
    if (grid === 4) return 300; // default
    return 240; // grid === 5
  }, [grid]);

  // Container grid layout: sidebar width responsive; collapse when closed
  const containerGridClass = classNames(
    "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8",
    open
      ? "grid-cols-1 md:[grid-template-columns:clamp(220px,24vw,280px)_1fr]"
      : "grid-cols-1"
  );

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-br from-white via-orange-50/40 to-yellow-50 text-black">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Filter + Grid */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setOpen((v) => !v)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium shadow-md border border-gray-200"
            >
              <Filter className="h-4 w-4 text-orange-500" />
              <span>Filters</span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.button>

            {/* Grid size buttons */}
            <div className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-md border border-gray-200">
              {[3, 4, 5].map((size) => (
                <motion.button
                  key={size}
                  onClick={() => setGrid(size)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all ${
                    grid === size
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                  aria-label={`${size} columns`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search + Sort + Cart */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-12 w-64 pl-11 pr-4 rounded-2xl bg-white shadow-md border border-gray-200 text-black"
              />
            </div>

            <select
              value={selected.sort}
              onChange={(e) =>
                setSelected((s) => ({ ...s, sort: e.target.value }))
              }
              className="h-12 rounded-2xl bg-white shadow-md border border-gray-200 px-4 text-black"
            >
              <option>Popular</option>
              <option>Newest</option>
              <option>Rating</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>

            <button
              className="relative h-12 w-12 rounded-2xl bg-white shadow-md border border-gray-200"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white rounded-full px-1.5 py-0.5">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={containerGridClass}>
        {/* Sidebar Filters */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl p-5 space-y-6"
            >
              {/* Category */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-500" /> Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facets.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelected((s) => ({
                          ...s,
                          category: s.category === cat ? null : cat,
                        }))
                      }
                      className={classNames(
                        "px-3 py-2 rounded-xl text-sm font-medium",
                        selected.category === cat
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Gender
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facets.genders.map((g) => (
                    <button
                      key={g}
                      onClick={() =>
                        setSelected((s) => ({
                          ...s,
                          gender: s.gender === g ? null : g,
                        }))
                      }
                      className={classNames(
                        "px-3 py-2 rounded-xl text-sm font-medium",
                        selected.gender === g
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Sizes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facets.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => toggleSet("sizes", sz)}
                      className={classNames(
                        "px-3 py-2 rounded-xl text-sm font-medium border",
                        selected.sizes.has(sz)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tones */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Tone
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facets.tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleSet("tones", t)}
                      className={classNames(
                        "px-3 py-2 rounded-xl text-sm font-medium",
                        selected.tones.has(t)
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Colors
                </h4>
                <div className="flex flex-wrap gap-3">
                  {facets.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => toggleSet("colors", c.name)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selected.colors.has(c.name)
                          ? "border-orange-500 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* New only */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  id="onlyNew"
                  type="checkbox"
                  checked={selected.onlyNew}
                  onChange={() =>
                    setSelected((s) => ({
                      ...s,
                      onlyNew: !s.onlyNew,
                    }))
                  }
                  className="w-4 h-4 accent-orange-500"
                />
                <label
                  htmlFor="onlyNew"
                  className="text-sm text-gray-700 font-medium"
                >
                  Show new arrivals only
                </label>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          )}

          <motion.div
            layout
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${colMin}px, 1fr))`,
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden"
                >
                  <div className="relative aspect-[1/1] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.isNew && (
                      <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-green-600 text-white">
                        New
                      </div>
                    )}
                    {item.salePrice && (
                      <div className="absolute top-3 left-16 px-3 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {starRow(item.rating)}
                        <span className="text-sm text-gray-500">
                          ({item.reviews})
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {item.salePrice ? (
                          <span className="inline-flex gap-2">
                            <span className="line-through text-gray-400 text-base">
                              ${item.price}
                            </span>
                            <span className="text-red-500">
                              ${item.salePrice}
                            </span>
                          </span>
                        ) : (
                          `$${item.price}`
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(item)} // ✅ Add product
                      className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
