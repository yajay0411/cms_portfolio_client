import ApiService from '../../libs/Axios.Config';
import api_endpoint from './api_endpoint';

const PortfolioApiService = {
  get: async (params:string) => {
    try {
      const response = await ApiService.get<{ data: any; message: string }>(
        api_endpoint.PORTFOLIO_API_ENDPOINT.GET_PORTFOLIOS+"?"+params
      );
      return response;
    } catch (error) {
      console.error('Get portfolios failed', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await ApiService.get<{ data: any; message: string }>(
        api_endpoint.PORTFOLIO_API_ENDPOINT.GET_PORTFOLIO_BY_ID(id)
      );
      return response;
    } catch (error) {
      console.error('Get portfolio by ID failed', error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await ApiService.uploadFile<{ data: any; message: string }>(
        api_endpoint.PORTFOLIO_API_ENDPOINT.CREATE_PORTFOLIO,
        data
      );
      return response;
    } catch (error) {
      console.error('Create portfolio failed', error);
      throw error;
    }
  },

  edit: async (id: string, data: any) => {
    try {
      const response = await ApiService.uploadFile<{ data: any; message: string }>(
        api_endpoint.PORTFOLIO_API_ENDPOINT.EDIT_PORTFOLIO(id),
        data
      );
      return response;
    } catch (error) {
      console.error('Edit portfolio failed', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await ApiService.delete<{ data: any; message: string }>(
        api_endpoint.PORTFOLIO_API_ENDPOINT.DELETE_PORTFOLIO(id)
      );
      return response;
    } catch (error) {
      console.error('Delete portfolio failed', error);
      throw error;
    }
  },
};

export default PortfolioApiService;
