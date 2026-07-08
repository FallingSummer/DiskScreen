import type { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';
import { DefaultLogConfig, type LogConfig } from './LogConfig';
import { LogFormatter } from './LogFormatter';
import { LogStorage } from './LogStorage';
import { LogUploader } from './LogUploader';

export class Logger {
  private static instance: Logger;
  private readonly formatter = new LogFormatter();
  private readonly storage = new LogStorage();
  private readonly uploader = new LogUploader();
  private config: LogConfig = DefaultLogConfig;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  debug(message: string, context?: Record<string, unknown>, module = 'App'): void {
    this.write(LogLevel.Debug, message, context, module);
  }

  info(message: string, context?: Record<string, unknown>, module = 'App'): void {
    this.write(LogLevel.Info, message, context, module);
  }

  warn(message: string, context?: Record<string, unknown>, module = 'App'): void {
    this.write(LogLevel.Warn, message, context, module);
  }

  error(message: string, context?: Record<string, unknown>, module = 'App'): void {
    this.write(LogLevel.Error, message, context, module);
  }

  fatal(message: string, context?: Record<string, unknown>, module = 'App'): void {
    this.write(LogLevel.Fatal, message, context, module);
  }

  private write(level: LogLevel, message: string, context: Record<string, unknown> | undefined, module: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      context,
    };

    if (!this.shouldLog(level)) {
      return;
    }

    const formatted = this.formatter.format(entry);
    console.log(formatted);

    if (this.config.enableStorage) {
      this.storage.save(entry);
    }

    if (this.config.enableUpload) {
      void this.uploader.upload(entry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Fatal];
    const currentIndex = levels.indexOf(this.config.level);
    const targetIndex = levels.indexOf(level);

    return targetIndex >= currentIndex;
  }
}

export const logger = Logger.getInstance();
