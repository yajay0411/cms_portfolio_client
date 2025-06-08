import { test, expect } from '@playwright/test';
import { TestService } from '../core/test.service';
import { TEST_IDS } from '../../src/constants/testIds';

test.describe('Login Page Tests', () => {
  let testService: TestService;

  test.beforeEach(async ({ page, context }) => {
    testService = new TestService({
      page,
      context,
      browserName: context.browser()?.browserType().name() ?? 'unknown',
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
      browserName: context.browser()?.browserType().name() ?? 'unknown',
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
          await videoTestService.debugHighlight(TEST_IDS.login.signupLink);
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
      await cleanup(); // 🚨 ensure video is flushed and browser is closed
    }
  });
});
