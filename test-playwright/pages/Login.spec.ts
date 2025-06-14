import { test, expect } from '@playwright/test';
import { TestService } from '../core/test.service';
import { TEST_IDS } from '../../src/constants/testIds';
import { TestDataFactory } from '../core/utils/test-data-factory';
import { cleanupMocks, initMocks } from '../core/mocks/setup';

test.describe('Login Page Tests', () => {
  let testService: TestService;
  const validUser = TestDataFactory.generateValidLoginCredentials();
  const invalidUsers = TestDataFactory.generateInvalidLoginCredentials();

  test.beforeAll(async () => {
    await initMocks();
  });

  test.afterAll(async () => {
    await cleanupMocks();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display correct page title', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-page-title',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        await expect(page).toHaveTitle(/CMS-Portfolio/);
      },
      {
        actionName: 'Verify page title',
        captureEvidence: true,
      }
    );
  });

  test('should display all login form elements', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-form-elements',
      testSuite: 'LoginSuite',
    });
    await testService.tryCatchHandler(
      async () => {
        const {
          page: videoPage,
          context: videoContext,
          cleanup,
        } = await testService.createVideoContext('login-form-elements');

        const videoTestService = new TestService({
          page: videoPage,
          context: videoContext,
          browserName: process.env.BROWSER || 'chromium',
          testName: 'login-form-elements',
          testSuite: 'LoginSuite',
        });

        try {
          await videoPage.goto('/login');

          await videoTestService.highlightMultipleAndCapture([
            TEST_IDS.login.emailInput,
            TEST_IDS.login.passwordInput,
            TEST_IDS.login.loginButton,
            TEST_IDS.login.forgotPasswordLink,
            TEST_IDS.login.signupLink,
            TEST_IDS.login.themeToggle,
          ]);
          // Verify email input
          await videoTestService.debugHighlight(TEST_IDS.login.emailInput);
          await expect(
            videoTestService.getLocator(TEST_IDS.login.emailInput)
          ).toBeVisible();

          // Verify password input
          await videoTestService.debugHighlight(TEST_IDS.login.passwordInput);
          await expect(
            videoTestService.getLocator(TEST_IDS.login.passwordInput)
          ).toBeVisible();

          // Verify login button
          await videoTestService.debugHighlight(TEST_IDS.login.loginButton);
          await expect(
            videoTestService.getLocator(TEST_IDS.login.loginButton)
          ).toBeVisible();

          // Verify forgot password link
          await videoTestService.debugHighlight(
            TEST_IDS.login.forgotPasswordLink
          );
          await expect(
            videoTestService.getLocator(TEST_IDS.login.forgotPasswordLink)
          ).toBeVisible();

          // Verify signup link
          await expect(
            videoTestService.getLocator(TEST_IDS.login.signupLink)
          ).toBeVisible();

          // Verify theme toggle
          await videoTestService.debugHighlight(TEST_IDS.login.themeToggle);
          await expect(
            videoTestService.getLocator(TEST_IDS.login.themeToggle)
          ).toBeVisible();
        } finally {
          await cleanup();
        }
      },
      {
        actionName: 'Verify login form elements',
        captureEvidence: true,
      }
    );
  });

  test('should successfully login with valid credentials', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-valid-credentials',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        // Fill in valid credentials
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          validUser.email
        );
        await testService.handleInput(
          TEST_IDS.login.passwordInput,
          'fill',
          validUser.password
        );

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/login', {
          method: 'POST',
          status: 200,
        });

        await testService.handleInput(TEST_IDS.login.loginButton, 'click');
        const { body } = await apiPromise;
        const userRole = body?.user?.role;

        if (userRole === 'admin') {
          await expect(testService.page).toHaveURL(/.*admin\/dashboard/);
        } else {
          await expect(testService.page).toHaveURL(/.*user\/portfolio/);
        }
      },
      {
        actionName: 'Login with valid credentials',
        captureEvidence: true,
      }
    );
  });

  test('should show error with invalid password', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-invalid-password',
      testSuite: 'LoginSuite',
    });

    const invalidUser = invalidUsers[0];

    await testService.tryCatchHandler(
      async () => {
        // Fill in invalid credentials
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          validUser.email
        );
        await testService.handleInput(
          TEST_IDS.login.passwordInput,
          'fill',
          invalidUser.password
        );

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/login', {
          method: 'POST',
          status: 400,
        });

        // Click login button
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');

        const { response, body } = await apiPromise;

        // Verify error message
        expect(response.status()).toBe(400);
        expect(body.message).toBe('Invalid email address or password');
      },
      {
        actionName: 'Login with valid email and invalid password',
        captureEvidence: true,
      }
    );
  });

  test('should show error with invalid email', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-invalid-email',
      testSuite: 'LoginSuite',
    });

    const invalidUser = invalidUsers[0];

    await testService.tryCatchHandler(
      async () => {
        // Fill in invalid credentials
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          invalidUser.email
        );
        await testService.handleInput(
          TEST_IDS.login.passwordInput,
          'fill',
          invalidUser.password
        );

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/login', {
          method: 'POST',
        });

        // Click login button
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');

        const { response, body } = await apiPromise;

        // Verify error message
        expect(response.status()).toBe(404);
        expect(body.message).toBe('user not found');
      },
      {
        actionName: 'Login with invalid email',
        captureEvidence: true,
      }
    );
  });

  test('should validate form fields', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-form-validation',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        // Try to submit empty form
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');

        // Verify validation messages
        expect(
          await testService
            .getLocator(`${TEST_IDS.login.emailInput}-error`)
            .innerText()
        ).toBe('Please enter your email');

        expect(
          await testService
            .getLocator(`${TEST_IDS.login.passwordInput}-error`)
            .innerText()
        ).toBe('Please enter your password');

        // Try invalid email format
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          'invalid-email'
        );
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');
        expect(
          await testService
            .getLocator(`${TEST_IDS.login.emailInput}-error`)
            .innerText()
        ).toBe('Please enter a valid email address');
      },
      {
        actionName: 'Form validation',
        captureEvidence: true,
      }
    );
  });

  test('should toggle between dark and light mode', async ({
    page,
    context,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: process.env.BROWSER || 'chromium',
      testName: 'theme-toggle',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        // Create video context for recording theme toggle
        const {
          page: videoPage,
          context: videoContext,
          cleanup,
        } = await testService.createVideoContext('theme-toggle');

        const videoTestService = new TestService({
          page: videoPage,
          context: videoContext,
          browserName: process.env.BROWSER || 'chromium',
          testName: 'theme-toggle',
          testSuite: 'LoginSuite',
        });

        try {
          await videoPage.goto('/login');

          // Initial state check - verify light mode by default
          videoTestService.logger.info('Checking initial light mode state');
          await videoTestService.debugHighlight(TEST_IDS.login.themeToggle);

          // Toggle to dark mode
          videoTestService.logger.info('Toggling to dark mode');
          await videoTestService.handleInput(
            TEST_IDS.login.themeToggle,
            'click'
          );

          // Verify dark mode applied
          await videoTestService.waitForTimeout(500); // Wait for transition
          videoTestService.logger.info('Verifying dark mode styles');
          await videoTestService.highlightMultipleAndCapture([
            TEST_IDS.login.themeToggle,
            TEST_IDS.login.themeToggle,
          ]);

          // Toggle back to light mode
          videoTestService.logger.info('Toggling back to light mode');
          await videoTestService.handleInput(
            TEST_IDS.login.themeToggle,
            'click'
          );

          // Verify light mode restored
          await videoTestService.waitForTimeout(500); // Wait for transition
          videoTestService.logger.info('Verifying light mode styles restored');
          await videoTestService.highlightMultipleAndCapture([
            TEST_IDS.login.themeToggle,
            TEST_IDS.login.themeToggle,
          ]);
        } finally {
          await cleanup();
        }
      },
      {
        actionName: 'Theme toggle test',
        captureEvidence: true,
      }
    );
  });

  test('should navigate to register form when clicking signup link', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'signup-link-navigation',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        // Click signup link
        await testService.handleInput(TEST_IDS.login.signupLink, 'click');

        // Verify register form elements are visible
        await expect(testService.page).toHaveURL(/.*register/);
      },
      {
        actionName: 'Navigate to register form',
        captureEvidence: true,
      }
    );
  });

  test.only('should show validation error for forgot password email', async ({
    page,
    context,
    browserName,
  }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'forgot-password-email-validation',
      testSuite: 'LoginSuite',
    });

    await testService.tryCatchHandler(
      async () => {
        // Click forgot password link
        await testService.handleInput(
          TEST_IDS.login.forgotPasswordLink,
          'click'
        );

        // Verify snackbar is visible
        await testService.highlightMultipleAndCapture([
          {
            className: TEST_IDS.login.snackbarForgotPassward,
          },
        ]);
        await expect(
          testService.getLocator('', {
            className: TEST_IDS.login.snackbarForgotPassward,
          })
        ).toBeVisible();

        //Add valiad email and click on forgot password.
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          validUser.email
        );

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/forgot-password', {
          method: 'PUT',
          status: 200,
        });

        await testService.handleInput(
          TEST_IDS.login.forgotPasswordLink,
          'click'
        );

        const { body } = await apiPromise;
        const success = body;

        // Verify success of api.
        expect(success).toBeTruthy();
      },
      {
        actionName: 'Forgot password email validation',
        captureEvidence: true,
      }
    );
  });
});
