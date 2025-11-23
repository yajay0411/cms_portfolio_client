import React from 'react';
import { Navigate } from 'react-router-dom';
import PATH from '@constants/path';
import { useAuthState } from '@contexts/auth/hooks/use-auth-state';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATH.login}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
