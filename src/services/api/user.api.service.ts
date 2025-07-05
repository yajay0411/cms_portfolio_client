import ApiService from '@libs/Axios.Config';
import api_endpoint from './api_endpoint';

const UserApiService = {
  getAllUsers: async (params: string) => {
    const response = await ApiService.get<{ data: any; message: string }>(
      api_endpoint.USER_API_ENDPOINT.GET_ALL_USER + '?' + params
    );
    return response;
  },

  getUserDetails: async (id: string) => {
    const response = await ApiService.get<{ data: any; message: string }>(
      api_endpoint.USER_API_ENDPOINT.GET_USER_BY_ID(id)
    );
    return response;
  },

  updateUser: async (id: string, data: any) => {
    const response = await ApiService.uploadFile<{
      data: any;
      message: string;
    }>(api_endpoint.USER_API_ENDPOINT.EDIT_USER(id), data);
    return response;
  },

  deleteUser: async (id: string) => {
    const response = await ApiService.delete<{ data: any; message: string }>(
      api_endpoint.USER_API_ENDPOINT.DELETE_USER(id)
    );
    return response;
  },
};

export default UserApiService;
