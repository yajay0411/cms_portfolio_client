import { Page, BrowserContext, Locator, Response } from '@playwright/test';
import { Logger } from './utils/logger';
import { captureFailureEvidence } from './utils/evidence-capture';
import { retry } from './utils/retry-handler';
import {
  attachConsoleListener,
  IConsoleLogEntry,
} from './utils/console-listener';
import { ConfigManager } from './config-manager';
import path from 'path';
import { createVideoContext } from './utils/video-capture';
import { NetworkLogger } from './utils/network-logger';
import fs from 'fs';

export interface LocatorOptions {
  /** Text content to filter by */
  hasText?: string;
  /** ARIA role of the element */
  role?: string;
  /** Whether to find element by exact text match */
  exactText?: string;
  /** Whether to find element by partial text match */
  containsText?: string;
  /** Whether to find element by label text */
  label?: string;
  /** Whether to find element by placeholder text */
  placeholder?: string;
  /** Whether to find element by name attribute */
  name?: string;
  /** Whether to find element by type attribute */
  type?: string;
  /** Whether to find element by value attribute */
  value?: string;
  /** Whether to find element by class name */
  className?: string;
  /** Whether to find element by ID */
  id?: string;
  /** Whether to find element by nth index */
  nth?: number;
  /** Whether to find element by first occurrence */
  first?: boolean;
  /** Whether to find element by last occurrence */
  last?: boolean;
  /** Whether to find element by parent selector */
  parent?: string;
  /** Whether to find element by child selector */
  child?: string;
  /** Whether to find element by sibling selector */
  sibling?: string;
  /** Whether to find element by ancestor selector */
  ancestor?: string;
  /** Whether to find element by descendant selector */
  descendant?: string;
  /** Whether to find element by state */
  state?:
    | 'visible'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'checked'
    | 'unchecked';
}

/**
 * Service class for handling test operations and utilities
 */
export class TestService {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly browserName: string;
  readonly logger: Logger;
  readonly configManager: ConfigManager;
  private readonly testName: string;
  private readonly testSuite: string;
  // private readonly consoleLogs: IConsoleLogEntry[] = [];
  private readonly networkLogger: NetworkLogger;
  private readonly baseOutputPath: string;
  private readonly networkFailures: Array<{
    url: string;
    status: number;
    method: string;
    timestamp: string;
  }> = [];

  /**
   * Creates a new instance of TestService
   * @param options Configuration options for the test service
   * @param options.page Playwright Page object
   * @param options.context Playwright BrowserContext object
   * @param options.browserName Name of the browser being used
   * @param options.testName Name of the current test
   * @param options.testSuite Name of the test suite
   * @param options.configManager Optional ConfigManager instance
   */
  constructor(options: {
    page: Page;
    context: BrowserContext;
    browserName: string;
    testName: string;
    testSuite: string;
    configManager?: ConfigManager;
  }) {
    const { page, context, browserName, testName, testSuite, configManager } =
      options;
    this.page = page;
    this.context = context;
    this.browserName = browserName;
    this.testName = testName;
    this.testSuite = testSuite;
    this.configManager = configManager || new ConfigManager();

    this.baseOutputPath = this.configManager.get(
      'reporting.outputPath',
      'reports'
    );
    const testCasePath = path.join(this.baseOutputPath, testSuite, testName);

    // Create main test case directory
    fs.mkdirSync(testCasePath, { recursive: true });

    // Create subdirectories for different types of logs
    fs.mkdirSync(path.join(testCasePath, 'console-logs'), { recursive: true });
    fs.mkdirSync(path.join(testCasePath, 'screenshots'), { recursive: true });
    fs.mkdirSync(path.join(testCasePath, 'videos'), { recursive: true });

    this.logger = new Logger({
      logLevel: 'debug',
      logToFile: true,
      logFilePath: path.join(testCasePath, 'console-logs'),
    });

    this.networkLogger = new NetworkLogger(
      this.baseOutputPath,
      testSuite,
      testName
    );

    // attachConsoleListener(this.page, this.consoleLogs);
  }

