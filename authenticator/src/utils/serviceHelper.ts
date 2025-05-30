// src/services/api.ts
import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true, 
  headers: {
    'X-Forwarded-Referer': window.location.href
  }
});

// GET API with error handling
export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`GET ${url} failed:`, error);
    throw error; // rethrow so it can be caught in the component
  }
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
