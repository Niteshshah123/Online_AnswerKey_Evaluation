// Auth state is now managed by AuthContext (Firebase).
// This store is kept for backward compatibility with components that read
// user / isAuthenticated / isLoading from useAuthStore().
// It is hydrated by <AuthSync /> mounted in App.jsx.

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,

  setAuth: (user, role) =>
    set({ user, role, isAuthenticated: !!user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),
}));
