import { Page } from 'playwright';
import { Logger } from './logger';

export async function captureFailureEvidence(
  page: Page,
  screenshotPath: string,
  Logger: Logger
): Promise<void> {
  try {
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(500);

    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (err) {
    Logger.error(`❌ Failed to capture failure evidence: ${err}`);
  }
}
