import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useNavigation from '@hooks/useNavigation';
import PATH from '@constants/path';
import { useAuthState } from '@contexts/auth/hooks/use-auth-state';

interface AuthRouteProps {
  element: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuthState();
  const { getPreviousRoute } = useNavigation();

  if (isAuthenticated) {
    const redirectTo = getPreviousRoute() || PATH.home;
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return element;
};

export default AuthRoute;
