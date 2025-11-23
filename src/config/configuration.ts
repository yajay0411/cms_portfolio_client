import * as yup from 'yup';

/**
 * Step 1: Define Yup schema for validation
 */
const configSchema = yup.object({
  APP_NAME: yup.string().required('APP_NAME is required'),
  ENVIRONMENT: yup.string().oneOf(['DEVELOPMENT', 'PRODUCTION']).required('ENVIRONMENT is required and must be valid').default('DEVELOPMENT'),
  API_BASE_URL: yup.string().required(),
  GOOGLE_CLIENT_ID: yup.string().required('GOOGLE_CLIENT_ID is required')
});

/**
 * Step 2: Extract env values from Vite
 * NOTE: Vite env always starts with import.meta.env.VITE_*
 */
const rawConfig = {
  APP_NAME: import.meta.env.VITE_REACT_APP_NAME,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

/**
 * Step 3: Validate config at runtime (during dev / build)
 */
let validatedConfig: yup.InferType<typeof configSchema>;

try {
  validatedConfig = configSchema.validateSync(rawConfig, {
    abortEarly: false, // show all errors
    stripUnknown: true
  });
} catch (err) {
  console.error('❌ Invalid environment configuration:');
  if (err instanceof yup.ValidationError) {
    err.errors.forEach((e) => console.error(' - ' + e));
  }
  throw new Error('Environment validation failed. Fix env variables.');
}

/**
 * Step 4: Freeze & export the validated config
 */
export const AppConfig = Object.freeze(validatedConfig);

/**
 * Step 5: Export TypeScript type for easy use in your app
 */
export type AppConfigType = typeof AppConfig;
