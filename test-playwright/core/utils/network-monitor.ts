import { Page, Request, Response } from 'playwright';

export interface INetworkFailureEntry {
  url: string;
  status: number | null;
  method: string;
  timestamp: string;
}

/**
 * Attach listener to capture failed network requests
 */
export function setupNetworkFailureCapture(
  page: Page,
  collector: INetworkFailureEntry[]
): void {
  page.on('response', async (response: Response) => {
    const status = response.status();
    if (status >= 400) {
      const request = response.request();
      collector.push({
        url: request.url(),
        status,
        method: request.method(),
        timestamp: new Date().toISOString(),
      });
    }
  });

  page.on('requestfailed', (request: Request) => {
    collector.push({
      url: request.url(),
      status: null,
      method: request.method(),
      timestamp: new Date().toISOString(),
    });
  });
}