  /**
   * Get a locator by test ID or a combination of filtering options
   * @param testId Optional test ID to start the locator from
   * @param options Locator options to refine the search
   * @returns A Playwright Locator
   */
  getLocator(testId?: string, options?: LocatorOptions): Locator {
    let locator: Locator;

    if (testId) {
      locator = this.page.getByTestId(testId);
    } else {
      // Start from all elements and apply filters
      locator = this.page.locator('*');
    }

    // ⬇ Text filters
    if (options?.hasText) {
      locator = locator.filter({ hasText: options.hasText });
    }
    if (options?.exactText) {
      locator = locator.filter({
        hasText: new RegExp(`^${options.exactText}$`),
      });
    }
    if (options?.containsText) {
      locator = locator.filter({ hasText: options.containsText });
    }

    // ⬇ Attribute-based filters
    if (options?.role) {
      locator = locator.locator(`[role="${options.role}"]`);
    }
    if (options?.label) {
      locator = locator.locator(`[aria-label="${options.label}"]`);
    }
    if (options?.placeholder) {
      locator = locator.locator(`[placeholder="${options.placeholder}"]`);
    }
    if (options?.name) {
      locator = locator.locator(`[name="${options.name}"]`);
    }
    if (options?.type) {
      locator = locator.locator(`[type="${options.type}"]`);
    }
    if (options?.value) {
      locator = locator.locator(`[value="${options.value}"]`);
    }
    if (options?.className) {
      locator = locator.locator(`.${options.className}`);
    }
    if (options?.id) {
      locator = locator.locator(`#${options.id}`);
    }

    // ⬇ Positional refinements
    if (options?.nth !== undefined) {
      locator = locator.nth(options.nth);
    }
    if (options?.first) {
      locator = locator.first();
    }
    if (options?.last) {
      locator = locator.last();
    }

    // ⬇ DOM relationship selectors
    if (options?.parent) {
      locator = locator.locator(`:scope > ${options.parent}`);
    }
    if (options?.child) {
      locator = locator.locator(`> ${options.child}`);
    }
    if (options?.sibling) {
      locator = locator.locator(`~ ${options.sibling}`);
    }
    if (options?.ancestor) {
      locator = locator.locator(`:has(${options.ancestor})`);
    }
    if (options?.descendant) {
      locator = locator.locator(`${options.descendant}`);
    }

    // ⬇ State-based filters
    if (options?.state) {
      switch (options.state) {
        case 'visible':
          locator = locator.filter({ visible: true });
          break;
        case 'hidden':
          locator = locator.filter({ visible: false });
          break;
        case 'enabled':
          locator = locator.locator(':not([disabled])');
          break;
        case 'disabled':
          locator = locator.locator('[disabled]');
          break;
        case 'checked':
          locator = locator.locator('[checked]');
          break;
        case 'unchecked':
          locator = locator.locator(':not([checked])');
          break;
      }
    }

    return locator;
  }

