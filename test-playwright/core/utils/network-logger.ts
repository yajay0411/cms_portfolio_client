import fs from 'fs';
import path from 'path';
import { Response } from '@playwright/test';

export interface NetworkLogEntry {
  timestamp: string;
  url: string;
  method: string;
  status: number;
  requestBody?: any;
  responseBody?: any;
  duration?: number;
}

export class NetworkLogger {
  private logFilePath: string;
  private logs: NetworkLogEntry[] = [];

  constructor(
    outputPath: string = 'reports',
    testSuite: string,
    testCase: string
  ) {
    // Create the folder structure: reports/testSuite/testCase/network-calls
    const testCasePath = path.join(
      outputPath,
      testSuite,
      testCase,
      'network-calls'
    );

    // Create directory structure
    fs.mkdirSync(testCasePath, { recursive: true });

    this.logFilePath = path.join(
      testCasePath,
      `network-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    );
  }

  logNetworkCall(entry: NetworkLogEntry): void {
    this.logs.push(entry);
    this.writeToFile();
  }

  private writeToFile(): void {
    fs.writeFileSync(this.logFilePath, JSON.stringify(this.logs, null, 2));
  }

  async logResponse(response: Response, requestBody?: any): Promise<void> {
    const startTime = Date.now();
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = await response.text();
    }

    const entry: NetworkLogEntry = {
      timestamp: new Date().toISOString(),
      url: response.url(),
      method: response.request().method(),
      status: response.status(),
      requestBody,
      responseBody,
      duration: Date.now() - startTime,
    };

    this.logNetworkCall(entry);
  }
}
