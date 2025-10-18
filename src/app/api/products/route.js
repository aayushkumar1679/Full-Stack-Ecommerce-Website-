import { NextResponse } from "next/server";

const productsData = [
  {
    pid: "P0001",
    slug: "rust-casual-combo",
    title: "Rust Casual Combo",
    category: "Combos",
    gender: "Men",
    color: "Rust Orange",
    colorHex: "#b7410e",
    tone: "Warm",
    sizeOptions: ["M", "L", "XL"],
    price: 59.99,
    salePrice: 49.99,
    rating: 4.7,
    reviews: 180,
    isNew: true,
    src: "/images/products/1.jpg",
    gallery: [
      "/images/products/1.jpg",
      "/images/products/1.jpg",
      "/images/products/1.jpg",
    ],
  },
  {
    pid: "P0002",
    slug: "beige-formal-combo",
    title: "Beige Formal Combo",
    category: "Combos",
    gender: "Women",
    color: "Beige",
    colorHex: "#f5f5dc",
    tone: "Neutral",
    sizeOptions: ["S", "M", "L"],
    price: 69.99,
    salePrice: 59.99,
    rating: 4.6,
    reviews: 150,
    isNew: false,
    src: "/images/products/2.jpg",
    gallery: [
      "/images/products/2.jpg",
      "/images/products/2.jpg",
      "/images/products/2.jpg",
    ],
  },
];

export async function GET() {
  return NextResponse.json(productsData);
}
