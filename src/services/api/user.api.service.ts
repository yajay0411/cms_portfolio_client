import ApiService from '../../libs/Axios.Config';
import api_endpoint from './api_endpoint';

const UserApiService = {
  getAllUsers: async (params: string) => {
    try {
      const response = await ApiService.get<{ data: any; message: string }>(
        api_endpoint.USER_API_ENDPOINT.GET_ALL_USER + '?' + params
      );
      return response;
    } catch (error) {
      console.error('Get all users failed', error);
      throw error;
    }
  },

  getUserDetails: async (id: string) => {
    try {
      const response = await ApiService.get<{ data: any; message: string }>(
        api_endpoint.USER_API_ENDPOINT.GET_USER_BY_ID(id)
      );
      return response;
    } catch (error) {
      console.error('Get user details failed', error);
      throw error;
    }
  },

  updateUser: async (id: string, data: any) => {
    try {
      const response = await ApiService.uploadFile<{
        data: any;
        message: string;
      }>(api_endpoint.USER_API_ENDPOINT.EDIT_USER(id), data);
      return response;
    } catch (error) {
      console.error('Update user failed', error);
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await ApiService.delete<{ data: any; message: string }>(
        api_endpoint.USER_API_ENDPOINT.DELETE_USER(id)
      );
      return response;
    } catch (error) {
      console.error('Delete user failed', error);
      throw error;
    }
  },
};

export default UserApiService;
