import ApiService from '@libs/Axios.Config';
import api_endpoint from './api_endpoint';

const PortfolioApiService = {
  get: async (params: string) => {
    const response = await ApiService.get<{ data: any; message: string }>(api_endpoint.PORTFOLIO_API_ENDPOINT.GET_PORTFOLIOS + '?' + params);
    return response;
  },

  getById: async (id: string) => {
    const response = await ApiService.get<{ data: any; message: string }>(api_endpoint.PORTFOLIO_API_ENDPOINT.GET_PORTFOLIO_BY_ID(id));
    return response;
  },

  create: async (data: any) => {
    const response = await ApiService.uploadFile<{
      data: any;
      message: string;
    }>(api_endpoint.PORTFOLIO_API_ENDPOINT.CREATE_PORTFOLIO, data);
    return response;
  },

  edit: async (id: string, data: any) => {
    const response = await ApiService.uploadFile<{
      data: any;
      message: string;
    }>(api_endpoint.PORTFOLIO_API_ENDPOINT.EDIT_PORTFOLIO(id), data);
    return response;
  },

  delete: async (id: string) => {
    const response = await ApiService.delete<{ data: any; message: string }>(api_endpoint.PORTFOLIO_API_ENDPOINT.DELETE_PORTFOLIO(id));
    return response;
  }
};

export default PortfolioApiService;
