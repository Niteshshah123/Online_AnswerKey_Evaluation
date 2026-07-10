import { create } from 'zustand';
import { authService } from '../services/index.js';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, faculty } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(faculty));

      set({
        user: faculty,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && user) {
      set({
        accessToken,
        refreshToken,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
