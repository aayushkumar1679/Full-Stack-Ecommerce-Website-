"use client";
import React from "react";

import { useCartStore } from "@/store/useCartStore";

export default function Section1() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCartStore();

  if (cart.length === 0)
    return (
      <div className="p-10 text-center text-gray-600">Your cart is empty.</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              <p className="text-gray-500">${item.salePrice ?? item.price}</p>
              <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 flex justify-between items-center">
        <span className="text-xl font-bold">
          Total: ${totalPrice().toFixed(2)}
        </span>
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
