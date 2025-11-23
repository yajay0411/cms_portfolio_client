import React, { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';

import PATH from '@constants/path';

import Loader from '@core/Loader/Loader';
import AuthRoute from '@core/RouteGuards/AuthRoute';
import ProtectedRoute from '@core/RouteGuards/ProtectedRoute';

// Lazy Imports (chunked and grouped)
const Login = lazy(() => import('@pages/Login/Login'));
const Register = lazy(() => import('@pages/Register/Register'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));
const UnAuthorized = lazy(() => import('@pages/UnAuthorized/UnAuthorized'));
const ConfirmationAccount = lazy(() => import('@pages/ConfirmationAccount/ConfirmationAccount'));
const ResetPassword = lazy(() => import('@pages/ResetPassword/ResetPassword'));
const Profile = lazy(() => import('@pages/Profile/Profile'));
const Home = lazy(() => import('@pages/Home/Home'));
const RHTextFieldPlayground = lazy(() => import('@pages/Playground/RHTextField.playground'));
const RazorPaymentPlayground = lazy(() => import('@pages/Playground/RazorPayment.playground'));

const FallbackLoader = () => (
  <Loader
    loading
    fullScreen
  />
);

const App: React.FC = () => {
  return (
    <Box
      component="main"
      className="content"
      sx={{
        width: 'inherit',
        height: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          {/* Auth Routes */}
          <Route
            path={PATH.login}
            element={<AuthRoute element={<Login />} />}
          />
          <Route
            path={PATH.register}
            element={<AuthRoute element={<Register />} />}
          />

          {/* Public */}
          <Route
            path={PATH.confirmation}
            element={<ConfirmationAccount />}
          />
          <Route
            path={PATH.reset_password}
            element={<ResetPassword />}
          />
          <Route
            path={PATH.unauthorized}
            element={<UnAuthorized />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />

          {/* User Routes */}
          <Route
            path={PATH.home}
            element={<ProtectedRoute children={<Outlet />} />}>
            <Route
              index
              element={<Home />}
            />
            <Route
              path={PATH.profile}
              element={<Profile />}
            />
          </Route>

          {/* Playground */}
          <Route
            path="playground"
            element={<Outlet />}>
            <Route
              path="1"
              element={<RHTextFieldPlayground />}
            />
            <Route
              path="2"
              element={<RazorPaymentPlayground />}
            />
          </Route>
        </Routes>
      </Suspense>
    </Box>
  );
};

export default App;
