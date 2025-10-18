import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product) => {
    const existing = get().cart.find((item) => item.pid === product.pid);
    if (existing) {
      set({
        cart: get().cart.map((item) =>
          item.pid === product.pid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...get().cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (pid) => {
    set({ cart: get().cart.filter((item) => item.pid !== pid) });
  },

  clearCart: () => set({ cart: [] }),

  updateQuantity: (pid, quantity) => {
    if (quantity < 1) return;
    set({
      cart: get().cart.map((item) =>
        item.pid === pid ? { ...item, quantity } : item
      ),
    });
  },

  totalItems: () =>
    get().cart.reduce((total, item) => total + item.quantity, 0),

  totalPrice: () =>
    get().cart.reduce(
      (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
      0
    ),
}));
