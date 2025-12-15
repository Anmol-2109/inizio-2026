import { create } from "zustand";

// Helper to safely get localStorage value (returns null if "null" string)
const getStorageItem = (key) => {
  const value = localStorage.getItem(key);
  return value && value !== "null" ? value : null;
};

const useAuthStore = create((set) => ({
  access: getStorageItem("access"),
  refresh: getStorageItem("refresh"),
  profileComplete: (() => {
    const value = localStorage.getItem("profileComplete");
    if (!value || value === "null") return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  })(),
  isStaff: (() => {
    const value = localStorage.getItem("isStaff");
    if (!value || value === "null") return false;
    try {
      return JSON.parse(value);
    } catch {
      return false;
    }
  })(),

  setAuth: ({ access, refresh, profileComplete, isStaff }) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("profileComplete", profileComplete);
    localStorage.setItem("isStaff", isStaff ? "true" : "false");
    set({ access, refresh, profileComplete, isStaff: isStaff || false });
  },

  logout: () => {
    localStorage.clear();
    set({ access: null, refresh: null, profileComplete: null, isStaff: false });
  },
}));

export default useAuthStore;
