import { apiClient } from './client';
import {
  AuthResponse,
  AnalysisRecord,
  AIRecommendationResult,
  EncryptionResult,
  BenchmarkItem,
  ReportRecord,
  DashboardData,
} from '../types';

// Auth Endpoints
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  getMe: () => apiClient.get<{ success: boolean; user: any }>('/auth/me'),
};

// Analysis Endpoints
export const analysisApi = {
  analyzeData: (formData: FormData) =>
    apiClient.post<{ success: boolean; message: string; data: AnalysisRecord }>('/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: (params?: { search?: string; algorithm?: string; riskLevel?: string; page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; count: number; total: number; data: AnalysisRecord[] }>('/analysis/history', {
      params,
    }),
  getById: (id: string) =>
    apiClient.get<{ success: boolean; data: AnalysisRecord }>(`/analysis/${id}`),
  deleteById: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/analysis/${id}`),
};

// Cryptanalysis Endpoints
export const cryptanalysisApi = {
  runAnalysis: (formData: FormData) =>
    apiClient.post<{ success: boolean; message: string; data: any }>('/cryptanalysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Encryption Endpoints
export const encryptionApi = {
  encrypt: (data: { plaintext: string; algorithm?: string; key?: string; mode?: string }) =>
    apiClient.post<{ success: boolean; message: string; data: EncryptionResult }>('/encryption/encrypt', data),
  decrypt: (data: { ciphertext: string; algorithm?: string; key: string; mode?: string }) =>
    apiClient.post<{ success: boolean; message: string; data: EncryptionResult }>('/encryption/decrypt', data),
  getBenchmarks: () =>
    apiClient.get<{ success: boolean; data: BenchmarkItem[] }>('/encryption/benchmarks'),
};

// AI Recommendation Endpoints
export const aiApi = {
  getRecommendation: (data: {
    dataSensitivity: string;
    dataType: string;
    requiredSecurityLevel: string;
    performancePriority: string;
    keySizePreference: string;
  }) =>
    apiClient.post<{ success: boolean; message: string; data: AIRecommendationResult; savedId: string }>(
      '/ai/recommend',
      data
    ),
  getHistory: () => apiClient.get<{ success: boolean; data: any[] }>('/ai/history'),
};

// Report Endpoints
export const reportApi = {
  createReport: (data: { analysisId?: string; reportTitle?: string; clientInfo?: any }) =>
    apiClient.post<{ success: boolean; message: string; data: ReportRecord }>('/reports', data),
  getAll: () => apiClient.get<{ success: boolean; data: ReportRecord[] }>('/reports'),
  getById: (id: string) => apiClient.get<{ success: boolean; data: ReportRecord }>(`/reports/${id}`),
  downloadPdf: (id: string) =>
    apiClient.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
  exportJson: (id: string) =>
    apiClient.get(`/reports/${id}/json`, { responseType: 'blob' }),
};

// Dashboard Endpoints
export const dashboardApi = {
  getStats: () => apiClient.get<{ success: boolean; data: DashboardData }>('/dashboard/stats'),
};

// User Profile Endpoints
export const userApi = {
  getProfile: () => apiClient.get<{ success: boolean; data: any }>('/user/profile'),
  updateProfile: (data: { name: string; preferences?: any }) =>
    apiClient.put<{ success: boolean; message: string; data: any }>('/user/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<{ success: boolean; message: string }>('/user/change-password', data),
};
