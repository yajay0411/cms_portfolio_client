import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { clearAllStorage, getFromLS } from '../utils/browserStorage';
import { User } from '../types/user.type';
import ROLES from '../constants/roles';
import { EStorageKey } from '../constants/storage_key';
import AuthApiService from '../services/api/auth.api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define API Base URL
const BASE_URL = API_BASE_URL || 'http://localhost:8080/api/v1';

// Create Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 Unauthorized error with token refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { success, message } = await AuthApiService.refreshToken();
        if (success) return api(originalRequest);
        return new Error(message);
      } catch (refreshError) {
        clearAllStorage();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other error status codes
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Forbidden!');
          break;
        case 500:
          console.error('Server error! Try again later.');
          break;
        default:
          console.error(`API error: ${error}`);
      }
    } else if (error.request) {
      console.error('Network error! Check your internet connection.');
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic request function
 */
const request = async <T>(
  config: AxiosRequestConfig,
  signal?: AbortSignal,
  isFileUpload = false
): Promise<T> => {
  try {
    // Set content type for file uploads
    const requestConfig = { ...config };

    if (isFileUpload) {
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    }

    const response = await api.request<T>({ ...requestConfig, signal });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * API Service with common HTTP methods
 */
const ApiService = {
  get: <T>(url: string, params?: object, signal?: AbortSignal) => {
    const user = getFromLS<User>(EStorageKey.USER_KEY);
    if (user && user.role === ROLES.USER) {
      if (user._id) {
        params = { ...params, user_id: user._id };
      }
    }
    return request<T>({ url, method: 'GET', params }, signal);
  },

  post: <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
    isFileUpload = false
  ) =>
    request<T>(
      { url, method: 'POST', data, ...config },
      undefined,
      isFileUpload
    ),

  put: <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
    isFileUpload = false
  ) =>
    request<T>(
      { url, method: 'PUT', data, ...config },
      undefined,
      isFileUpload
    ),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ url, method: 'DELETE', ...config }),

  uploadFile: <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ) =>
    request<T>(
      { url, method: 'POST', data: formData, ...config },
      undefined,
      true
    ),
};
export default ApiService;
export { api };
