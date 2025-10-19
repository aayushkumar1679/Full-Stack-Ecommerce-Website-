// model/product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    _id: String, // because you imported JSON with string IDs like "P0001"
    pid: String,
    slug: String,
    title: String,
    category: String,
    gender: String,
    color: String,
    colorHex: String,
    tone: String,
    sizeOptions: [String],
    price: Number,
    salePrice: Number,
    rating: Number,
    reviews: Number,
    isNew: Boolean,
    src: String,
    gallery: [String],
  },
  { timestamps: true }
);

// 👇 Explicitly set collection name to "product" (as seen in MongoDB)
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "product");
