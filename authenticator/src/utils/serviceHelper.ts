// src/services/api.ts
import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true, 
});

// GET API
export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// POST API
export const post = async <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export default api;
