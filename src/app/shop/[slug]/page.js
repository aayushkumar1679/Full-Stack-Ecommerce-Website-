"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ArrowLeft, Star } from "lucide-react";
import productsData from "@/components/shop/productsData";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetails() {
  const { slug } = useParams();
  const product = productsData.find((p) => p.slug === slug);
  const { addToCart } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(
    product?.gallery?.[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizeOptions?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link
          href="/shop"
          className="px-4 py-2 bg-gray-900 text-white rounded-full"
        >
          <ArrowLeft className="w-4 h-4 inline-block mr-1" /> Back to Shop
        </Link>
      </div>
    );

  // Similar products: pick first 5 excluding current
  const similarProducts = productsData
    .filter((p) => p.slug !== slug)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-lg ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-rose-600" : ""}`}
              />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Gallery + Main Image */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === img
                      ? "border-gray-900"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    width={64}
                    height={80}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.title}
            </h2>
            <p className="text-sm text-gray-600">{product.category}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600">4.8 (128 reviews)</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              ${product.salePrice || product.price}
            </p>
            <p className="text-sm text-gray-600">
              {product.description ||
                `Premium ${product.category.toLowerCase()}`}
            </p>

            {/* Size & Quantity */}
            <div className="flex gap-3">
              <div className="grid grid-cols-4 gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-2 border rounded ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex items-center border rounded p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2"
                >
                  −
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart({ ...product, quantity })}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Similar Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {similarProducts.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    ${p.salePrice || p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
