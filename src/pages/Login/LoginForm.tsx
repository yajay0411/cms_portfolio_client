import { useState } from 'react';
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

import { LoginSchema, LoginSchemaYup } from '../../validations/auth.validation';

interface LoginFormProps {
  onSubmit: ({ emailAddress, password }: LoginSchema) => void;
  handleForgotPassword: (emailAddress: string) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  onSubmit,
  handleForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
      </form>
    </FormProvider>
  );
};

export default LoginForm;
