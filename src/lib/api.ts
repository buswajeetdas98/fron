import axios, { type AxiosRequestHeaders } from 'axios';

// If VITE_API_URL is not set, rely on Vite proxy with same-origin base ('')
const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gm_auth_token') : null;
  if (token) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    };
    config.headers = headers as unknown as AxiosRequestHeaders;
  }
  return config;
});