  /**
   * Execute an action with error handling and retry logic
   * @param action The action to execute
   * @param options Configuration options for the action
   * @param options.actionName Name of the action being performed
   * @param options.captureEvidence Whether to capture screenshots on success/failure
   * @param options.retryOptions Retry configuration options
   * @returns Promise that resolves when the action completes
   */
  async tryCatchHandler(
    action: () => Promise<void>,
    options: {
      actionName?: string;
      captureEvidence?: boolean;
      retryOptions?: { maxRetries?: number; baseDelay?: number };
    } = {}
  ): Promise<void> {
    const {
      actionName = 'Unnamed Action',
      captureEvidence: shouldCaptureEvidence = true,
      retryOptions = { maxRetries: 0, baseDelay: 1000 },
    } = options;

    this.logger.info(`Executing action: ${actionName}`);

    await retry(
      async () => {
        try {
          await action();

          if (shouldCaptureEvidence) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path.join(
              this.baseOutputPath,
              this.testSuite,
              this.testName,
              'screenshots',
              `${actionName.replace(/\s+/g, '_')}-success-${timestamp}.png`
            );
            await captureFailureEvidence(
              this.page,
              screenshotPath,
              this.logger
            );
          }
        } catch (err: any) {
          this.logger.error(`Error in ${actionName}: ${err.message}`);

          if (shouldCaptureEvidence) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path.join(
              this.baseOutputPath,
              this.testSuite,
              this.testName,
              'screenshots',
              `${actionName.replace(/\s+/g, '_')}-error-${timestamp}.png`
            );
            await captureFailureEvidence(
              this.page,
              screenshotPath,
              this.logger
            );
          }

          throw err;
        }
      },
      retryOptions.maxRetries ?? 0,
      retryOptions.baseDelay ?? 1000
    );
  }

  /**
   * Handle input actions on elements (fill, click, type)
   * @param selector Element selector or locator
   * @param action Type of input action to perform
   * @param value Optional value for fill/type actions
   * @returns Promise that resolves when the input action completes
   */
  async handleInput(
    selector: string | Locator,
    action: 'fill' | 'click' | 'type',
    value?: string
  ): Promise<void> {
    const locator =
      typeof selector === 'string' ? this.getLocator(selector) : selector;

    await locator.waitFor({
      state: 'visible',
      timeout: 5000,
    });

    switch (action) {
      case 'fill':
        await locator.fill(value ?? '');
        this.logger.debug(`Filled ${selector} with ${value}`);
        break;
      case 'click':
        await locator.click();
        this.logger.debug(`Clicked ${selector}`);
        break;
      case 'type':
        await locator.type(value ?? '');
        this.logger.debug(`Typed ${value} into ${selector}`);
        break;
      default:
        throw new Error(`Unsupported input action: ${action}`);
    }
  }

  /**
   * Highlight an element for debugging purposes
   * @param testId Test ID of the element to highlight
   * @param capture Whether to capture a screenshot of the highlighted element
   * @returns Promise that resolves when the highlight operation completes
   */
  async debugHighlight(
    testId: string,
    capture: boolean = false
  ): Promise<void> {
    const locator = this.getLocator(testId);
    const elementHandle = await locator.elementHandle();

    if (!elementHandle) {
      this.logger.warn(`Element not found for testId: ${testId}`);
      return;
    }

    // Scroll into view and highlight
    await elementHandle.evaluate((el) => {
      el.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });
      el.setAttribute('data-highlight-temp', el.style.outline || '');
      el.style.outline = '3px solid red';
    });

    await this.page.waitForTimeout(100);

    this.logger.info(`📸 Screenshot captured for: ${testId}`);

    if (capture) {
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(
        this.baseOutputPath,
        this.testSuite,
        this.testName,
        'screenshots',
        `${testId}-${timestamp}.png`
      );

      await elementHandle.screenshot({ path: screenshotPath });
      this.logger.debug(
        `📸 Screenshot captured for: ${testId} -> ${screenshotPath}`
      );
    }

    // Restore previous outline (if any)
    await elementHandle.evaluate((el) => {
      const previous = el.getAttribute('data-highlight-temp') || '';
      el.style.outline = previous;
      el.removeAttribute('data-highlight-temp');
    });
  }

  /**
   * Highlight multiple elements and capture a screenshot
   * @param testIds Array of test IDs to highlight
   * @returns Promise that resolves when all elements are highlighted and screenshot is captured
   */
  async highlightMultipleAndCapture(
    testIds: (string | LocatorOptions)[]
  ): Promise<void> {
    for (const id of testIds) {
      const locator =
        typeof id === 'string' ? this.getLocator(id) : this.getLocator('', id);

      await locator.waitFor({ state: 'visible', timeout: 10000 });
      const handle = await locator.elementHandle();
      if (!handle) continue;

      await handle.evaluate((el) => {
        el.style.outline = '1px solid red';
      });
    }

    // Wait for all highlights to render
    await this.page.waitForTimeout(200);

    const screenshotPath = path.join(
      this.baseOutputPath,
      this.testSuite,
      this.testName,
      'screenshots',
      `highlighted-all-ss-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
    );

    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }

  /**
   * Create a video context for recording test execution
   * @param title Optional title for the video recording
   * @returns Promise resolving to video context object with page, context, and cleanup function
   */
  async createVideoContext(title: string = '') {
    const videoDir = path.join(
      this.baseOutputPath,
      this.testSuite,
      this.testName,
      'videos',
      `${title}-${new Date().toISOString().replace(/[:.]/g, '-')}`
    );

    return await createVideoContext(this.testName, videoDir, this.logger);
  }

  /**
   * Wait for an API call and log its details
   * @param urlPattern URL pattern to match (string or regex)
   * @param options Additional options for the API call
   * @param options.method HTTP method to match
   * @param options.status Expected HTTP status code
   * @param options.timeout Maximum time to wait for the API call
   * @param options.logResponse Whether to log response details
   * @returns Promise resolving to response object and parsed body
   */
  async waitForApiCall(
    urlPattern: string | RegExp,
    options: {
      method?: string;
      status?: number;
      timeout?: number;
      logResponse?: boolean;
    } = {}
  ): Promise<{ response: Response; body: any }> {
    const {
      method = 'GET',
      status,
      timeout = 20000,
      logResponse = true,
    } = options;

    this.logger.info(`Waiting for API call: ${method} ${urlPattern}`);

    const response = await this.page.waitForResponse(
      (res) => {
        const url = res.url();
        const matchesUrl =
          typeof urlPattern === 'string'
            ? url.includes(urlPattern)
            : urlPattern.test(url);
        const matchesMethod = res.request().method() === method;
        const matchesStatus = !status || res.status() === status;
        return matchesUrl && matchesMethod && matchesStatus;
      },
      { timeout }
    );

    let body = null;
    try {
      body = await response.json();
    } catch (e) {
      this.logger.warn('Failed to parse API response JSON:', e);
    }

    // Log the network call
    await this.networkLogger.logResponse(response, body);

    // Add API call to network failures collector
    this.networkFailures.push({
      url: response.url(),
      status: response.status(),
      method: response.request().method(),
      timestamp: new Date().toISOString(),
    });

    if (logResponse) {
      this.logger.info('API Response (url):', { url: response.url() });
      this.logger.info('API Response (status):', { status: response.status() });
    }

    return { response, body };
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
