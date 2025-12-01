import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import PATH from '@constants/path';
import { TEST_IDS } from '@constants/testIds';

import useToaster from '@core/Toaster/Toaster';
import Loader from '@core/Loader/Loader';
import AuthApiService from '@services/api/auth.api.service';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import EmailPassLoginForm from './components/EmailPassLoginForm';
import { LoginSchema } from '@validations/auth.validation';
import MobileOtpLoginForm from './components/MobileOtpLoginForm';
import { Button, Divider } from '@mui/material';
import { EmailRounded, VerifiedUser } from '@mui/icons-material';
import GoogleOAuthLoginFrom from './components/GoogleOAuthLoginFrom';
import { useThemeActions } from '@contexts/theme/hooks/use-theme-actions';
import { useThemeState } from '@contexts/theme/hooks/use-theme-state';
import { useAuthActions } from '@contexts/auth/hooks/use-auth-actions';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const { showToaster } = useToaster();

  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<'email-password' | 'otp'>('email-password');

  const { toggleTheme } = useThemeActions();

  const { themeMode } = useThemeState();

  const onSubmit = async (formData: LoginSchema) => {
    setIsLoading(true);
    try {
      // const result = await loginUserApi(data);
      const { success, data, message } = await AuthApiService.login(formData);
      if (!success) {
        return new Error(message);
      }
      const { user } = data;
      await login({ user });
      showToaster(message, { variant: 'success', CloseAction: true });
      navigate(PATH.home);
    } catch (error: any) {
      showToaster(error.message, { variant: 'error', CloseAction: true });
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (contact: string) => {
    if (!contact) return false;
    setIsLoading(true);
    try {
      const { success, message } = await AuthApiService.requestLoginOtp({
        contact
      });
      if (!success) throw new Error(message);
      showToaster(message || 'OTP sent successfully', {
        variant: 'success',
        CloseAction: true
      });
      return true;
    } catch (error: any) {
      showToaster(error.message || 'Failed to send OTP', {
        variant: 'error',
        CloseAction: true
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { success, message } = await AuthApiService.forgotPassword({
        email
      });
      if (!success) {
        return new Error(message);
      }
      showToaster(message, {
        variant: 'success',
        CloseAction: true,
        className: TEST_IDS.login.snackbarForgotPassward
      });
    } catch (error: any) {
      showToaster(error.message, {
        variant: 'error',
        CloseAction: true,
        className: TEST_IDS.login.snackbarForgotPassward,
        autoHideDuration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const { success, data, message } = await AuthApiService.login(credentialResponse);
      if (!success) throw new Error(message);
      await login({ user: data.user });
      showToaster(message, { variant: 'success', CloseAction: true });
      navigate(PATH.home);
      showToaster('Google login successful', {
        variant: 'success',
        CloseAction: true
      });
    } catch (error: any) {
      showToaster(error.message || 'Google login failed', {
        variant: 'error',
        CloseAction: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && (
        <Loader
          loading={isLoading}
          fullScreen={true}
        />
      )}
      <Box
        id={'test'}
        sx={{
          p: 5,
          width: '100%',
          minWidth: '400px',
          maxWidth: '400px',
          height: 'auto',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          bgcolor: 'background.paper',
          borderRadius: 2,
          position: 'relative'
        }}>
        <Typography
          color="primary"
          fontWeight={600}
          variant="h4"
          gutterBottom>
          Log in
        </Typography>

        <Typography variant="subtitle1">
          Don't have an account?
          <NavLink
            to={PATH.register}
            data-testid={TEST_IDS.login.signupLink}>
            <Tooltip
              title="Go to register"
              arrow
              placement="top">
              <Typography
                component={'span'}
                color="secondary">
                {' '}
                Sign up
              </Typography>
            </Tooltip>
          </NavLink>
        </Typography>

        <Tooltip
          title="Toogle dark/light mode"
          arrow>
          <Switch
            color="primary"
            checked={themeMode === 'dark' ? true : false}
            onChange={() => toggleTheme()}
            sx={{ position: 'absolute', top: 10, right: 10 }}
            data-testid={TEST_IDS.login.themeToggle}
          />
        </Tooltip>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            my: 3
          }}>
          <Button
            variant={formType === 'email-password' ? 'contained' : 'outlined'}
            color={formType === 'email-password' ? 'primary' : 'secondary'}
            onClick={() => setFormType('email-password')}
            data-testid={TEST_IDS.login.loginWithEmailLink}>
            <EmailRounded sx={{ fontSize: 16, mr: 1 }} />
            Email
          </Button>
          <Button
            variant={formType === 'otp' ? 'contained' : 'outlined'}
            color={formType === 'otp' ? 'primary' : 'secondary'}
            onClick={() => setFormType('otp')}
            data-testid={TEST_IDS.login.loginWithMobileLink}>
            <VerifiedUser sx={{ fontSize: 16, mr: 1 }} />
            OTP
          </Button>
        </Box>

        {formType === 'email-password' && (
          <EmailPassLoginForm
            isLoading={isLoading}
            onSubmit={onSubmit}
            handleForgotPassword={handleForgotPassword}
          />
        )}

        {formType === 'otp' && (
          <MobileOtpLoginForm
            isLoading={isLoading}
            onSubmit={onSubmit}
            onRequestOtp={handleRequestOtp}
          />
        )}

        {/* Divider */}
        <Divider
          sx={{
            my: 3,
            color: themeMode === 'dark' ? '#aaa' : '#888',
            '&::before, &::after': {
              borderColor: themeMode === 'dark' ? '#333' : '#ccc'
            }
          }}>
          or
        </Divider>

        {/* Google Login Button with themed background */}
        <GoogleOAuthLoginFrom
          isLoading={isLoading}
          handleGoogleLogin={handleGoogleLogin}
        />
      </Box>
    </>
  );
};

export default Login;
