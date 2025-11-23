import { test, expect } from '@playwright/test';
import { TestService } from '../core/test.service';
import { TEST_IDS } from '../../src/constants/testIds';
import { TestDataFactory } from '../core/utils/test-data-factory';
import { cleanupMocks, initMocks } from '../core/mocks/setup';

test.describe('Register Page Tests', () => {
  let testService: TestService;
  const validUser = TestDataFactory.generateValidRegisterCredentials();
  // const invalidUsers = TestDataFactory.generateInvalidRegisterCredentials();

  test.beforeAll(async () => {
    await initMocks();
  });

  test.afterAll(async () => {
    await cleanupMocks();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display correct page title', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'register-page-title',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        await expect(page).toHaveTitle(/CMS-Portfolio/);
      },
      {
        actionName: 'Verify page title',
        captureEvidence: true
      }
    );
  });

  test('should display all register form elements', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'register-form-elements',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        const { page: videoPage, context: videoContext, cleanup } = await testService.createVideoContext('register-form-elements');

        const videoTestService = new TestService({
          page: videoPage,
          context: videoContext,
          browserName: browserName || 'chromium',
          testName: 'register-form-elements',
          testSuite: 'RegisterSuite'
        });

        try {
          await videoPage.goto('/register');

          await videoTestService.highlightMultipleAndCapture([
            TEST_IDS.register.nameInput,
            TEST_IDS.register.emailInput,
            TEST_IDS.register.phoneNumberInput,
            TEST_IDS.register.passwordInput,
            TEST_IDS.register.profileImageInput,
            TEST_IDS.register.consentCheckbox,
            TEST_IDS.register.registerButton,
            TEST_IDS.register.loginLink,
            TEST_IDS.register.themeToggle
          ]);

          // Verify all form elements are visible
          await videoTestService.debugHighlight(TEST_IDS.register.nameInput);
          await expect(videoTestService.getLocator(TEST_IDS.register.nameInput)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.emailInput);
          await expect(videoTestService.getLocator(TEST_IDS.register.emailInput)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.phoneNumberInput);
          await expect(videoTestService.getLocator(TEST_IDS.register.phoneNumberInput)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.passwordInput);
          await expect(videoTestService.getLocator(TEST_IDS.register.passwordInput)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.profileImageInput);
          await expect(videoTestService.getLocator(TEST_IDS.register.profileImageInput)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.consentCheckbox);
          await expect(videoTestService.getLocator(TEST_IDS.register.consentCheckbox)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.registerButton);
          await expect(videoTestService.getLocator(TEST_IDS.register.registerButton)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.loginLink);
          await expect(videoTestService.getLocator(TEST_IDS.register.loginLink)).toBeVisible();
          await videoTestService.debugHighlight(TEST_IDS.register.themeToggle);
          await expect(videoTestService.getLocator(TEST_IDS.register.themeToggle)).toBeVisible();
        } finally {
          await cleanup();
        }
      },
      {
        actionName: 'Verify register form elements',
        captureEvidence: true
      }
    );
  });

  test('should successfully register with valid credentials', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'register-valid-credentials',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        // Fill in valid credentials
        await testService.handleInput(TEST_IDS.register.nameInput, 'fill', validUser.name);
        await testService.handleInput(TEST_IDS.register.emailInput, 'fill', validUser.email);
        await testService.handleInput(TEST_IDS.register.phoneNumberInput, 'fill', validUser.mobile);
        await testService.handleInput(TEST_IDS.register.passwordInput, 'fill', validUser.password);
        await testService.handleInput(TEST_IDS.register.consentCheckbox, 'click');

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/register', {
          method: 'POST',
          status: 201
        });

        await testService.handleInput(TEST_IDS.register.registerButton, 'click');
        const { body } = await apiPromise;

        // Verify successful registration
        expect(body.message).toBe('The operation has been successful');
        await expect(testService.page).toHaveURL(/.*login/);
      },
      {
        actionName: 'Register with valid credentials',
        captureEvidence: true
      }
    );
  });

  test('should not register with repeated email', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'register-valid-credentials',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        // Fill in valid credentials
        await testService.handleInput(TEST_IDS.register.nameInput, 'fill', validUser.name);
        await testService.handleInput(TEST_IDS.register.emailInput, 'fill', validUser.email);
        await testService.handleInput(TEST_IDS.register.phoneNumberInput, 'fill', validUser.mobile);
        await testService.handleInput(TEST_IDS.register.passwordInput, 'fill', validUser.password);
        await testService.handleInput(TEST_IDS.register.consentCheckbox, 'click');

        // Start listening before triggering
        const apiPromise = testService.waitForApiCall('/auth/register', {
          method: 'POST',
          status: 403
        });

        await testService.handleInput(TEST_IDS.register.registerButton, 'click');
        const { body } = await apiPromise;

        // Verify successful registration
        expect(body.message).toBe('user already exist with john.doe1@example.com');
        await testService.highlightMultipleAndCapture([
          {
            className: TEST_IDS.register.snackbarUserEmailAlreadyExist
          }
        ]);
        await expect(
          testService.getLocator('', {
            className: TEST_IDS.register.snackbarUserEmailAlreadyExist
          })
        ).toBeVisible();
      },
      {
        actionName: 'Register with valid credentials',
        captureEvidence: true
      }
    );
  });

  // test('should show error with invalid email format', async ({
  //   page,
  //   context,
  //   browserName,
  // }) => {
  //   testService = new TestService({
  //     page,
  //     context,
  //     browserName: browserName || 'chromium',
  //     testName: 'register-invalid-email',
  //     testSuite: 'RegisterSuite',
  //   });

  //   const invalidUser = invalidUsers[0];

  //   await testService.tryCatchHandler(
  //     async () => {
  //       // Fill in invalid email
  //       await testService.handleInput(
  //         TEST_IDS.register.nameInput,
  //         'fill',
  //         validUser.name
  //       );
  //       await testService.handleInput(
  //         TEST_IDS.register.emailInput,
  //         'fill',
  //         invalidUser.email
  //       );
  //       await testService.handleInput(
  //         TEST_IDS.register.phoneNumberInput,
  //         'fill',
  //         validUser.mobile
  //       );
  //       await testService.handleInput(
  //         TEST_IDS.register.passwordInput,
  //         'fill',
  //         validUser.password
  //       );
  //       await testService.handleInput(
  //         TEST_IDS.register.consentCheckbox,
  //         'click'
  //       );

  //       // Start listening before triggering
  //       const apiPromise = testService.waitForApiCall('/auth/register', {
  //         method: 'POST',
  //         status: 400,
  //       });

  //       await testService.handleInput(
  //         TEST_IDS.register.registerButton,
  //         'click'
  //       );
  //       const { response, body } = await apiPromise;

  //       // Verify error message
  //       expect(response.status()).toBe(400);
  //       expect(body.message).toBe('Please enter a valid email address');
  //     },
  //     {
  //       actionName: 'Register with invalid email',
  //       captureEvidence: true,
  //     }
  //   );
  // });

  test('should validate form fields before submission', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'register-form-validation',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        const { page: videoPage, context: videoContext, cleanup } = await testService.createVideoContext('register-form-validation');

        const videoTestService = new TestService({
          page: videoPage,
          context: videoContext,
          browserName: browserName || 'chromium',
          testName: 'register-form-validation',
          testSuite: 'RegisterSuite'
        });

        try {
          await videoPage.goto('/register');

          // Test 1: Try submitting empty form
          await videoTestService.handleInput(TEST_IDS.register.registerButton, 'click');
          await videoTestService.highlightMultipleAndCapture([
            `${TEST_IDS.register.nameInput}-error`,
            `${TEST_IDS.register.emailInput}-error`,
            `${TEST_IDS.register.phoneNumberInput}-error`,
            `${TEST_IDS.register.passwordInput}-error`
          ]);

          // Test 2: Invalid email format
          await videoTestService.handleInput(TEST_IDS.register.emailInput, 'fill', 'invalid-email');
          await videoTestService.handleInput(TEST_IDS.register.registerButton, 'click');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.emailInput]);

          // Test 3: Invalid phone number format
          await videoTestService.handleInput(
            TEST_IDS.register.phoneNumberInput,
            'fill',
            '123' // Too short
          );
          await videoTestService.handleInput(TEST_IDS.register.registerButton, 'click');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.phoneNumberInput]);

          // Test 4: Weak password
          await videoTestService.handleInput(TEST_IDS.register.passwordInput, 'fill', 'weak');
          await videoTestService.handleInput(TEST_IDS.register.registerButton, 'click');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.passwordInput]);

          // Test 5: Valid data but no consent
          await videoTestService.handleInput(TEST_IDS.register.nameInput, 'fill', 'John Doe');
          await videoTestService.handleInput(TEST_IDS.register.emailInput, 'fill', 'john.doe@example.com');
          await videoTestService.handleInput(TEST_IDS.register.phoneNumberInput, 'fill', '9123456789');
          await videoTestService.handleInput(TEST_IDS.register.passwordInput, 'fill', 'Test@123');
          await videoTestService.handleInput(TEST_IDS.register.registerButton, 'click');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.consentCheckbox]);

          // Verify no API call was made during validation
          const apiPromise = videoTestService
            .waitForApiCall('/auth/register', {
              method: 'POST',
              timeout: 1000 // Short timeout since we expect no call
            })
            .catch(() => null); // Catch the timeout error

          expect(await apiPromise).toBeNull();
        } finally {
          await cleanup();
        }
      },
      {
        actionName: 'Register form validation',
        captureEvidence: true
      }
    );
  });

  test('should navigate to login page when clicking login link', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'login-link-navigation',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        // Click login link
        await testService.handleInput(TEST_IDS.register.loginLink, 'click');

        // Verify login page URL
        await expect(testService.page).toHaveURL(/.*login/);
      },
      {
        actionName: 'Navigate to login page',
        captureEvidence: true
      }
    );
  });

  test('should toggle between dark and light mode', async ({ page, context, browserName }) => {
    testService = new TestService({
      page,
      context,
      browserName: browserName || 'chromium',
      testName: 'theme-toggle',
      testSuite: 'RegisterSuite'
    });

    await testService.tryCatchHandler(
      async () => {
        const { page: videoPage, context: videoContext, cleanup } = await testService.createVideoContext('theme-toggle');

        const videoTestService = new TestService({
          page: videoPage,
          context: videoContext,
          browserName: browserName || 'chromium',
          testName: 'theme-toggle',
          testSuite: 'RegisterSuite'
        });

        try {
          await videoPage.goto('/register');

          // Initial state check - verify light mode by default
          videoTestService.logger.info('Checking initial light mode state');
          await videoTestService.debugHighlight(TEST_IDS.register.themeToggle);

          // Toggle to dark mode
          videoTestService.logger.info('Toggling to dark mode');
          await videoTestService.handleInput(TEST_IDS.register.themeToggle, 'click');

          // Verify dark mode applied
          await videoTestService.waitForTimeout(500); // Wait for transition
          videoTestService.logger.info('Verifying dark mode styles');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.themeToggle, TEST_IDS.register.themeToggle]);

          // Toggle back to light mode
          videoTestService.logger.info('Toggling back to light mode');
          await videoTestService.handleInput(TEST_IDS.register.themeToggle, 'click');

          // Verify light mode restored
          await videoTestService.waitForTimeout(500); // Wait for transition
          videoTestService.logger.info('Verifying light mode styles restored');
          await videoTestService.highlightMultipleAndCapture([TEST_IDS.register.themeToggle]);
        } finally {
          await cleanup();
        }
      },
      {
        actionName: 'Theme toggle test',
        captureEvidence: true
      }
    );
  });
});
