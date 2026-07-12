import apiClient from "./api.js";

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email, password, displayName, role) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      displayName,
      role,
    });
    return response.data;
  },

  logout: async () => {
    return apiClient.post("/auth/logout");
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },
};

export const papersService = {
  getAssignedPapers: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get("/papers", {
      params: { page, pageSize },
    });
    return response.data;
  },

  getPaperDetails: async (id) => {
    const response = await apiClient.get(`/papers/${id}`);
    return response.data;
  },

  searchPapers: async (query, page = 1, pageSize = 10) => {
    const response = await apiClient.get("/papers/search", {
      params: { query, page, pageSize },
    });
    return response.data;
  },
};

export const evaluationService = {
  getEvaluation: async (answerSheetId) => {
    const response = await apiClient.get(`/evaluations/${answerSheetId}`);
    return response.data;
  },

  saveDraft: async (answerSheetId, marks, remarks, targetMarks) => {
    const response = await apiClient.post(
      `/evaluations/${answerSheetId}/draft`,
      { marks, remarks, targetMarks },
    );
    return response.data;
  },

  submitEvaluation: async (answerSheetId, marks, remarks, targetMarks) => {
    const response = await apiClient.post(
      `/evaluations/${answerSheetId}/submit`,
      { marks, remarks, targetMarks },
    );
    return response.data;
  },
};

export const adminService = {
  listUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  createUser: async (email, password, displayName, role) => {
    const response = await apiClient.post("/admin/users", {
      email,
      password,
      displayName,
      role,
    });
    return response.data;
  },

  setUserRole: async (uid, role) => {
    const response = await apiClient.patch(`/admin/users/${uid}/role`, {
      role,
    });
    return response.data;
  },

  deleteUser: async (uid) => {
    const response = await apiClient.delete(`/admin/users/${uid}`);
    return response.data;
  },
};
