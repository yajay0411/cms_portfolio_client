import { Page, ConsoleMessage } from 'playwright';

export interface IConsoleLogEntry {
  type: string;
  text: string;
  timestamp: string;
}

/**
 * Attach a console listener to capture browser logs
 * @param page Playwright page object
 * @param collector Array to store captured console logs
 */
export function attachConsoleListener(
  page: Page,
  collector: IConsoleLogEntry[]
): void {
  page.on('console', (msg: ConsoleMessage) => {
    collector.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString(),
    });
  });
}
