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
      exponentialBackoff: true
    },
    logging: {
      level: 'info',
      toFile: false,
      path: './logs'
    },
    reporting: {
      outputPath: './test-results/All_Suites'
    }
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
   * Deeply merges two configuration objects.
   * The `source` object overrides `target` values recursively.
   */
  private mergeConfigs<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result: T = { ...target };

    for (const key of Object.keys(source) as Array<keyof T>) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && typeof targetValue === 'object' && targetValue !== null) {
        // Recursively merge nested objects
        result[key] = this.mergeConfigs(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        // Override primitive or array values
        result[key] = sourceValue as T[keyof T];
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
    return path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
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
