"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  ArrowLeft,
  Star,
  ShoppingBag,
  Zoom,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
// import productsData from "@/components/shop/productsData";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetails() {
  const { slug } = useParams();
  const [productsData, setProductsData] = useState([]);
  const product = productsData.find((p) => p.slug === slug);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductsData(data);
    };
    fetchProducts();
  }, []);

  const [selectedImage, setSelectedImage] = useState(
    product?.gallery?.[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizeOptions?.[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colorOptions?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  if (!product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you &apos;are looking for doesn &apos;t exist or has
            been moved.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>
      </div>
    );

  // Similar products: pick first 5 excluding current
  const similarProducts = productsData
    .filter((p) => p.slug !== slug)
    .slice(0, 5);

  const handleImageZoom = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg  top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
          </Link>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600 shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-rose-600" : ""}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Enhanced Image Gallery */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Thumbnails - Vertical Scroll */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible lg:max-h-[500px]">
              {product.gallery.map((img, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-24 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === img
                      ? "border-gray-900 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    width={80}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </motion.button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white"
                onMouseMove={handleImageZoom}
                onMouseEnter={() => setZoomImage(true)}
                onMouseLeave={() => setZoomImage(false)}
              >
                <Image
                  src={product.src}
                  alt={product.title}
                  fill
                  className="object-cover cursor-crosshair"
                  style={{
                    transform: zoomImage ? `scale(1.5)` : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />

                {/* Zoom Indicator */}
                <AnimatePresence>
                  {zoomImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {/* <Zoom className="w-4 h-4" /> */}
                      Zoom
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Breadcrumb & Category */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Shop</span>
              <span>•</span>
              <span className="capitalize">{product.category}</span>
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">4.8</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">128 reviews</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-green-600 font-medium">
                  In Stock
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price}
                  </span>
                  <span className="px-2 py-1 bg-rose-100 text-rose-600 text-sm font-medium rounded-full">
                    Save ${product.price - product.salePrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description ||
                `Premium ${product.category.toLowerCase()} crafted with attention to detail and quality materials. Designed for comfort and style.`}
            </p>

            {/* Color Selection */}
            {product.colorOptions && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Color</h3>
                <div className="flex gap-3">
                  {product.colorOptions.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-gray-900 ring-2 ring-gray-300"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    >
                      {selectedColor === color && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Size</h3>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizeOptions.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                        : "border-gray-200 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  −
                </motion.button>
                <span className="px-6 py-3 font-semibold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  +
                </motion.button>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  addToCart({
                    ...product,
                    quantity,
                    selectedSize,
                    selectedColor,
                  })
                }
                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart - ${(product.salePrice || product.price) * quantity}
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {[
                { icon: Truck, text: "Free Shipping", subtext: "2-3 days" },
                {
                  icon: Shield,
                  text: "2-Year Warranty",
                  subtext: "Quality assured",
                },
                { icon: RotateCcw, text: "Easy Returns", subtext: "30 days" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <feature.icon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">
                    {feature.text}
                  </div>
                  <div className="text-xs text-gray-500">{feature.subtext}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Similar Products */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              You Might Also Like
            </h3>
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              View All
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {similarProducts.map((p, index) => (
              <motion.div
                key={p.pid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link
                  href={`/shop/${p.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={p.src}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                      {p.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">
                        ${p.salePrice || p.price}
                      </p>
                      {p.salePrice && (
                        <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
