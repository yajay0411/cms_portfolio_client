import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import RHTextField from '@core/CustomFormInputs/RHTextField';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Email, VisibilityOff } from '@mui/icons-material';


const RHTextFieldPlayground: React.FC = () => {
  const methods = useForm();
  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
        <Stack spacing={3}>
          {/* Text */}
          <RHTextField
            variant="outlined"
            name="username"
            label="Username"
            type="text"
            defaultValue={''}
            // validationRules={{ required: 'This field is required' }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          {/* Email with icon */}
          <RHTextField
            variant="outlined"
            name="email"
            label="Email"
            type="email"
            defaultValue={''}
            icon={<Email />}
            iconPosition="start"
            // validationRules={{ required: 'This field is required' }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          {/* Password with toggle visibility */}
          <RHTextField
            variant="outlined"
            name="password"
            label="Password"
            type="password"
            defaultValue={''}
            icon={<VisibilityOff />}
            onIconClick={() => alert('Toggle password visibility')}
            // validationRules={{ required: 'This field is required' }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          {/* Number Input */}
          <RHTextField
            variant="outlined"
            name="age"
            label="Age"
            type="number"
            defaultValue={10}
            // validationRules={{ required: 'This field is required' }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          {/* Date Picker */}
          <RHTextField
            variant="outlined"
            name="dob"
            label="Date of Birth"
            type="date"
            // validationRules={{ required: 'This field is required' }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          {/* File Upload */}
          <RHTextField
            variant="outlined"
            name="profilePic"
            label="Upload Profile Picture"
            defaultValue={''}
            type="file"
            // validationRules={{ required: 'This field is required' }}
            fileInputOptions={{
              accept: '.jpeg,.jpg,.png',
              maxSize: 3 * 1024 * 1024, // 1 MB
              multiple: false,
            }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
          />

          <RHTextField
            name="documents"
            label="Documents"
            type="file"
            variant="outlined"
            fileInputOptions={{
              accept: '.pdf,.doc,.docx,application/pdf,.csv',
              maxSize: 5 * 1024 * 1024, // 5 MB
              multiple: true,
            }}
            onBlur={(e) => console.log('Blur event triggered', e)}
            onFocus={(e) => console.log('Focus event triggered', e)}
            onChange={(e) =>
              console.log('Change event triggered', e.target.value)
            }
            enableDragDrop={true}
          />

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default RHTextFieldPlayground;
