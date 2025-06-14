import { useState, FC, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import useAuth from '@hooks/useAuth';

import ROLES from '@constants/roles';
import PATH, { ADMIN_PATH, USER_PATH } from '@constants/path';
import { TEST_IDS } from '@constants/testIds';

import useToaster from '@core/Toaster/Toaster';
import Loader from '@core/Loader/Loader';
import AuthService from '@services/api/auth.api.service';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import LoginForm from './LoginForm';
import { LoginSchema } from '../../validations/auth.validation';
import { ThemeContext } from '../../contexts/theme.context';

const Login: FC = () => {
  const navigate = useNavigate();
  const { onLogin } = useAuth();
  const { showToaster } = useToaster();

  const [isLoading, setIsLoading] = useState(false);

  const themeContext = useContext(ThemeContext);

  const onSubmit = async (formData: LoginSchema) => {
    setIsLoading(true);
    try {
      // const result = await loginUserApi(data);
      const { success, data, message } = await AuthService.login(formData);
      if (!success) {
        return new Error(message);
      }
      const { user } = data;
      await onLogin({ user });
      showToaster(message, { variant: 'success', CloseAction: true });
      user.role === ROLES.ADMIN
        ? navigate(ADMIN_PATH.dashboard)
        : navigate(USER_PATH.portfolio);
    } catch (error: any) {
      showToaster(error.message, { variant: 'error', CloseAction: true });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (emailAddress: string) => {
    setIsLoading(true);
    try {
      const { success, message } = await AuthService.forgotPassword({
        emailAddress,
      });
      if (!success) {
        return new Error(message);
      }
      showToaster(message, {
        variant: 'success',
        CloseAction: true,
        className: TEST_IDS.login.snackbarForgotPassward,
      });
    } catch (error: any) {
      showToaster(error.message, {
        variant: 'error',
        CloseAction: true,
        className: TEST_IDS.login.snackbarForgotPassward,
        autoHideDuration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader loading={isLoading} fullScreen={true} />}
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
          position: 'relative',
        }}
      >
        <Typography color="primary" fontWeight={600} variant="h4" gutterBottom>
          Log in
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          Don't have an account?
          <NavLink to={PATH.register} data-testid={TEST_IDS.login.signupLink}>
            <Tooltip title="Go to register" arrow placement="top">
              <Typography component={'span'} color="secondary">
                {' '}
                Sign up
              </Typography>
            </Tooltip>
          </NavLink>
        </Typography>

        <Tooltip title="Toogle dark/light mode" arrow>
          <Switch
            color="primary"
            checked={themeContext?.themeMode === 'dark' ? true : false}
            onChange={() => themeContext?.toggleTheme()}
            sx={{ position: 'absolute', top: 10, right: 10 }}
            data-testid={TEST_IDS.login.themeToggle}
          />
        </Tooltip>

        <LoginForm
          onSubmit={onSubmit}
          handleForgotPassword={handleForgotPassword}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

export default Login;
