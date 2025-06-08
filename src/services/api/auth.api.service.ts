import ApiService from '../../libs/Axios.Config';
import api_endpoint from './api_endpoint';

const AuthApiService = {
  register: async (payload: any) => {
    try {
      const response = await ApiService.uploadFile<{
        success: boolean;
        data: any;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.REGISTER, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (payload: any) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        data: any;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.LOGIN, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await ApiService.put<{
        success: boolean;
        data: any;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.LOGOUT);
      return response;
    } catch (error) {
      throw error;
    }
  },

  selfIdentification: async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        data: any;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.SELF_IDENTIFICATION);
      return response;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.REFRESH);
      return response;
    } catch (error) {
      throw error;
    }
  },

  confirmationAccount: async (token: string, code: string) => {
    try {
      const response = await ApiService.put<{
        success: boolean;
        message: string;
      }>(
        `${api_endpoint.AUTH_API_ENDPOINT.CONFIRMATION_ACCOUNT(token)}?code=${code}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (payload: any) => {
    try {
      const response = await ApiService.put<{
        success: boolean;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.FORGET_PASSWORD, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token: string, data: any) => {
    try {
      const response = await ApiService.put<{
        success: boolean;
        message: string;
      }>(api_endpoint.AUTH_API_ENDPOINT.RESET_PASSWORD(token), data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthApiService;
