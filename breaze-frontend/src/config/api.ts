import { OpenAPI } from '../api-client/core/OpenAPI';

export const API_GATEWAY_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '');
export const API_BASE_PATH = `${API_GATEWAY_BASE_URL}/api`;

export const configureGeneratedApiClient = () => {
  OpenAPI.BASE = API_GATEWAY_BASE_URL;
  OpenAPI.TOKEN = async () => localStorage.getItem('breaze_token') ?? '';
};