import { useState, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import RHTextField from '@core/CustomFormInputs/RHTextField';
import { TEST_IDS } from '@constants/testIds';

import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { ThemeContext } from '@contexts/theme.context';

import { LoginSchema, LoginSchemaYup } from '@validations/auth.validation';
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  onSubmit: ({ emailAddress, password }: LoginSchema) => void;
  handleForgotPassword: (emailAddress: string) => void;
  handleGoogleLogin: (emailAddress: any) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  onSubmit,
  handleForgotPassword,
  handleGoogleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const themeContext = useContext(ThemeContext);

  const methods = useForm({
    defaultValues: {
      emailAddress: '',
      password: '',
    },
    resolver: yupResolver(LoginSchemaYup),
  });

  const { handleSubmit } = methods;

  const onSubmitForm = (data: LoginSchema) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleForgotPasswordForm = async () => {
    if (handleForgotPassword) {
      const emailAddress = methods.getValues('emailAddress');
      handleForgotPassword(emailAddress);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Stack spacing={3}>
          <RHTextField
            variant="outlined"
            name="emailAddress"
            label="Email address"
            placeholder="Enter email address"
            fullWidth
            testId={TEST_IDS.login.emailInput}
          />
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
                  <VisibilityOffIcon
                    color={'primary'}
                    data-testid={TEST_IDS.login.hidePassword}
                  />
                ) : (
                  <VisibilityIcon
                    color={'primary'}
                    data-testid={TEST_IDS.login.showPassword}
                  />
                )}
              </Tooltip>
            }
            iconPosition="end"
            onIconClick={() => setShowPassword(!showPassword)}
            fullWidth
            testId={TEST_IDS.login.passwordInput}
          />
          <Tooltip title="forgot password">
            <Typography
              onClick={handleForgotPasswordForm}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                marginTop: '8px !important',
              }}
              data-testid={TEST_IDS.login.forgotPasswordLink}
            >
              Forgot password?
            </Typography>
          </Tooltip>
        </Stack>
        <Tooltip title="Login in" arrow>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 4, fontWeight: 700 }}
            loading={isLoading}
            data-testid={TEST_IDS.login.loginButton}
          >
            Login
          </Button>
        </Tooltip>
        {/* Divider */}
        <Divider
          sx={{
            my: 3,
            color: themeContext?.themeMode === 'dark' ? '#aaa' : '#888',
            '&::before, &::after': {
              borderColor: themeContext?.themeMode === 'dark' ? '#333' : '#ccc',
            },
          }}
        >
          or
        </Divider>
        {/* Google Login Button with themed background */}
        <Box
          data-testid={TEST_IDS.login.googleSigninButton}
          sx={{
            width: '100%',
            boxShadow: '0 1px 4px #0004',
          }}
        >
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse);
            }}
            onError={() => {
              handleGoogleLogin('Error');
            }}
            width="100%"
            logo_alignment="left"
            context="signin"
            text="continue_with"
            shape="rectangular"
            locale="red"
            theme={
              themeContext?.themeMode === 'dark'
                ? 'filled_black'
                : 'filled_blue'
            }
          />
        </Box>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
