"use client";
import React from "react";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Luskey SD", price: "$209", image: "/images/shirt.jpg" },
  { id: 2, name: "Luskey 300", price: "$239", image: "/images/shirt.jpg" },
  { id: 3, name: "Luskey 500", price: "$269", image: "/images/shirt.jpg" },
  { id: 4, name: "Linskey 570", price: "$369", image: "/images/shirt.jpg" },
];

export default function Section2() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((p, index) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="group cursor-pointer  rounded-xl p-4 hover:shadow-lg transition bg-white"
        >
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-56 object-contain rounded-lg"
          />
          <div className="mt-3 flex items-center justify-between">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-orange-600 font-bold">{p.price}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
