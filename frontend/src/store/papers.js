import { create } from 'zustand';
import { papersService } from '../services/index.js';

export const usePapersStore = create((set, get) => ({
  papers: [],
  selectedPaper: null,
  total: 0,
  page: 1,
  pageSize: 10,
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchPapers: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await papersService.getAssignedPapers(page, pageSize);
      set({
        papers: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch papers';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  fetchPaperDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await papersService.getPaperDetails(id);
      set({ selectedPaper: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch paper details';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  searchPapers: async (query, page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const response = await papersService.searchPapers(query, page, pageSize);
      set({
        papers: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Search failed';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  clearPapers: () => set({ papers: [], selectedPaper: null, error: null }),

  clearError: () => set({ error: null }),
}));
