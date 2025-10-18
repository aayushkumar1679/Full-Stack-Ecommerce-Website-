"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function Section1() {
  const { cart, removeFromCart, clearCart, totalPrice, updateQuantity } =
    useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0)
    return (
      <div className="p-10 text-center text-gray-600">
        Your cart is empty.
        <Link
          href="/shop"
          className="text-blue-500 hover:text-blue-600 underline ml-2"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      <AnimatePresence>
        {cart.map((item) => (
          <motion.div
            key={item.pid}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.src}
                alt={item.title}
                className="w-[100px] h-[130px] rounded-lg object-cover shadow-sm"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                <p className="text-gray-500">${item.salePrice ?? item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.pid, Math.max(item.quantity - 1, 1))
                    }
                    className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.pid, item.quantity + 1)}
                    className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-500 font-medium mt-1">
                  Subtotal: $
                  {(
                    (item.salePrice ?? item.price) * item.quantity
                  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeFromCart(item.pid)}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Remove
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Total + Buttons */}
      <div className="mt-8 border-t pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xl font-bold">
          Total: $
          {totalPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4">Checkout</h3>
              <p className="text-gray-600 mb-4">
                Total Amount:{" "}
                <span className="font-semibold">
                  $
                  {totalPrice().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="text-gray-500 mb-6">
                This is a demo checkout. Implement payment here.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    setShowCheckout(false);
                  }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
