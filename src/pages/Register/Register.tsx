import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import PATH from '@constants/path';
import useToaster from '@core/Toaster/Toaster';
import useNavigation from '@hooks/useNavigation';
import AuthService from '@services/api/auth.api.service';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import RegisterForm from './RegisterForm';
import { ThemeContext } from '../../contexts/theme.context';
import { RegisterSchema } from '../../validations/auth.validation';

const Register: React.FC = () => {
  const { goTo } = useNavigation();
  const { showToaster } = useToaster();
  const themeContext = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: RegisterSchema) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('emailAddress', values.emailAddress);
      formData.append('password', values.password);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('consent', values.consent ? 'true' : 'false');

      // Only append the file if a new one was selected
      if (values.profile_image) {
        formData.append('profile_image', values.profile_image);
      }

      const { success, message } = await AuthService.register(formData);
      if (!success) {
        throw new Error(message);
      }
      goTo(PATH.login);
      showToaster(message, { variant: 'success', CloseAction: true });
    } catch (error: any) {
      showToaster(error.message, { variant: 'error', CloseAction: true });
      setIsLoading(false);
    }
  };
  return (
    <>
      <Box
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
          Sign up
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Have an account?
          <NavLink to={PATH.login}>
            <Tooltip title="Go to Log in" arrow placement="top">
              <Typography component={'span'} color="secondary">
                {' '}
                Log in
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
          />
        </Tooltip>
        <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
      </Box>
    </>
  );
};

export default Register;
