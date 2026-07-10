import { create } from 'zustand';
import { dashboardService } from '../services/index.js';

export const useDashboardStore = create((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardService.getStats();
      set({ stats: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch stats';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  clearStats: () => set({ stats: null, error: null }),
}));
