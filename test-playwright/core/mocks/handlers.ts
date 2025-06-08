import { http, HttpResponse } from 'msw';
import { TestDataFactory } from '../utils/test-data-factory';

const validUser = TestDataFactory.generateValidLoginCredentials();

interface AuthRequestBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const handlers = [
  // Login handler
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as AuthRequestBody;

    if (
      body.email === validUser.email &&
      body.password === validUser.password
    ) {
      return HttpResponse.json({
        user: {
          id: '1',
          email: validUser.email,
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'valid-jwt-token',
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Invalid credentials',
    });
  }),

  // Register handler
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as AuthRequestBody;

    // Simulate email already exists
    if (body.email === validUser.email) {
      return new HttpResponse(null, {
        status: 409,
        statusText: 'Email already exists',
      });
    }

    return HttpResponse.json({
      user: {
        id: '2',
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
      },
      token: 'valid-jwt-token',
    });
  }),

  // Forgot password handler
  http.post('/api/auth/forgot-password', async ({ request }) => {
    const body = (await request.json()) as AuthRequestBody;

    if (body.email === validUser.email) {
      return HttpResponse.json({
        message: 'Password reset email sent',
      });
    }

    return new HttpResponse(null, {
      status: 404,
      statusText: 'User not found',
    });
  }),
];
