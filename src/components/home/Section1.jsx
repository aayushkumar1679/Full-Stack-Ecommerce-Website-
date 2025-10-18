"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
// import productsData from "../shop/productsData";

export default function Section1() {
  const [productsData, setProductsData] = useState([]);
  const featuredProducts = productsData.slice(0, 4);
  const marqueeProducts = productsData.slice(4, 10);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductsData(data);
    };
    fetchProducts();
  }, []);

  const ProductCard = ({ item, size = "medium" }) => (
    <Link href={`/shop/${item.slug}`} className="block">
      <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden border border-gray-100 ${
          size === "large" ? "min-w-[280px]" : "min-w-[240px]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-gray-50 ${
            size === "large" ? "h-72" : "h-56"
          }`}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${
                item.tag === "EXCLUSIVE"
                  ? "bg-rose-100 text-rose-700"
                  : item.tag === "NEW ARRIVAL"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {item.tag || "FEATURED"}
            </span>
          </div>

          {item.discount && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-white text-rose-600 text-[11px] font-semibold shadow-sm">
                -{item.discount}%
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 flex items-center justify-center">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-white transition"
            >
              Quick View
            </motion.button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 text-base mb-1.5 group-hover:text-rose-600 transition-colors">
            {item.name}
          </h3>

          {item.rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-[12px] text-gray-500 ml-1">
                {item.rating}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">
              ${item.price}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${item.originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );

  const features = [
    { icon: Truck, title: "Free Shipping", description: "Over $150" },
    { icon: Shield, title: "2-Year Warranty", description: "Guaranteed" },
    { icon: Star, title: "Premium Quality", description: "Luxury finish" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 overflow-hidden">
      <div className="relative w-full px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid lg:grid-cols-3 gap-10 items-center mb-20 w-full">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium mb-4"
            >
              ✨ New Collection 2024
            </motion.span>

            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 leading-snug">
              Elevate Your{" "}
              <span className="font-semibold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent block">
                Style
              </span>
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
              Discover timeless elegance with our curated selection of premium
              fashion essentials — refined, sustainable, and beautifully
              crafted.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="group bg-gray-900 text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="border border-gray-300 text-gray-700 px-7 py-3 rounded-xl text-sm font-medium hover:border-gray-400 transition-all"
              >
                Lookbook
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-100/40 to-amber-100/40 rounded-full blur-3xl" />
              <Image
                src="/images/model.png"
                alt="Fashion Model"
                width={480}
                height={780}
                className="relative z-10 object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Right Products */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((item, index) => (
                <motion.div
                  key={item.pid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <ProductCard item={item} size="small" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Marquee Section */}
        <div className="relative w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Trending Now
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after pieces this season — refined,
              limited, and timeless.
            </p>
          </div>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6 py-3"
              animate={{ x: [0, -1840] }}
              transition={{
                ease: "linear",
                duration: 30,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {[...marqueeProducts, ...marqueeProducts].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="shrink-0">
                  <ProductCard item={item} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
