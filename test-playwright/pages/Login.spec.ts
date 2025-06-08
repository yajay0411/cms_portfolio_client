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

  test.beforeEach(async ({ page, context }) => {
    testService = new TestService({
      page,
      context,
      browserName: 'chromium',
      testName: 'login-tests',
    });

    await testService.tryCatchHandler(
      async () => {
        await page.goto('/login');
      },
      {
        actionName: 'Navigate to login page',
        captureEvidence: true,
      }
    );
  });

  test('should display correct page title', async ({ page }) => {
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

  test('should display all login form elements', async () => {
    const { page, context, cleanup } = await testService.createVideoContext();
    await page.goto('/login');
    const videoTestService = new TestService({
      page,
      context,
      browserName: 'chromium',
      testName: 'login-form-video',
    });
    try {
      await videoTestService.tryCatchHandler(
        async () => {
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
        },
        {
          actionName: 'Verify login form elements',
          captureEvidence: true,
        }
      );
    } finally {
      await cleanup();
    }
  });

  test('should successfully login with valid credentials', async () => {
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

  test('should show error with invalid credentials', async () => {
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

        // Click login button
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');

        // Verify error message
        await expect(
          testService.page.getByText(/Invalid credentials/i)
        ).toBeVisible();
      },
      {
        actionName: 'Login with invalid credentials',
        captureEvidence: true,
      }
    );
  });

  test('should validate form fields', async () => {
    await testService.tryCatchHandler(
      async () => {
        // Try to submit empty form
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');

        // Verify validation messages
        await expect(
          testService.page.getByText(/Email is required/i)
        ).toBeVisible();
        await expect(
          testService.page.getByText(/Password is required/i)
        ).toBeVisible();

        // Try invalid email format
        await testService.handleInput(
          TEST_IDS.login.emailInput,
          'fill',
          'invalid-email'
        );
        await testService.handleInput(TEST_IDS.login.loginButton, 'click');
        await expect(
          testService.page.getByText(/Invalid email format/i)
        ).toBeVisible();
      },
      {
        actionName: 'Form validation',
        captureEvidence: true,
      }
    );
  });
});
