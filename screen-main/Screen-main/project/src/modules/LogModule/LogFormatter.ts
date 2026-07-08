import type { LogEntry } from './LogEntry';

export class LogFormatter {
  format(entry: LogEntry): string {
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}${context}`;
  }
}
