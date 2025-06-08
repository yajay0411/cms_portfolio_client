const PATH = {
  base: '/',
  home: '/home',
  login: '/login',
  register: '/register',
  confirmation: '/confirmation/:token',
  reset_password: '/reset-password/:token',
  unauthorized: '/unauthorized',
  admin: '/admin',
  user: '/user',
  manager: '/admin',
};

export default PATH;

export const ADMIN_PATH = {
  home: '/admin',
  dashboard: '/admin/dashboard',
  portfolio: '/admin/portfolio',
  profile: '/admin/protfile',
  add_portfolio: '/admin/portfolio/add',
  edit_portfolio: '/admin/portfolio/edit/:id',
};

export const USER_PATH = {
  home: '/user',
  portfolio: '/user/portfolio',
  profile: '/user/protfile',
  add_portfolio: '/user/portfolio/add',
  edit_portfolio: '/user/portfolio/edit/:id',
};
