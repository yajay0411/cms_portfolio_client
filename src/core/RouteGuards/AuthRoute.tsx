import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import ROLES from '@/constants/roles';
import { ADMIN_PATH, USER_PATH } from '@/constants/path';
import useNavigation from '@/hooks/useNavigation';

import { useAppContext } from '../../contexts/app.context';

interface AuthRouteProps {
  element: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  const { user, isAuthenticated } = useAppContext();
  const { getPreviousRoute } = useNavigation();

  if (!isAuthenticated) {
    return element;
  }

  const redirectTo =
    getPreviousRoute() ||
    (user?.role === ROLES.ADMIN ? ADMIN_PATH.dashboard : USER_PATH.portfolio);

  return <Navigate to={redirectTo} replace />;
};

export default AuthRoute;
