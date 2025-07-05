import ApiService from '@libs/Axios.Config';
import api_endpoint from './api_endpoint';

const AuthApiService = {
  register: async (payload: any) => {
    return await ApiService.uploadFile<{
      success: boolean;
      data: any;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.REGISTER, payload);
  },

  login: async (payload: any) => {
    return await ApiService.post<{
      success: boolean;
      data: any;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.LOGIN, payload);
  },

  logout: async () => {
    return await ApiService.put<{
      success: boolean;
      data: any;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.LOGOUT);
  },

  selfIdentification: async () => {
    return await ApiService.get<{
      success: boolean;
      data: any;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.SELF_IDENTIFICATION);
  },

  refreshToken: async () => {
    return await ApiService.get<{
      success: boolean;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.REFRESH);
  },

  confirmationAccount: async (token: string, code: string) => {
    return await ApiService.put<{
      success: boolean;
      message: string;
    }>(
      `${api_endpoint.AUTH_API_ENDPOINT.CONFIRMATION_ACCOUNT(token)}?code=${code}`
    );
  },

  forgotPassword: async (payload: any) => {
    return await ApiService.put<{
      success: boolean;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.FORGET_PASSWORD, payload);
  },

  resetPassword: async (token: string, data: any) => {
    return await ApiService.put<{
      success: boolean;
      message: string;
    }>(api_endpoint.AUTH_API_ENDPOINT.RESET_PASSWORD(token), data);
  },
};

export default AuthApiService;
