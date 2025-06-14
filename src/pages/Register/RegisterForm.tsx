import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import RHTextField from '@core/CustomFormInputs/RHTextField';

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AttachFileIcon from '@mui/icons-material/AttachFileOutlined';

import {
  RegisterSchema,
  RegisterSchemaYup,
} from '../../validations/auth.validation';

interface RegisterFormProps {
  onSubmit: ({
    name,
    emailAddress,
    phoneNumber,
    password,
    profile_image,
  }: RegisterSchema) => void;
  isLoading: boolean;
}
const RegisterForm: React.FC<RegisterFormProps> = ({ isLoading, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      emailAddress: '',
      password: '',
      phoneNumber: '',
      profile_image: null,
    },
    resolver: yupResolver(RegisterSchemaYup),
    // mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const onSubmitForm = (data: RegisterSchema) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Stack spacing={3}>
          <RHTextField
            variant="outlined"
            name="name"
            label="Name"
            placeholder="Enter name"
            fullWidth
          />
          <RHTextField
            variant="outlined"
            name="emailAddress"
            label="Email address"
            placeholder="Enter email address"
            required
            fullWidth
          />
          <RHTextField
            variant="outlined"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            required
            fullWidth
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
            name="profile_image"
            label="Profile Picture (Optional)"
            type="file"
            icon={<AttachFileIcon />}
            iconPosition="start"
            fileInputOptions={{
              accept: '.png, .jpg, .jpeg',
              maxSize: 5 * 1024 * 1024,
              multiple: true,
            }}
            enableDragDrop={true}
            fullWidth
            onChange={(e) => {
              console.log(e);
              const file = e.target.files?.[0] || null;
              methods.setValue('profile_image', file);
            }}
          />
          <RHTextField
            variant="outlined"
            type="checkbox"
            name="consent"
            label="I agree to the terms and conditions"
            fullWidth
          />
        </Stack>

        <Tooltip title="Register" arrow>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 4, fontWeight: 700 }}
            loading={isLoading}
          >
            Register
          </Button>
        </Tooltip>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
