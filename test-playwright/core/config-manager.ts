interface ConfigOptions {
  retry?: {
    maxAttempts?: number;
    baseDelay?: number;
    exponentialBackoff?: boolean;
  };
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    toFile?: boolean;
    path?: string;
  };
  reporting?: {
    outputPath?: string;
  };
}

export class ConfigManager {
  private config: ConfigOptions;
  private defaultConfig: ConfigOptions = {
    retry: {
      maxAttempts: 3,
      baseDelay: 1000,
      exponentialBackoff: true,
    },
    logging: {
      level: 'info',
      toFile: false,
      path: './logs',
    },
    reporting: {
      outputPath: './test-results',
    },
  };

  constructor(config: Partial<ConfigOptions> = {}) {
    this.config = this.mergeConfigs(this.defaultConfig, config);
  }

  /**
   * Get a configuration value with a default fallback
   * @param key Dot-notation path to the config value
   * @param defaultValue Default value if not found
   * @returns The configuration value or default
   */
  get<T>(key: string, defaultValue: T): T {
    const value = this.getNestedValue(this.config, key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Set a configuration value
   * @param key Dot-notation path to the config value
   * @param value Value to set
   */
  set(key: string, value: any): void {
    this.setNestedValue(this.config, key, value);
  }

  /**
   * Get all configuration
   * @returns Complete configuration object
   */
  getAll(): ConfigOptions {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.config = { ...this.defaultConfig };
  }

  /**
   * Merge two configuration objects
   * @param target Target configuration
   * @param source Source configuration to merge
   * @returns Merged configuration
   */
  private mergeConfigs(
    target: ConfigOptions,
    source: Partial<ConfigOptions>
  ): ConfigOptions {
    const result = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        result[key] = this.mergeConfigs(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Get a nested value from an object using dot notation
   * @param obj Object to search
   * @param path Dot-notation path
   * @returns The value at the path or undefined
   */
  private getNestedValue(obj: any, path: string): any {
    return path
      .split('.')
      .reduce(
        (current, key) =>
          current && current[key] !== undefined ? current[key] : undefined,
        obj
      );
  }

  /**
   * Set a nested value in an object using dot notation
   * @param obj Object to modify
   * @param path Dot-notation path
   * @param value Value to set
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}
