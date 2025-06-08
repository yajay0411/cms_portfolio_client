import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import PATH from '@constants/path';
import Loader from '@core/Loader/Loader';

import { useAppContext } from '../../contexts/app.context';

// Components
const Layout = lazy(() => import('../Layout/Layout'));

interface ProtectedRouteProps {
  element: React.ReactElement;
  roleAccess?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  roleAccess = [],
}) => {
  const { user, isAuthenticated } = useAppContext();

  // Handle authentication
  if (!isAuthenticated) {
    return <Navigate to={PATH.login} replace />;
  }

  // Handle role authorization
  if (
    roleAccess.length > 0 &&
    (!user?.role || !roleAccess.includes(user.role))
  ) {
    return <Navigate to={PATH.unauthorized} replace />;
  }

  // Return protected content
  return (
    <Suspense fallback={<Loader loading={true} fullScreen={true} />}>
      <Layout>{element}</Layout>
    </Suspense>
  );
};

export default ProtectedRoute;
