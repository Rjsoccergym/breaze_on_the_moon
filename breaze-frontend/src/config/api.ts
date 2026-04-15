import { OpenAPI } from '../api-client/core/OpenAPI';

const resolveDefaultApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'http://localhost:8081';
};

export const API_GATEWAY_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? resolveDefaultApiBaseUrl()).replace(/\/$/, '');
export const API_BASE_PATH = `${API_GATEWAY_BASE_URL}/api`;

export const configureGeneratedApiClient = () => {
  OpenAPI.BASE = API_GATEWAY_BASE_URL;
  OpenAPI.TOKEN = async () => localStorage.getItem('breaze_token') ?? '';
};