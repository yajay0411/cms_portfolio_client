import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import PATH from '@constants/path';
import Loader from '@core/Loader/Loader';
import RHTextField from '@core/CustomFormInputs/RHTextField';
import useNavigation from '@hooks/useNavigation';
import AuthApiService from '@services/api/auth.api.service';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {
  ResetPasswordSchema,
  ResetPasswordSchemaYup,
} from '../../validations/auth.validation';
import { ThemeContext } from '../../contexts/theme.context';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { goTo } = useNavigation();
  const themeContext = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(ResetPasswordSchemaYup),
  });

  const resetPasswordSubmit = async (formData: ResetPasswordSchema) => {
    setIsLoading(true);
    try {
      const { password } = formData;
      const payload = {
        newPassword: password,
      };

      const { success, message } = await AuthApiService.resetPassword(
        token as string,
        payload
      );
      if (!success) {
        throw new Error(message);
      }
      goTo(PATH.login);
    } catch (error) {
      console.error('Error resetting password:', error);
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
          minHeight: '400px', //
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'stretch',
          bgcolor: 'background.paper',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Typography color="primary" fontWeight={600} variant="h4" gutterBottom>
          Reset password
        </Typography>

        <Tooltip title="Toogle dark/light mode" arrow>
          <Switch
            color="primary"
            checked={themeContext?.themeMode === 'dark' ? true : false}
            onChange={() => themeContext?.toggleTheme()}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          />
        </Tooltip>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(resetPasswordSubmit)}>
            <Stack spacing={3}>
              <RHTextField
                variant="outlined"
                name="password"
                label="Password"
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                icon={
                  <Tooltip
                    title={showPassword ? 'Hide password' : 'Show password'}
                    arrow
                    slotProps={{
                      popper: {
                        disablePortal: true,
                        modifiers: [
                          {
                            name: 'preventOverflow',
                            enabled: true,
                          },
                        ],
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon color={'primary'} />
                    ) : (
                      <VisibilityIcon color={'primary'} />
                    )}
                  </Tooltip>
                }
                iconPosition="end"
                onIconClick={() => setShowPassword(!showPassword)}
                fullWidth
              />
              <RHTextField
                variant="outlined"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={
                  <Tooltip
                    title={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    arrow
                    slotProps={{
                      popper: {
                        disablePortal: true,
                        modifiers: [
                          {
                            name: 'preventOverflow',
                            enabled: true,
                          },
                        ],
                      },
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon color={'primary'} />
                    ) : (
                      <VisibilityIcon color={'primary'} />
                    )}
                  </Tooltip>
                }
                iconPosition="end"
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                fullWidth
              />
            </Stack>
            <Tooltip title="Reset password" arrow>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 4, fontWeight: 700 }}
                loading={isLoading}
              >
                Reset
              </Button>
            </Tooltip>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default ResetPassword;
