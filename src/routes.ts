import ROLES from './constants/roles';
// import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ADMIN_PATH, USER_PATH } from './constants/path';

interface Route {
  to: string;
  icon: React.ElementType;
  title: string;
  roles?: string[];
  children?: Route[];
}

export const getRoutes = (user: { role: string } | null): Route[] => [
  {
    to: ADMIN_PATH.dashboard,
    icon: DashboardIcon,
    title: 'Dashboard',
    roles: [ROLES.ADMIN],
  },
  {
    to: user?.role === ROLES.USER ? USER_PATH.portfolio : ADMIN_PATH.portfolio,
    icon: CollectionsIcon,
    title: 'Portfolio',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
  {
    to: user?.role === ROLES.USER ? USER_PATH.profile : ADMIN_PATH.profile,
    icon: AccountCircleIcon,
    title: 'Profile',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
];
