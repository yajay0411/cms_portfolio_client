import * as yup from 'yup';

const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export const LoginSchemaYup = yup.object().shape({
  provider: yup.string().required('Provider is required').oneOf(['EMAIL', 'MOBILE']),
  email: yup.string().email('Please enter a valid email address'),
  password: yup.string().min(6, 'Please enter at least 6 characters'),
  mobile: yup.string().min(10, 'Please enter a valid mobile number'),
  otp: yup.string().min(6, 'Please enter a valid OTP')
});
export type LoginSchema = yup.InferType<typeof LoginSchemaYup>;

export const EmailLoginSchemaYup = yup.object().shape({
  email: yup.string().required('Please enter your email').email('Please enter a valid email address'),
  password: yup.string().required('Please enter your password').min(6, 'Please enter at least 6 characters')
});
export type EmailLoginSchema = yup.InferType<typeof EmailLoginSchemaYup>;

export const MobileLoginSchemaYup = yup.object().shape({
  mobile: yup.string().required('Please enter your mobile number').min(10, 'Please enter a valid mobile number')
});
export type MobileLoginSchema = yup.InferType<typeof MobileLoginSchemaYup>;

export const MobileOtpSchemaYup = yup.object().shape({
  mobile: yup.string().required('Please enter your mobile number').min(10, 'Please enter a valid mobile number'),
  otp: yup.string().required('Please enter your OTP').min(6, 'Please enter a valid OTP')
});
export type MobileOtpSchema = yup.InferType<typeof MobileOtpSchemaYup>;

export const RegisterSchemaYup = yup.object().shape({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .required('Name is required'),

  email: yup.string().email('Invalid email format').required('Email is required'),

  mobile: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian number')
    .required('Phone number is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must not exceed 16 characters')
    .required('Password is required'),

  profile_image: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'File too large (max 2MB)', (value) => {
      console.log(value);
      return value ? value.size <= 5 * 1024 * 1024 : true;
    })
    .test('fileType', 'Unsupported image format', (value) => {
      return value ? SUPPORTED_IMAGE_FORMATS.includes(value.type) : true;
    }),

  consent: yup.boolean().oneOf([true], 'Consent is required')
});
export type RegisterSchema = yup.InferType<typeof RegisterSchemaYup>;

export const ResetPasswordSchemaYup = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must not exceed 16 characters')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});
export type ResetPasswordSchema = yup.InferType<typeof ResetPasswordSchemaYup>;
