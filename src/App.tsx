import React, { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';

import PATH, { ADMIN_PATH, USER_PATH } from '@constants/path';
import ROLES from '@constants/roles';

import ErrorBoundary from '@core/ErrorBoundary/ErrorBoundary';
import Loader from '@core/Loader/Loader';
import AuthRoute from '@core/RouteGuards/AuthRoute';
import ProtectedRoute from '@core/RouteGuards/ProctectedRoute';

// Lazy Imports (chunked and grouped)
const Login = lazy(() => import('@pages/Login/Login'));
const Register = lazy(() => import('@pages/Register/Register'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));
const UnAuthorized = lazy(() => import('@pages/UnAuthorized/UnAuthorized'));
const ConfirmationAccount = lazy(
  () => import('@pages/ConfirmationAccount/ConfirmationAccount')
);
const ResetPassword = lazy(() => import('@pages/ResetPassword/ResetPassword'));
const Profile = lazy(() => import('@pages/Profile/Profile'));
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard'));
const Home = lazy(() => import('@pages/Home/Home'));
const PortfolioList = lazy(() => import('@pages/Portfolio/PortfolioList'));
const AddPortfolio = lazy(() => import('@pages/Portfolio/AddPortfolio'));
const EditPortfolio = lazy(() => import('@pages/Portfolio/EditPortfolio'));
const RHTextFieldPlayground = lazy(
  () => import('@pages/Playground/RHTextField.playground')
);
const RazorPaymentPlayground = lazy(
  () => import('@pages/Playground/RazorPayment.playground')
);

const FallbackLoader = () => <Loader loading fullScreen />;
const WrapSuspense = (children: React.ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<FallbackLoader />}>{children}</Suspense>
  </ErrorBoundary>
);

function App() {
  return (
    <Box
      component="main"
      className="content"
      sx={{
        width: 'inherit',
        height: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Routes>
        {/* Auth Routes */}
        <Route
          path={PATH.login}
          element={<AuthRoute element={WrapSuspense(<Login />)} />}
        />
        <Route
          path={PATH.register}
          element={<AuthRoute element={WrapSuspense(<Register />)} />}
        />

        {/* Public */}
        <Route
          path={PATH.confirmation}
          element={WrapSuspense(<ConfirmationAccount />)}
        />
        <Route
          path={PATH.reset_password}
          element={WrapSuspense(<ResetPassword />)}
        />
        <Route
          path={PATH.unauthorized}
          element={WrapSuspense(<UnAuthorized />)}
        />
        <Route path="*" element={WrapSuspense(<NotFound />)} />

        {/* Redirect */}
        <Route path={PATH.base} element={<Navigate to={PATH.login} />} />

        {/* User Routes */}
        <Route
          path={PATH.user}
          element={
            <ProtectedRoute roleAccess={[ROLES.USER]} element={<Outlet />} />
          }
        >
          <Route
            path={USER_PATH.portfolio}
            element={WrapSuspense(<PortfolioList />)}
          />
          <Route
            path={USER_PATH.add_portfolio}
            element={WrapSuspense(<AddPortfolio />)}
          />
          <Route
            path={USER_PATH.edit_portfolio}
            element={WrapSuspense(<EditPortfolio />)}
          />
          <Route path={USER_PATH.profile} element={WrapSuspense(<Profile />)} />
        </Route>

        {/* Admin Routes */}
        <Route
          path={PATH.admin}
          element={
            <ProtectedRoute roleAccess={[ROLES.ADMIN]} element={<Outlet />} />
          }
        >
          <Route path={ADMIN_PATH.home} element={WrapSuspense(<Home />)} />
          <Route
            path={ADMIN_PATH.dashboard}
            element={WrapSuspense(<Dashboard />)}
          />
          <Route
            path={ADMIN_PATH.portfolio}
            element={WrapSuspense(<PortfolioList />)}
          />
          <Route
            path={ADMIN_PATH.add_portfolio}
            element={WrapSuspense(<AddPortfolio />)}
          />
          <Route
            path={ADMIN_PATH.edit_portfolio}
            element={WrapSuspense(<EditPortfolio />)}
          />
          <Route
            path={ADMIN_PATH.profile}
            element={WrapSuspense(<Profile />)}
          />
        </Route>

        {/* Playground */}
        <Route path="playground" element={<Outlet />}>
          <Route path="1" element={WrapSuspense(<RHTextFieldPlayground />)} />
          <Route path="2" element={WrapSuspense(<RazorPaymentPlayground />)} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
