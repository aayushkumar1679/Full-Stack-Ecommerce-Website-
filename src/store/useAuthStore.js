import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  login: (email, password) => {
    // Mock authentication (you can replace this with real API)
    if (email && password) {
      set({ user: { email }, isLoggedIn: true });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null, isLoggedIn: false }),
}));
