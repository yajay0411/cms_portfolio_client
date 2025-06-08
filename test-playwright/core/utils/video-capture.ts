// test_playwright/utils/createVideoContext.ts
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';

export type TVideoContext = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  cleanup: () => Promise<void>;
};

export async function createVideoContext(
  testName: string,
  path: string,
  logger: Logger
): Promise<TVideoContext> {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: path,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  const cleanup = async () => {
    const video = await page.video()?.path();
    await context.close();
    await browser.close();
    if (video) {
      logger.info(`🎥 [${testName}]-${path}`);
    }
  };

  return { browser, context, page, cleanup };
}
