import { create } from 'zustand';
import { evaluationService } from '../services/index.js';

export const useEvaluationStore = create((set) => ({
  evaluation: null,
  marks: {},
  remarks: '',
  isLoading: false,
  isSaving: false,
  error: null,
  totalObtained: 0,
  totalConverted: 0,

  setMarks: (marks) => {
    set((state) => {
      const newMarks = { ...state.marks, ...marks };
      return { marks: newMarks };
    });
  },

  setRemark: (remark) => set({ remarks: remark }),

  fetchEvaluation: async (answerSheetId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluationService.getEvaluation(answerSheetId);
      set({ evaluation: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      // If evaluation not found (404), treat as no evaluation yet rather than an error
      if (error.response?.status === 404) {
        set({ evaluation: null, isLoading: false });
        return null;
      }

      const errorMessage = error.response?.data?.message || 'Failed to fetch evaluation';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  saveDraft: async (answerSheetId, marksArray) => {
    set({ isSaving: true, error: null });
    try {
      const response = await evaluationService.saveDraft(answerSheetId, marksArray, get().remarks);
      set({
        totalObtained: response.data.totalObtainedMarks,
        totalConverted: response.data.totalConvertedMarks,
        isSaving: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save draft';
      set({ error: errorMessage, isSaving: false });
      return null;
    }
  },

  submitEvaluation: async (answerSheetId, marksArray) => {
    set({ isSaving: true, error: null });
    try {
      const response = await evaluationService.submitEvaluation(answerSheetId, marksArray, get().remarks);
      set({
        totalObtained: response.data.totalObtainedMarks,
        totalConverted: response.data.totalConvertedMarks,
        isSaving: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit evaluation';
      set({ error: errorMessage, isSaving: false });
      return null;
    }
  },

  resetEvaluation: () => set({
    evaluation: null,
    marks: {},
    remarks: '',
    totalObtained: 0,
    totalConverted: 0,
    error: null,
  }),

  clearError: () => set({ error: null }),
}));

function get() {
  return useEvaluationStore.getState();
}
