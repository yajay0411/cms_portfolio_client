export default {
  AUTH_API_ENDPOINT: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SELF_IDENTIFICATION: '/auth/self-identification',
    REFRESH: '/auth/refresh-token',
    CONFIRMATION_ACCOUNT: (token: string) => `/auth/confirmation/${token}`,
    FORGET_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  },
  USER_API_ENDPOINT: {
    GET_ALL_USER: '/user/',
    GET_USER_BY_ID: (id: string) => `/user/${id}`,
    EDIT_USER: (id: string) => `/user/edit/${id}`,
    DELETE_USER: (id: string) => `/user/delete/${id}`,
  },
  PORTFOLIO_API_ENDPOINT: {
    GET_PORTFOLIOS: '/portfolio/',
    CREATE_PORTFOLIO: '/portfolio/add',
    EDIT_PORTFOLIO: (id: string) => `/portfolio/edit/${id}`,
    DELETE_PORTFOLIO: (id: string) => `/portfolio/delete/${id}`,
    GET_PORTFOLIO_BY_ID: (id: string) => `/portfolio/${id}`,
  },
};
