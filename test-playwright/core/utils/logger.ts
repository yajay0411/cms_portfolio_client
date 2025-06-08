import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LoggerOptions {
  logLevel?: LogLevel;
  logToFile?: boolean;
  logFilePath?: string;
}

interface Metadata {
  [key: string]: unknown;
}

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLOR_MAP: Record<LogLevel, chalk.Chalk> = {
  error: chalk.red.bold,
  warn: chalk.yellow,
  info: chalk.cyan,
  debug: chalk.gray,
};

export class Logger {
  private logLevel: LogLevel;
  private logToFile: boolean;
  private logFilePath: string;

  constructor(options: LoggerOptions = {}) {
    this.logLevel = options.logLevel || 'info';
    this.logToFile = options.logToFile || false;
    this.logFilePath = options.logFilePath || path.join(process.cwd(), 'logs');

    if (this.logToFile) {
      fs.mkdirSync(this.logFilePath, { recursive: true });
    }
  }

  public info(message: string, metadata?: Metadata): void {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: Metadata): void {
    this.log('warn', message, metadata);
  }

  public error(message: string, error?: Error, metadata?: Metadata): void {
    const combinedMeta = {
      ...metadata,
      ...(error ? { stack: error.stack } : {}),
    };
    this.log('error', message, combinedMeta);
  }

  public debug(message: string, metadata?: Metadata): void {
    this.log('debug', message, metadata);
  }

  private log(level: LogLevel, message: string, metadata: Metadata = {}): void {
    if (LEVELS[level] > LEVELS[this.logLevel]) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      metadata,
    };

    const coloredLevel = COLOR_MAP[level](`[${logEntry.level}]`);
    const coloredTimestamp = chalk.yellowBright(logEntry.timestamp);
    const consoleOutput =
      `${coloredTimestamp} ${coloredLevel} ${chalk.magentaBright(message)}` +
      (Object.keys(metadata).length
        ? ` ${chalk.gray(JSON.stringify(metadata))}`
        : '');

    if (level === 'error') {
      console.error(consoleOutput);
    } else {
      console.log(consoleOutput);
    }

    this.writeToFile(logEntry);
  }

  private writeToFile(entry: Record<string, unknown>): void {
    if (!this.logToFile) return;

    const logFileName = `app-log-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(this.logFilePath, logFileName);

    try {
      fs.appendFileSync(logFilePath, JSON.stringify(entry) + '\n');
    } catch (err) {
      console.error('Logger error: Failed to write to log file', err);
    }
  }
}
